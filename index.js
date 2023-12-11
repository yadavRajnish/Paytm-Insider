import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRouter from "./Router/user.router";
import categoryRouter from "./Router/category.router";
import eventRouter from "./Router/event.router";
import cartRouter from "./Router/cart.router";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.static(__dirname));
app.use(cookieParser());
const PORT = process.env.PORT;
// console.log(PORT);
app.use(cors());

app.listen(PORT, () =>
  console.log(`Server is Running on http://localhost:${PORT}`)
);

// mongoose
//   .connect("mongodb://127.0.0.1:27017/projectData")
//   .then(() => console.log("DB connected"))
//   .catch((error) => console.log(error));

  mongoose
  .connect("mongodb+srv://rajnishyadav:rajn1234@paytminsider.9voaoi0.mongodb.net/projectData", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("DB connected"))
  .catch((error) => console.log(error));

app.use(userRouter);
app.use(categoryRouter);
app.use(eventRouter);
app.use(cartRouter);
