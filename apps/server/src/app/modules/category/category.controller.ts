import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../middlewares/catchAsync";
import sendResponse from "../../utils/sendResponse";
import * as categoryService from "./category.service";

// Get all category and sub category
export const getAllCategoryAndSubCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result = await categoryService.getAllCategoryAndSubCategoryService();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Category and subcategory retrieved successfully",
      data: result,
    });
  }
);

// Create category
export const createCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { name } = req.body;
    const result = await categoryService.createCategoryService(name);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "Category created successfully",
      data: result,
    });
  }
);

// Get all categories
export const getAllCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result = await categoryService.getAllCategoryService();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Categories retrieved successfully",
      data: result,
    });
  }
);

// Get single category
export const getSignleCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { slug } = req.params;
    const result = await categoryService.getSingleCategoryService(slug);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Category retrieved successfully",
      data: result,
    });
  }
);

// Update category
export const updateCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { name, id } = req.body;
    const result = await categoryService.updateCategoryService(id, name);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Category updated successfully",
      data: result,
    });
  }
);

// Delete category
export const deleteCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await categoryService.deleteCategoryService(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Category and subcategory deleted successfully",
    });
  }
);

// Create subcategory
export const createSubCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { name, category } = req.body;
    const result = await categoryService.createSubCategoryService(
      name,
      category
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "Subcategory created successfully",
      data: result,
    });
  }
);

// Get all subcategories
export const getAllSubCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result = await categoryService.getAllSubCategoryService();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Subcategories retrieved successfully",
      data: result,
    });
  }
);

// Get single subcategory
export const getSignleSubCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { slug } = req.params;
    const result = await categoryService.getSingleSubCategoryService(slug);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Subcategory retrieved successfully",
      data: result,
    });
  }
);

// Update subcategory
export const updateSubCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { name, id } = req.body;
    const result = await categoryService.updateSubCategoryService(id, name);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Subcategory updated successfully",
      data: result,
    });
  }
);

// Delete subcategory
export const deleteSubCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await categoryService.deleteSubCategoryService(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Subcategory deleted successfully",
    });
  }
);
