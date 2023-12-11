import mongoose from "mongoose";
import categoryModel from "./category.model";
const Schema = mongoose.Schema;

const eventModel = new Schema({
  tittle: {
    type: String,
    default: null,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: categoryModel,
  },
  eventMode: {
    type: String,
    default: null,
  },
  eventTag: {
    type: String,
    default: null,
  },
  startDate: {
    type: Date,
    default: null,
  },
  endDate: {
    type: Date,
    default: null,
  },
  time: {
    type: String,
    default: null,
  },
  onlineVideo : {
    type: String,
    default: null,
  },
  location: {
    type: String,
    default: null,
  },
  price: {
    type: String,
    default: null,
  },
  age: {
    type: String,
    default: null,
  },
  language: {
    type: String,
    default: null,
  },
  livePerformance: {
    type: String,
    default: null,
  },
  image: {
    type: Array,
    default: null,
  },
  about: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
  socialLink: {
    type: String,
    default: null,
  },
  caste: {
    type: [
      {
        castName: {
          type: String,
          default: null,
        },
        casteImage: {
          type: String,
          default: null,
        },
      },
    ],
    default: null,
  },
  venue: {
    type: String,
    default: null,
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

export default mongoose.model("event", eventModel);

