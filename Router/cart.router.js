import express from "express";
import {
  addCartData,
  addToCart,
  deleteCartItem,
  getCartItems,
  updateQuantity,
} from "../Controller/cart.controller";

const router = express.Router();

router.get("/get-cart-item/:user_id", getCartItems);

// router.post("/add-cart-data", addCartData)
router.post("/add-to-cart", addToCart);

router.put("/update-quantity/:cart_id", updateQuantity);

router.delete("/delete-cart-item/:cart_id", deleteCartItem);

export default router;
