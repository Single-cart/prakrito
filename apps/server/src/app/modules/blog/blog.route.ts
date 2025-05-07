import {
  BlogFilterSchema,
  CreateBlogCommentSchema,
  DeleteCommentSchema,
  UpdateCommentStatusSchema,
} from "@workspace/shared/zodSchema/blog.schema";
import express from "express";
import { authorizeUser, isAuthenticated } from "../../middlewares/authGuards";
import { fileUploader } from "../../middlewares/uploadFile";
import validator from "../../middlewares/validateRequest";
import {
  createBlog,
  createComment,
  deleteBlog,
  deleteComment,
  getAllBlogs,
  getBlogComments,
  getPopularBlogs,
  getRecentBlogs,
  getSingleBlog,
  updateBlog,
  updateCommentStatus,
} from "./blog.controller";

const blogRoute = express.Router();

// Blog CRUD routes
blogRoute.post(
  "/create-blog",
  isAuthenticated,
  fileUploader("public/uploads/blogs", "single", "featuredImage"),
  createBlog
);

blogRoute.put(
  "/update-blog/:id",
  isAuthenticated,
  fileUploader("public/uploads/blogs", "single", "featuredImage"),
  updateBlog
);

blogRoute.delete("/delete-blog/:id", isAuthenticated, deleteBlog);

blogRoute.get("/single-blog/:id", getSingleBlog);
blogRoute.get("/all-blogs", validator(BlogFilterSchema), getAllBlogs);

// Comment routes
blogRoute.put(
  "/create-comment",
  validator(CreateBlogCommentSchema),
  isAuthenticated,
  createComment
);

blogRoute.put(
  "/update-comment-status",
  validator(UpdateCommentStatusSchema),
  isAuthenticated,
  authorizeUser("admin"),
  updateCommentStatus
);

blogRoute.delete(
  "/delete-comment",
  validator(DeleteCommentSchema),
  isAuthenticated,
  deleteComment
);

blogRoute.get("/blog-comments/:blogId", getBlogComments);

// Additional blog routes
blogRoute.get("/recent-blogs", getRecentBlogs);
blogRoute.get("/popular-blogs", getPopularBlogs);

export default blogRoute;
