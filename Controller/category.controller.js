import categoryModel from "../Model/category.model";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("./uploads")) {
      cb(null, "./uploads");
    } else {
      fs.mkdirSync("./uploads", true);
      cb(null, "./uploads");
    }
  },

  filename: function (req, file, cb) {
    const imgname = file.originalname;
    const imgarr = imgname.split(".");
    imgarr.pop();
    const imgExt = path.extname(imgname);
    const fname = imgarr.join(".") + "-" + Date.now() + imgExt;
    cb(null, fname);
  },
});

const upload = multer({ storage: storage });

export const getCategories = async (req, res) => {
  try {
    const categoryData = await categoryModel.find({ status: 1 });
    res.status(200).json({
      data: categoryData,
      message: "Successfully Data fatched",
      path: "http://localhost:8282/uploads",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getCategory = async (req, res) => {
  try {
    const categoryId = req.params._id;
    const categoryData = await categoryModel.findOne({
      status: 1,
      _id: categoryId,
    });

    res.status(200).json({
      data: categoryData,
      message: "Successfully Data fatched",
      path: "http://localhost:8282/uploads",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addCategory = async (req, res) => {
  try {
    const uploadFile = upload.single("avatar");

    uploadFile(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });
      const { name } = req.body;
      let image = "";
      if (req.file !== undefined) {
        image = req.file.filename;
      }

      const categoryData = new categoryModel({
        name: name,
        avatar: image,
      });
      categoryData.save();
      if (categoryData) {
        return res.status(201).json({
          data: categoryData,
          message: "successfully Data Added !",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const softDeleteCategoryData = async (req, res) => {
  try {
    const categoryId = req.params.user_id;
    const softDeleteCategory = await categoryModel.updateOne(
      { _id: categoryId },
      { $set: { status: 0 } }
    );
    if (softDeleteCategory.acknowledged) {
      return res.status(200).json({
        message: "Deleted successfully.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteCategoryData = async (req, res) => {
  try {
    const categoryId = req.params.user_id;
    const categoryData = await categoryModel.findOne({ _id: categoryId });
    const deletecategoryData = await categoryModel.deleteOne({
      _id: categoryId,
    });
    if (deletecategoryData.acknowledged) {
      if (fs.existsSync("./uploads/" + categoryData.avatar)) {
        fs.unlinkSync("./uploads/" + categoryData.avatar);
      }
      return res.status(200).json({
        message: "Deleted successfully.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateCategoryData = async (req, res) => {
  try {
    const categoryId = req.params.user_id;
    const { name } = req.body;

    const categoryData = await categoryModel.updateOne(
      { _id: categoryId },
      {
        $set: {
          name: name,
        },
      }
    );
    if (categoryData.acknowledged) {
      res.status(200).json({
        message: "Updated Successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
