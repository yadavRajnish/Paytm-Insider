import mongoose from "mongoose";
const Schema = mongoose.Schema;

const categoryModel = new Schema({
  name: {
    type: String,
    required: true,
  },
  avatar : {
    type : String,
    default : null
  },
  status: {
    type: Number,
    default: 1,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("category", categoryModel);