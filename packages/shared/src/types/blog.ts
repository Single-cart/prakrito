import { Types } from "mongoose";

export interface IBlogComment {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  fullName: string;
  avatar?: string;
  content: string;
  approved: boolean;
  createdOn: Date;
}

export interface IBlog {
  _id?: Types.ObjectId;
  title: string;
  slug: string;
  content: string;
  summary: string;
  author: Types.ObjectId;
  category: Types.ObjectId;
  tags: string[];
  featuredImage: string;
  views: number;
  isPublished: boolean;
  publishedAt: Date | null;
  comments: IBlogComment[];
  numOfComments: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateBlogInput {
  title: string;
  content: string;
  summary: string;
  category: string;
  tags?: string[];
  featuredImage: string;
  isPublished?: boolean;
}

export interface IUpdateBlogInput {
  id: string;
  title?: string;
  content?: string;
  summary?: string;
  category?: string;
  tags?: string[];
  featuredImage?: string;
  isPublished?: boolean;
  publishedAt?: Date;
  slug?: string;
}

export interface ICommentInput {
  content: string;
  blogId: string;
}

export interface IUpdateCommentStatus {
  blogId: string;
  commentId: string;
  approved: boolean;
}

export interface IDeleteCommentInput {
  blogId: string;
  commentId: string;
}

export interface IBlogFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  author?: string;
  tags?: string[];
  isPublished?: boolean;
  startDate?: Date;
  endDate?: Date;
}
