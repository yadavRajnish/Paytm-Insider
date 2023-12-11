import multer from "multer";
import path from "path";
import fs from "fs";
import eventModel from "../Model/event.model";

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

export const getEvents = async (req, res) => {
  try {
    const categoryId = req.query.q;
    // console.log(categoryId);
    const eventData = await eventModel.find({
      status: 1,
      // categoryId: categoryId,
    });
    res.status(200).json({
      data: eventData,
      message: "Successfully event data fetched !",
      path: "http://localhost:8282:/uploads",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getEventsById = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const eventData = await eventModel.find({
      status: 1,
      categoryId: categoryId,
    });
    res.status(200).json({
      data: eventData,
      message: "Successfully event data fetched !",
      path: "http://localhost:8282:/uploads",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getEventsByEventId = async (req, res) => {
  try {
    const eventID = req.params._id;
    const eventData = await eventModel.find({
      status: 1,
      _id: eventID,
    });
    res.status(200).json({
      data: eventData,
      message: "Successfully event data fetched !",
      path: "http://localhost:8282:/uploads",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};




export const getEventData = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    // const categoryId = req.query.categoryId;
    const eventData = await eventModel.find({ status: 1 });
    res.status(200).json({
      data: eventData,
      message: "Successfully event data fetched !",
      path: "http://localhost:8282:/uploads",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getEventsTag = async (req, res) => {
  try {
    const eventNames = await eventModel
      .find({ status: 1 })
      .distinct("eventTag");
    res.status(200).json({
      data: eventNames,
      message: "successfully data fateched by query id",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getEventsByQuery = async (req, res) => {
  try {
    const categoryId = req.query.eventTag;
    // console.log(categoryId);
    const eventData = await eventModel.find({
      status: 1,
      eventTag: categoryId,
    });
    res.status(200).json({
      data: eventData,
      message: "successfully data fateched by query id",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// export const getEventData = async (req, res) => {
//   try {
//     const categoryId = req.params.categoryId;
//     // const categoryId = req.query.categoryId;
//     const eventData = await eventModel.find({categoryId : categoryId, status : 1})
//     res.status(200).json({
//       data: eventData,
//       message: "Successfully event data fetched !",
//       path: "http://localhost:8282:/uploads",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

export const addEvent = async (req, res) => {
  try {
    // const uploadFile = upload.array("images", 10);
    const uploadFile = upload.fields([
      { name: "image" },
      { name: "casteImage" },
    ]);

    uploadFile(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });

      // console.log("req.files", req.files);

      const {
        tittle,
        categoryId,
        eventMode,
        eventTag,
        startDate,
        endDate,
        time,
        location,
        onlineVideo,
        price,
        age,
        language,
        livePerformance,
        //   image,
        about,
        description,
        socialLink,
        venue,
        casteName,
      } = req.body;

      // const imageArr = req.files.casteImage?.map((file) => file.filename);
      const imageArr = req.files.image?.map((file) => file.filename);

      var castData = [];
      casteName?.forEach((elem, ind) => {
        castData?.push({ castName: elem, casteImage: imageArr[ind] });
      });
      // console.log(casteName);

      const eventData = new eventModel({
        tittle: tittle,
        categoryId: categoryId,
        eventMode: eventMode,
        eventTag: eventTag,
        startDate: startDate,
        endDate: endDate,
        time: time,
        location: location,
        onlineVideo: onlineVideo,
        price: price,
        age: age,
        language: language,
        livePerformance: livePerformance,
        // image: req.files.image[0].filename,
        image: imageArr,
        about: about,
        description: description,
        socialLink: socialLink,
        // castName : castName,
        caste: castData,
        venue: venue,
      });
      await eventData.save();

      res.status(200).json({
        message: "Successfully event data is Added !",
      });
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getEvent = async (req, res) => {
  try {
    const eventID = req.params._id;
    // console.log(eventID);

    const eventData = await eventModel.findOne({ status: 1, _id: eventID });

    if (!eventData) {
      return res.status(404).json({ message: "invalid id !" });
    }
    res.status(200).json({
      data: eventData,
      message: "Successfully data is fateched !",
      path: "http://localhost:8282:/uploads",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const softDeleteEvent = async (req, res) => {
  try {
    const eventID = req.params._id;
    const eventData = await eventModel.updateOne(
      { _id: eventID },
      { $set: { status: 0 } }
    );
    if (eventData.acknowledged) {
      res.status(200).json({
        message: "Successfully event deleted !",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const eventID = req.params._id;
    const data = await productModel.findOne({ _id: user_Id });
    const eventData = await eventModel.deleteOne({ _id: eventID });
    if (eventData.acknowledged) {
      if (fs.existsSync("./uploads/" + data.avatar)) {
        fs.unlinkSync("./uploads/" + data.avatar);
      }
      res.status(200).json({
        message: "Successfully parmanent event deleted !",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const uploadFile = upload.single("image");
    uploadFile(req, res, async function (err) {
      if (err)
        return res.status(400).json({
          message: err.message,
        });
      const event_ID = req.params._id;
      // console.log(event_ID);
      const {
        tittle,
        categoryId,
        eventTag,
        eventMode,
        startDate,
        endDate,
        time,
        onlineVideo,
        location,
        price,
        age,
        language,
        livePerformance,
        about,
        description,
        socialLink,
        venue,
        // castName,
      } = req.body;

      const eventData = await eventModel.findOne({ _id: event_ID });
      // console.log(eventData);

      let image = eventData.image;

      if (req.file !== undefined) {
        image = req.file.filename;
        if (fs.existsSync("./uploads/" + eventData.image)) {
          fs.unlinkSync("./uploads/" + eventData.image);
        }
      }

      const event_Data = await eventModel.updateOne(
        { _id: event_ID },
        {
          $set: {
            tittle: tittle,
            categoryId: categoryId,
            eventTag : eventTag,
            eventMode: eventMode,
            startDate: startDate,
            endDate: endDate,
            time: time,
            location: location,
            onlineVideo: onlineVideo,
            price: price,
            age: age,
            language: language,
            livePerformance: livePerformance,
            image: image,
            about: about,
            description: description,
            socialLink: socialLink,
            // caste: castData,
            venue: venue,
          },
        }
      );

      if (event_Data.acknowledged) {
        res.status(200).json({
          message: "Event Data is uodated successfully",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
