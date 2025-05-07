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
  priceVariation: {
    price: number;
    discountPrice: number;
    quantity: string;
    available: boolean;
  }[];
  stock: number;
  insideDhaka: number;
  outsideDhaka: number;
  order: number;
  category: Types.ObjectId;
  subcategory: Types.ObjectId;
  description: any;

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
  description: string;
  priceVariation?: {
    price: string;
    discountPrice: string;
    quantity: string;
    available: boolean;
  }[];
  stock: number;
  sold: number;
  soldAt: Date;
  order: number;
  insideDhaka: number;
  outsideDhaka: number;
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
  order: number;
  description: string;
  priceVariation?: {
    price: string;
    discountPrice: string;
    quantity: string;
    available: boolean;
  }[];
  stock: number;
  sold: number;
  soldAt: Date;
  insideDhaka: number;
  outsideDhaka: number;
  images: string[];
  numOfReviews: number;
  ratings?: number;
  category: ICategory;
  subcategory?: ISubCategory;
  reviews?: IPorductReviews[];
}
