import { Request, Response } from "express";
import httpStatus from "http-status";
import ApiError from "../../errorHandlers/ApiError";
import catchAsync from "../../middlewares/catchAsync";
import sendResponse from "../../utils/sendResponse";
import UserModel from "../user-management/users/user.model";
import ProductModel from "./product.model";
import * as productService from "./product.service";

// Create product controller
export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const {
    name,

    stock,
    insideDhaka,
    outsideDhaka,
    category,
    subcategory,
    description,
    priceVariation,
    order,
  } = req.body;

  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Products Images are required");
  }

  const priceVariationArray = JSON.parse(priceVariation).map((item: any) => ({
    price: Number(item.price),
    discountPrice: Number(item.discountPrice),
    quantity: item.quantity,
    available: item.available,
  }));

  const productData = {
    name,
    description,

    stock: parseInt(stock),
    priceVariation: priceVariationArray,
    insideDhaka: parseInt(insideDhaka),
    outsideDhaka: parseInt(outsideDhaka),
    category,
    subcategory,
    order: Number(order),
    images: (req.files as Express.Multer.File[]).map(
      (file: Express.Multer.File) => file.path
    ),
  };

  const result = await productService.createProductService(productData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Product created successfully",
    data: result,
  });
});

// Update product controller
export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  // Check if priceVariation is a string that needs parsing or already an object
  let parsedPriceVariation;
  if (req.body.priceVariation) {
    try {
      // If it's a string (from FormData), parse it
      parsedPriceVariation =
        typeof req.body.priceVariation === "string"
          ? JSON.parse(req.body.priceVariation)
          : req.body.priceVariation;
    } catch (error) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Invalid price variation format"
      );
    }
  } else {
    parsedPriceVariation = [];
  }

  const data = req.files
    ? {
        ...req.body,
        id: req.body.id,
        priceVariation: parsedPriceVariation,
        images: (req.files as Express.Multer.File[]).map(
          (file: Express.Multer.File) => file.path
        ),
      }
    : {
        ...req.body,
        id: req.body.id,
        priceVariation: parsedPriceVariation,
      };

  const result = await productService.updateProductService(data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product updated successfully",
    data: result,
  });
});

// Delete product controller
export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  await productService.deleteProductService(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product deleted successfully",
  });
});

// Get single product controller
export const getSingleProduct = catchAsync(
  async (req: Request, res: Response) => {
    const result = await productService.getSingleProductService(
      req.params.slug
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: result,
    });
  }
);

// Get all products controller
export const getAllProducts = catchAsync(
  async (req: Request, res: Response) => {
    const filters = {
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      search: req.query.search?.toString(),
      category: req.query.category?.toString(),
      subcategory: req.query.subcategory?.toString(),
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      ratings: req.query.ratings ? Number(req.query.ratings) : undefined,
    };

    const result = await productService.getAllProductsService(filters);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Products retrieved successfully",
      data: result,
    });
  }
);
// Get recent sold products controller
export const getRecentSoldProducts = catchAsync(
  async (req: Request, res: Response) => {
    const products = await ProductModel.find().sort({ soldAt: -1 }).limit(10);

    if (!products.length) {
      throw new ApiError(httpStatus.NOT_FOUND, "No recent sold products found");
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Recently sold products retrieved successfully",
      data: products,
    });
  }
);

// Create review controller
export const createReview = catchAsync(async (req: Request, res: Response) => {
  const { rating, comment, productId } = req.body;
  const user = res.locals.user;

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const reviewData = {
    rating,
    comment,
    productId,
    user: {
      _id: user._id,
      fullName: user.fullName,
      avatar: user?.avatar,
    },
  };

  const result = await productService.createReviewService(reviewData, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

// Update review status controller
export const updateReviewStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { reviewId, productId, approved } = req.body;

    const result = await productService.updateReviewStatusService({
      reviewId,
      productId,
      approved,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Review status updated successfully",
      data: result,
    });
  }
);

// Delete review controller
export const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { reviewId, productId } = req.body;

  const result = await productService.deleteReviewService({
    reviewId,
    productId,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review deleted successfully",
    data: result,
  });
});

// Get all product reviews controller
export const getAllProductReviews = catchAsync(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 15;

    const result = await productService.getAllProductReviewsService(
      page,
      limit
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All product reviews retrieved successfully",
      data: result,
    });
  }
);

// Get product reviews controller
export const getProductReviews = catchAsync(
  async (req: Request, res: Response) => {
    const { productId, userId } = req.query;

    const product = await ProductModel.findById(productId);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
    }

    const userLength = await UserModel.countDocuments();

    let productReviews = product.reviews?.filter(
      (item) => (userId && item.user.toString() === userId) || item.approved
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Product reviews retrieved successfully",
      data: {
        productReviews,
        userLength,
      },
    });
  }
);

// Get stock status controller
export const getStockStatus = catchAsync(
  async (req: Request, res: Response) => {
    const result = await productService.getStockStatusService();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: result,
    });
  }
);

// Get cart products controller
export const getCartProducts = catchAsync(
  async (req: Request, res: Response) => {
    const productId = req.cookies.product_cart;
    if (!productId) {
      throw new ApiError(httpStatus.NOT_FOUND, "Cart is empty");
    }

    const productIdsArray = JSON.parse(productId);
    if (!productIdsArray || productIdsArray.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, "Cart items not found");
    }

    const products = await ProductModel.find({ _id: { $in: productIdsArray } });
    if (!products || products.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, "Products not found");
    }

    const formattedProducts = products.map((product) => ({
      _id: product._id,
      name: product.name,
      priceVariation: product.priceVariation,
      images:
        product.images && product.images.length > 0 ? product.images[0] : null,
      slug: product.slug,
    }));

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Cart items retrieved successfully",
      data: formattedProducts,
    });
  }
);
