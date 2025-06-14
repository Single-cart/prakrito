import { product } from "@workspace/shared/index";
import mongoose from "mongoose";
import ApiError from "../../errorHandlers/ApiError";
import { deleteMultipleImages } from "../../helpers/deleteFile";
import { slugify } from "../../helpers/slugify";
import { CategoryModel } from "../category/category.model";
import { FilterQuery, PopulatedCategory } from "./product.interface";
import ProductModel from "./product.model";

// Create product service
export const createProductService = async (
  productData: product.ICreateProductInput
): Promise<any> => {
  const nameExists = await ProductModel.findOne({ name: productData.name });
  if (nameExists) {
    await deleteMultipleImages(productData.images);
    throw new ApiError(400, "Product name should be unique");
  }

  const product = await ProductModel.create({
    ...productData,
    slug: slugify(productData.name),
    reviews: [],
  });

  return product;
};

// Update product service
export const updateProductService = async (
  updateData: product.IUpdateProductInput
): Promise<any> => {
  const existingProduct = await ProductModel.findById(updateData.id);
  if (!existingProduct) {
    if (updateData.images?.length) {
      await deleteMultipleImages(updateData.images);
    }
    throw new ApiError(404, "Product not found");
  }

  const sanitizedUpdateData = {
    ...updateData,
    priceVariation: updateData.priceVariation?.map((priceVariation: any) => ({
      price: priceVariation.price,
      discountPrice: priceVariation.discountPrice,
      quantity: priceVariation.quantity,
      available: Boolean(priceVariation.available),
    })),
  };

  const updatedProductData = {
    ...existingProduct.toObject(),
    ...sanitizedUpdateData,
    slug: updateData.name ? slugify(updateData.name) : existingProduct.slug,
    images: updateData.images?.length
      ? updateData.images
      : existingProduct.images,
  };

  const updatedProduct = await ProductModel.findByIdAndUpdate(
    updateData.id,
    updatedProductData,
    { new: true }
  );

  return updatedProduct;
};

// Delete product service
export const deleteProductService = async (id: string): Promise<void> => {
  const product = await ProductModel.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found!");
  }

  if (product.images?.length) {
    await deleteMultipleImages(product.images);
  }

  await product.deleteOne();
};

// Get single product service
export const getSingleProductService = async (slug: string) => {
  const product = await ProductModel.findOne({ slug })
    .populate<{ category: PopulatedCategory }>("category", "_id name")
    .select("-reviews");
  if (!product) {
    throw new ApiError(404, "Product not found!");
  }

  const relatedProducts = await ProductModel.find(
    {
      category: product.category._id,
      _id: { $ne: product._id },
    },
    {
      name: 1,
      ratings: 1,
      numOfReviews: 1,
      priceVariation: 1,
      images: 1,
      slug: 1,
      createdAt: 1,
    }
  )
    .sort({ ratings: -1, createdAt: -1 })
    .limit(6);

  return { product, relatedProducts };
};

// Get all products service
export const getAllProductsService = async (
  filters: product.IProductFilters
) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    category = "",
    subcategory = "",
    minPrice,
    maxPrice,
    ratings,
  } = filters;

  const adjustedLimit = Math.min(50, Math.max(1, limit));
  const adjustedPage = Math.max(1, page);

  const filter: FilterQuery = {};

  if (search) {
    filter.$text = { $search: search };
  }

  if (category) {
    filter.category = new mongoose.Types.ObjectId(category);
  }

  if (subcategory) {
    filter.subcategory = subcategory;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceFilter: any[] = [];

    if (minPrice !== undefined) {
      priceFilter.push({
        $gte: [
          {
            $convert: {
              input: "$priceVariation.discountPrice",
              to: "double",
              onError: 0,
              onNull: 0,
            },
          },
          minPrice,
        ],
      });
    }

    if (maxPrice !== undefined) {
      priceFilter.push({
        $lte: [
          {
            $convert: {
              input: "$priceVariation.discountPrice",
              to: "double",
              onError: 0,
              onNull: 0,
            },
          },
          maxPrice,
        ],
      });
    }

    if (priceFilter.length > 0) {
      filter.$expr = {
        $and: priceFilter,
      };
    }
  }

  if (ratings) {
    filter.ratings = { $gte: ratings };
  }

  const [products, productCount] = await Promise.all([
    ProductModel.find(filter)
      .select("-reviews")
      .populate("category") // Only populate category, remove subcategory
      .skip((adjustedPage - 1) * adjustedLimit)
      .limit(adjustedLimit)
      .sort({ order: 1 }),
    ProductModel.countDocuments(filter),
  ]);

  const allCategories = await CategoryModel.find({});

  return {
    products,
    allCategories,
    pagination: {
      numberOfProducts: productCount,
      totalPage: Math.ceil(productCount / adjustedLimit),
      currentPage: adjustedPage,
      nextPage:
        adjustedPage < Math.ceil(productCount / adjustedLimit)
          ? adjustedPage + 1
          : null,
      prevPage: adjustedPage > 1 ? adjustedPage - 1 : null,
    },
  };
};

// Create review service
export const createReviewService = async (
  reviewData: product.IReviewInput,
  user: any
) => {
  const product = await ProductModel.findById(reviewData.productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product?.reviews) {
    const reviewValidity = product?.reviews.filter(
      (value) => value.user.toString() === user?._id.toString()
    );

    const reviewCount = user?.reviewsInfo?.find(
      (item: any) => item?.productId === reviewData?.productId
    );

    if (reviewCount?.reviewsCounter === undefined) {
      throw new ApiError(400, "You have to buy this item");
    }

    if (reviewValidity.length >= reviewCount?.reviewsCounter) {
      throw new ApiError(400, "You have to buy this item");
    }
  }

  const review: product.IPorductReviews = {
    user: reviewData.user._id,
    fullName: reviewData.user.fullName,
    avatar: reviewData.user.avatar,
    rating: reviewData.rating,
    comment: reviewData.comment,
  };

  if (!product.reviews) {
    product.reviews = [];
  }

  product.reviews.push(review);
  product.numOfReviews = product.reviews.length;

  // Calculate average rating
  const avgRating =
    product.reviews.reduce((sum, review) => sum + review.rating, 0) /
    product.reviews.length;
  product.ratings = avgRating;

  await product.save();

  return product.reviews;
};

// Update review status service
export const updateReviewStatusService = async (
  updateData: product.IUpdateReviewStatus
) => {
  const product = await ProductModel.findById(updateData.productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const review = product.reviews?.find(
    (r) => String(r._id) === updateData.reviewId
  );

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  review.approved = updateData.approved;
  await product.save();

  return product;
};

// Delete review service
export const deleteReviewService = async (
  deleteData: product.IDeleteReviewInput
) => {
  const product = await ProductModel.findById(deleteData.productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const reviewIndex = product.reviews?.findIndex(
    (r) => r._id?.toString() === deleteData.reviewId
  );

  if (reviewIndex === -1) {
    throw new ApiError(404, "Review not found");
  }

  product.reviews?.splice(reviewIndex!, 1);

  // Recalculate ratings
  if (product?.reviews?.length && product.reviews.length > 0) {
    const avgRating =
      product.reviews.reduce((sum, review) => sum + review.rating, 0) /
      product.reviews.length;
    product.ratings = avgRating;
    product.numOfReviews = product.reviews.length;
  } else {
    product.ratings = 0;
    product.numOfReviews = 0;
  }

  await product.save();
  return product;
};

// Get all reviews service
export const getAllProductReviewsService = async (
  page: number = 1,
  limit: number = 15
) => {
  const productsReviews = await ProductModel.aggregate([
    {
      $unwind: "$reviews",
    },
    {
      $match: {
        "reviews.approved": false,
      },
    },
    {
      $group: {
        _id: "$_id",
        productName: { $first: "$name" },
        productId: { $first: "$_id" },
        reviews: { $push: "$reviews" },
      },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
  ]);

  const countProduct = await ProductModel.countDocuments();

  return {
    productsReviews,
    pagination: {
      totalPage: Math.ceil(countProduct / limit),
      currentPage: page,
      nextPage: page + 1,
      prevPage: page - 1,
    },
  };
};

// Get stock status service
export const getStockStatusService = async () => {
  const [productStockAvailable, productStockOut] = await Promise.all([
    ProductModel.countDocuments({ stock: { $gt: 0 } }),
    ProductModel.countDocuments({ stock: { $lte: 0 } }),
  ]);

  return { productStockAvailable, productStockOut };
};
