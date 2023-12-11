import express from "express";
import auth from "../Middleware/auth.middleware"
import {
  adduserData,
  deleteUser,
  getUser,
  getUsers,
  signIn,
  signUp,
  softDeleteUser,
  updateUser,
} from "../Controller/user.controller";
const router = express.Router();

router.get("/get-user/:user_Id", getUser);
// router.get("/get-user/:user_Id",auth, getUser);
router.get("/get-users", getUsers);
router.post("/add-user", adduserData);
router.delete("/soft-delete-user/:user_id", softDeleteUser);
router.delete("/delete-user/:user_id", deleteUser);
router.put("/update-user/:user_id", updateUser);

//------------------------auth-------------------
router.post("/sign-up", signUp);
router.post("/sign-in", signIn);

export default router;
