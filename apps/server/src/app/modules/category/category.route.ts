import { categoryZodSchema } from "@workspace/shared/index";
import express from "express";
import { authorizeUser, isAuthenticated } from "../../middlewares/authGuards";
import validator from "../../middlewares/validateRequest";
import {
  createCategory,
  createSubCategory,
  deleteCategory,
  deleteSubCategory,
  getAllCategory,
  getAllCategoryAndSubCategory,
  getAllSubCategory,
  getSignleCategory,
  getSignleSubCategory,
  updateCategory,
  updateSubCategory,
} from "./category.controller";

export const categoryRoute = express.Router();

// get all category and subcategory
categoryRoute.get("/category-subcategory", getAllCategoryAndSubCategory);

categoryRoute.post(
  "/create-category",
  validator(categoryZodSchema.createCategorySchema),
  isAuthenticated,
  authorizeUser("admin"),
  createCategory
);
categoryRoute.get("/get-all-category", getAllCategory);
categoryRoute.get(
  "/get-single-category/:slug",
  validator(categoryZodSchema.getSingleCategorySchema),
  getSignleCategory
);
categoryRoute.put(
  "/update-category",
  validator(categoryZodSchema.updateCategorySchema),
  isAuthenticated,
  authorizeUser("admin"),
  updateCategory
);
categoryRoute.delete(
  "/delete-category/:id",
  isAuthenticated,
  authorizeUser("admin"),
  deleteCategory
);

// sub category
export const subcategoryRoute = express.Router();

subcategoryRoute.post(
  "/create-subcategory",
  validator(categoryZodSchema.createSubCategorySchema),
  isAuthenticated,
  authorizeUser("admin"),
  createSubCategory
);
subcategoryRoute.get("/get-all-subcategory", getAllSubCategory);
subcategoryRoute.get(
  "/get-single-subcategory/:slug",
  validator(categoryZodSchema.getSingleCategorySchema),
  getSignleSubCategory
);
subcategoryRoute.put(
  "/update-subcategory",
  validator(categoryZodSchema.updateCategorySchema),
  isAuthenticated,
  authorizeUser("admin"),
  updateSubCategory
);
subcategoryRoute.delete(
  "/delete-subcategory/:id",
  isAuthenticated,
  authorizeUser("admin"),
  deleteSubCategory
);
