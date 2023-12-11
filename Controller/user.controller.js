import userModel from "../Model/user.model";
import multer from "multer";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("./uploads")) {
      cb(null, "./uploads");
    } else {
      fs.mkdirSync("./uploads");
      cb(null, "./uploads");
    }
  },
  filename: function (req, file, cb) {
    const imgName = file.originalname;
    const imgArr = imgName.split(".");
    imgArr.pop();
    const extImg = path.extname(imgName);
    const imageName = imgArr.join(".") + "-" + Date.now() + extImg;
    cb(null, imageName);
  },
});

const upload = multer({ storage: storage });

export const getUsers = async (req, res) => {
  try {
    const userData = await userModel.find({ status: 1 });
    // console.log(userData);
    res.status(200).json({
      data: userData,
      message: "Successfully data is fetched",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user_ID = req.params.user_Id;
    // console.log(user_ID);
    const userData = await userModel.findOne({ status: 1, _id: user_ID });
    // console.log(userData);
    res.status(200).json({
      data: userData,
      message: "Successfully data is fetched",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const adduserData = async (req, res) => {
  try {
    const uploadFile = upload.single("avatar");
    uploadFile(req, res, function (err) {
      if (err) return res.status(400).json({ message: err.message });

      const { name, email, password, contact } = req.body;

      let image = "";
      if (req.file !== undefined) {
        image = req.file.filename;
      }

      const userData = new userModel({
        name: name,
        email: email,
        password: password,
        contact: contact,
        avatar: image,
      });
      userData.save();
      if (userData) {
        return res.status(200).json({
          data: userData,
          message: "Successfully data is Added !",
          
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const softDeleteUser = async (req, res) => {
  try {
    const user_ID = req.params.user_id;
    const softDelete = await userModel.updateOne(
      { _id: user_ID },
      { $set: { status: 0 } }
    );
    if (softDelete.acknowledged) {
      return res.status(200).json({
        message: "Delete Successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user_ID = req.params.user_id;
    const userData = await userModel.findOne({ _id: user_ID });
    const deleteUser = await userModel.deleteOne({ _id: user_ID });

    if (deleteUser.acknowledged) {
      if (fs.existsSync("./uploads/" + userData.avatar)) {
        fs.unlinkSync("./uploads/" + userData.avatar);
      }
      return res.status(200).json({
        message: "Delete Successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const uploadFile = upload.single("avatar");

    uploadFile(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });

      const user_ID = await req.params.user_id;
      const { name, email, password, contact } = req.body;

      const userData = await userModel.findOne({ _id: user_ID, status: 1 });
      if (!userData) {
        return res.status(404).json({ message: "user is not found !" });
      }

      let image = userData.avatar;

      if (req.file !== undefined) {
        image = req.file.filename;
        if (fs.existsSync("./uploads/" + userData.avatar)) {
          fs.unlinkSync("./uploads/" + userData.avatar);
        }
      }

      const updateUserData = await userModel.updateOne(
        { _id: user_ID },
        {
          $set: {
            name: name,
            email: email,
            password: password,
            contact: contact,
            avatar: image,
          },
        }
      );
      if (updateUserData.acknowledged) {
        res.status(200).json({
          message: "updated successfully",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// -------------------authotication------------------------------

// export const signUp = async (req, res) => {
//   try {
//     const { name, email, password, contact } = req.body;

//     const getUserData = await userModel.findOne({ email: email });

//     if (getUserData) {
//       return res.status(200).json({
//         message: "User already exist",
//       });
//     }
//     const newPassword = bcrypt.hashSync(password, 10);
//     console.log(newPassword);

//     const userData = new userModel({
//       name: name,
//       email: email,
//       password: newPassword,
//       contact: contact,
//     });
//     userData.save();

//     if (userData) {
//       return res.status(200).json({
//         data: userData,
//         message: "successfully Signed up !",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

export const signUp = async (req, res) => {
  try {
    const { name, email, password, contact } = req.body;

    // Check if the user already exists
    const getUserData = await userModel.findOne({ email: email });

    if (getUserData) {
      // User already exists
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // Hash the password
    const newPassword = bcrypt.hashSync(password, 10);

    // Create a new user
    const userData = new userModel({
      name: name,
      email: email,
      password: newPassword,  
      contact: contact,
    });

    // Save the user to the database
    const savedUserData = await userData.save();

    if (savedUserData) {
      // User registered successfully
      return res.status(200).json({
        data: savedUserData,
        message: "Successfully signed up!",
      });
    } else {
      // Some error occurred during registration
      return res.status(500).json({
        message: "Failed to register user",
      });
    }
  } catch (error) {
    // Handle other unexpected errors
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log("Received a sign-in request with credentials:", email);
    const userData = await userModel.findOne({ email: email });
    if (!userData) {
      return res.status(400).json({
        message: "User doesn't exist!",
      });
    }
    const comparePassword = bcrypt.compareSync(password, userData.password);
    if (!comparePassword) {
      return res.status(400).json({
        message: "Invalid credential",
      });
    }
    const token = jwt.sign(
      { userid: userData._id, email: userData.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.cookie("userdata", userData);
    return res.status(200).json({
      token: token,
      data: userData,
      message: "Successfully login",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
