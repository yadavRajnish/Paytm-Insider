import mongoose from "mongoose";
const Schema = mongoose.Schema;
import userModel from "./user.model";
import eventModel from "./event.model";

const cartModel = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    default : null,
    ref: userModel,
  },
  eventId: {
    type: Schema.Types.ObjectId,
    default : null,
    ref: eventModel,
  },
  tittle: {
    type: String,
    default : null,
  },
  price: {
    type: Number,
    default : null,
  },
  location : {
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
  quantity: {
    type: Number,
    default : null,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("cart", cartModel);
