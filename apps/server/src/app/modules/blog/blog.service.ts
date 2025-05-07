import { blog } from "@workspace/shared/index";
import { Types } from "mongoose";
import ApiError from "../../errorHandlers/ApiError";
import { deleteImage } from "../../helpers/deleteFile";
import { slugify } from "../../helpers/slugify";
import UserModel from "../user-management/users/user.model";
import {
  BLOG_POPULATE_FIELDS,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
} from "./blog.const";
import { BlogFilters } from "./blog.interface";
import BlogModel from "./blog.model";
import { buildBlogFilterQuery } from "./blog.utils";

// Create blog service
export const createBlogService = async (
  blogData: Partial<blog.IBlog>,
  userId: string
): Promise<blog.IBlog> => {
  const titleExists = await BlogModel.findOne({ title: blogData.title });
  if (titleExists) {
    if (blogData.featuredImage) {
      await deleteImage(blogData.featuredImage);
    }
    throw new ApiError(400, "Blog title should be unique");
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    if (blogData.featuredImage) {
      await deleteImage(blogData.featuredImage);
    }
    throw new ApiError(404, "User not found");
  }

  const blog = await BlogModel.create({
    ...blogData,
    author: userId,
    slug: slugify(blogData.title as string),
    comments: [],
    publishedAt: blogData.isPublished ? new Date() : null,
  });

  return blog;
};

// Update blog service
export const updateBlogService = async (
  updateData: Partial<blog.IBlog>,
  userId: string,
  id: string
): Promise<blog.IBlog> => {
  const existingBlog = await BlogModel.findById(id);
  if (!existingBlog) {
    if (updateData.featuredImage) {
      await deleteImage(updateData.featuredImage);
    }
    throw new ApiError(404, "Blog not found");
  }

  // Check if user is author or admin
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isAuthor = existingBlog.author.toString() === userId;
  const isAdmin = user.role === "admin";

  if (!isAuthor && !isAdmin) {
    throw new ApiError(403, "You are not authorized to update this blog");
  }

  // If title is changed, check for uniqueness
  if (updateData.title && updateData.title !== existingBlog.title) {
    const titleExists = await BlogModel.findOne({
      title: updateData.title,
      _id: { $ne: id },
    });

    if (titleExists) {
      throw new ApiError(400, "Blog title should be unique");
    }
  }

  // Handle isPublished status change
  if (updateData.isPublished === true && !existingBlog.isPublished) {
    updateData.publishedAt = new Date();
  }

  // Handle slug if title changes
  if (updateData.title && updateData.title !== existingBlog.title) {
    updateData.slug = slugify(updateData.title);
  }

  // Delete old image if new one is provided
  if (
    updateData.featuredImage &&
    existingBlog.featuredImage !== updateData.featuredImage
  ) {
    await deleteImage(existingBlog.featuredImage);
  }

  const updatedBlog = await BlogModel.findByIdAndUpdate(
    id,
    { ...updateData },
    { new: true }
  ).populate(BLOG_POPULATE_FIELDS);

  if (!updatedBlog) {
    throw new ApiError(404, "Failed to update blog");
  }

  return updatedBlog;
};

// Delete blog service
export const deleteBlogService = async (
  id: string,
  userId: string
): Promise<void> => {
  const blog = await BlogModel.findById(id);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  // Check if user is author or admin
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isAuthor = blog.author.toString() === userId;
  const isAdmin = user.role === "admin";

  if (!isAuthor && !isAdmin) {
    throw new ApiError(403, "You are not authorized to delete this blog");
  }

  // Delete featured image
  if (blog.featuredImage) {
    await deleteImage(blog.featuredImage);
  }

  await blog.deleteOne();
};

// Get single blog service
export const getSingleBlogService = async (
  id: string,
  updateViews: boolean = false
): Promise<blog.IBlog> => {
  const blog = await BlogModel.findById(id)
    .populate(BLOG_POPULATE_FIELDS)
    .select("-comments");

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  // Increment view count if requested
  if (updateViews) {
    blog.views += 1;
    await blog.save();
  }

  return blog;
};

// Get all blogs service
export const getAllBlogsService = async (
  filters: BlogFilters
): Promise<{
  blogs: blog.IBlog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> => {
  const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = filters;

  const adjustedLimit = Math.min(MAX_LIMIT, Math.max(1, limit));
  const adjustedPage = Math.max(1, page);

  const filter = buildBlogFilterQuery(filters);

  const [blogs, blogCount] = await Promise.all([
    BlogModel.find(filter)
      .select("-comments")
      .populate(BLOG_POPULATE_FIELDS)
      .skip((adjustedPage - 1) * adjustedLimit)
      .limit(adjustedLimit)
      .sort({ createdAt: -1 }),
    BlogModel.countDocuments(filter),
  ]);

  if (!blogs?.length) {
    throw new ApiError(404, "No blogs available");
  }

  const totalPages = Math.ceil(blogCount / adjustedLimit);

  return {
    blogs,
    total: blogCount,
    page: adjustedPage,
    limit: adjustedLimit,
    totalPages,
  };
};

// Create comment service
export const createCommentService = async (
  commentData: { content: string; blogId: string },
  userId: string
): Promise<blog.IBlog> => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const blog = await BlogModel.findById(commentData.blogId);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  const newComment = {
    user: new Types.ObjectId(userId),
    fullName: user.fullName,
    avatar: user.avatar,
    content: commentData.content,
    approved: user.role === "admin", // Auto-approve admin comments
    createdOn: new Date(),
  };

  blog.comments.push(newComment as any);
  blog.numOfComments = blog.comments.length;
  await blog.save();

  return blog;
};

// Update comment status service
export const updateCommentStatusService = async (
  updateData: { blogId: string; commentId: string; approved: boolean },
  userId: string
): Promise<blog.IBlog> => {
  const user = await UserModel.findById(userId);
  if (!user || user.role !== "admin") {
    throw new ApiError(403, "Only admin can update comment status");
  }

  const blog = await BlogModel.findById(updateData.blogId);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  const commentIndex = blog.comments.findIndex(
    (comment) => comment._id!.toString() === updateData.commentId
  );

  if (commentIndex === -1) {
    throw new ApiError(404, "Comment not found");
  }

  blog.comments[commentIndex].approved = updateData.approved;
  await blog.save();

  return blog;
};

// Delete comment service
export const deleteCommentService = async (
  deleteData: { blogId: string; commentId: string },
  userId: string
): Promise<blog.IBlog> => {
  const blog = await BlogModel.findById(deleteData.blogId);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  const comment = blog.comments.find(
    (c) => c._id!.toString() === deleteData.commentId
  );

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // Check if user is admin or comment owner
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isAdmin = user.role === "admin";
  const isCommentOwner = comment.user.toString() === userId;
  const isBlogAuthor = blog.author.toString() === userId;

  if (!isAdmin && !isCommentOwner && !isBlogAuthor) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  blog.comments = blog.comments.filter(
    (c) => c._id!.toString() !== deleteData.commentId
  );

  blog.numOfComments = blog.comments.length;
  await blog.save();

  return blog;
};

// Get blog comments service
export const getBlogCommentsService = async (
  blogId: string,
  onlyApproved: boolean = true
): Promise<blog.IBlogComment[]> => {
  const blog = await BlogModel.findById(blogId);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  let comments = blog.comments;

  if (onlyApproved) {
    comments = comments.filter((comment) => comment.approved);
  }

  return comments;
};

// Get recent blogs service
export const getRecentBlogsService = async (
  limit: number = 5
): Promise<blog.IBlog[]> => {
  const blogs = await BlogModel.find({ isPublished: true })
    .select("title slug featuredImage createdAt views")
    .sort({ createdAt: -1 })
    .limit(limit);

  if (!blogs.length) {
    throw new ApiError(404, "No blogs found");
  }

  return blogs;
};

// Get popular blogs service
export const getPopularBlogsService = async (
  limit: number = 5
): Promise<blog.IBlog[]> => {
  const blogs = await BlogModel.find({ isPublished: true })
    .select("title slug featuredImage createdAt views")
    .sort({ views: -1 })
    .limit(limit);

  if (!blogs.length) {
    throw new ApiError(404, "No blogs found");
  }

  return blogs;
};
