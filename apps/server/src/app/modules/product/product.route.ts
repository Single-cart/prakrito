import {
  CreateProductReviewSchema,
  ProductFilterSchema,
  UpdateProductReviewSchema,
} from "@workspace/shared/zodSchema/product.schema";
import express from "express";
import { authorizeUser, isAuthenticated } from "../../middlewares/authGuards";
import { fileUploader } from "../../middlewares/uploadFile";
import validator from "../../middlewares/validateRequest";
import {
  createProduct,
  createReview,
  deleteProduct,
  deleteReview,
  getAllProductReviews,
  getAllProducts,
  getAllProductsAdmin,
  getCartProducts,
  getProductReviews,
  getRecentSoldProducts,
  getSingleProduct,
  getStockStatus,
  updateProduct,
  updateReviewStatus,
} from "./product.controller";

const productRoute = express.Router();

productRoute.post(
  "/create-product",
  // validator(ProductSchema),
  isAuthenticated,
  authorizeUser("admin"),
  fileUploader("public/uploads/products", "array", "images"),
  createProduct
);
productRoute.put(
  "/update-product",
  isAuthenticated,
  authorizeUser("admin"),
  fileUploader("public/uploads/products", "array", "images"),
  updateProduct
);

productRoute.delete(
  "/delete-product/:id",
  isAuthenticated,
  authorizeUser("admin"),
  deleteProduct
);

productRoute.get("/single-product/:slug", getSingleProduct);
productRoute.get(
  "/all-products",
  validator(ProductFilterSchema),
  getAllProducts
);
productRoute.get(
  "/all-products-admin",
  isAuthenticated,
  authorizeUser("admin"),
  validator(ProductFilterSchema),
  getAllProductsAdmin
);
productRoute.get("/sold-product", getRecentSoldProducts);
productRoute.put(
  "/create-review",
  validator(CreateProductReviewSchema),
  isAuthenticated,
  createReview
);
productRoute.put(
  "/update-review-status",
  validator(UpdateProductReviewSchema),
  isAuthenticated,
  authorizeUser("admin"),
  updateReviewStatus
);
productRoute.delete(
  "/delete-review",
  isAuthenticated,
  authorizeUser("admin"),
  deleteReview
);
productRoute.get(
  "/all-product-reviews",
  isAuthenticated,
  authorizeUser("admin"),
  getAllProductReviews
);
productRoute.get("/all-reviews", getProductReviews);
productRoute.get("/cart-products", getCartProducts);
productRoute.get(
  "/stock-status",
  isAuthenticated,
  authorizeUser("admin"),
  getStockStatus
);

export default productRoute;
