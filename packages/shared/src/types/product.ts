import mongoose, { Document, Types } from "mongoose";
import { ICategory, ISubCategory } from "./category";

// Filters and Query Interfaces
export interface IProductFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  ratings?: number;
  page?: number;
  limit?: number;
}

export interface QueryParams {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  subcategory?: string;
  minPrice?: string;
  maxPrice?: string;
  ratings?: string;
}

export interface FilterQuery {
  $text?: { $search: string };
  category?: string;
  subcategory?: string;
  $expr?: any;
  ratings?: { $gte: number };
}

// Product Input Interfaces
export interface ICreateProductInput {
  name: string;
  price: number;
  discountPrice: string;
  stock: number;
  shipping: number;
  order: number;
  category: Types.ObjectId;
  subcategory: Types.ObjectId;
  description: any;
  colors?: Array<{ name: string; stock: boolean }>;
  size?: Array<{ name: string; available: boolean }>;
  images: string[];
}

export interface IUpdateProductInput extends Partial<ICreateProductInput> {
  id: string;
  sold?: number;
  [key: string]: any;
}

// Review Interfaces
export interface IReviewInput {
  rating: number;
  comment: string;
  productId?: string;
  user: {
    _id: Types.ObjectId;
    fullName: string;
    avatar?: string;
  };
}

export interface IUpdateReviewStatus {
  reviewId: string;
  productId: string;
  approved: boolean;
}

export interface IDeleteReviewInput {
  reviewId: string;
  productId: string;
}

export interface IPorductReviews {
  user: Types.ObjectId;
  fullName: string;
  avatar?: string;
  rating: number;
  comment: string;
  approved?: boolean;
  createdOn?: Date;
  _id?: Types.ObjectId;
}

// Product Document Interface
export interface IProduct extends Document {
  name: string;
  slug: string;
  price: number;
  discountPrice?: string;
  description: string;
  colors?: { name: string; stock: boolean }[];
  size?: { name: string; available: boolean }[];
  stock: number;
  sold: number;
  soldAt: Date;
  order: number;
  shipping: number;
  images: string[];
  numOfReviews: number;
  ratings?: number;
  category: mongoose.Schema.Types.ObjectId;
  subcategory?: string;
  reviews?: IPorductReviews[];
}

export interface IProductRes {
  _id: string;
  name: string;
  slug: string;
  price: number;
  order: number;
  discountPrice?: string;
  description: string;
  colors?: { name: string; stock: boolean }[];
  size?: { name: string; available: boolean }[];
  stock: number;
  sold: number;
  soldAt: Date;
  shipping: number;
  images: string[];
  numOfReviews: number;
  ratings?: number;
  category: ICategory;
  subcategory?: ISubCategory;
  reviews?: IPorductReviews[];
}
