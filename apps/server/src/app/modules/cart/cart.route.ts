import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import {
  addCartItem,
  calculatePrice,
  getCartItem,
  syncCart,
} from "./cart.controller";
import { addToCartSchema } from "./cart.validation";

const cartRoute = express.Router();

cartRoute.post("/add-to-cart", validateRequest(addToCartSchema), addCartItem);
cartRoute.post("/cart-sync", syncCart);
cartRoute.get("/get-cart", getCartItem);
cartRoute.get("/updated-price", calculatePrice);

export default cartRoute;
