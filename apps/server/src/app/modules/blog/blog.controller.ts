import { Request, Response } from "express";
import httpStatus from "http-status";
import ApiError from "../../errorHandlers/ApiError";
import catchAsync from "../../middlewares/catchAsync";
import sendResponse from "../../utils/sendResponse";
import * as blogService from "./blog.service";
import { parseFilterParams } from "./blog.utils";

// Create blog controller
export const createBlog = catchAsync(async (req: Request, res: Response) => {
  const { title, content, summary, category, tags, isPublished } = req.body;

  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Featured image is required");
  }

  const userId = res.locals.user._id;

  const blogData = {
    title,
    content,
    summary,
    category,
    tags: tags ? JSON.parse(tags) : [],
    isPublished: isPublished === "true",
    featuredImage: req.file.path,
  };

  const result = await blogService.createBlogService(blogData, userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Blog created successfully",
    data: result,
  });
});

// Update blog controller
export const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const { title, content, summary, category, tags, isPublished } = req.body;
  const id = req.params.id;
  console.log(id);
  let parsedTags;
  if (tags) {
    try {
      parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
    } catch (error) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid tags format");
    }
  }

  const userId = res.locals.user._id;

  const updateData = req.file
    ? {
        title,
        content,
        summary,
        category,
        tags: parsedTags,
        isPublished: isPublished === "true",
        featuredImage: req.file.path,
      }
    : {
        title,
        content,
        summary,
        category,
        tags: parsedTags,
        isPublished: isPublished === "true",
      };

  const result = await blogService.updateBlogService(updateData, userId, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog updated successfully",
    data: result,
  });
});

// Delete blog controller
export const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const userId = res.locals.user._id;
  await blogService.deleteBlogService(req.params.id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog deleted successfully",
  });
});

// Get single blog controller
export const getSingleBlog = catchAsync(async (req: Request, res: Response) => {
  console.log(req.query);

  const updateViews = req.query.updateViews === "true";
  const result = await blogService.getSingleBlogService(
    req.params.id,
    updateViews
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: result,
  });
});

// Get all blogs controller
export const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
  const filters = parseFilterParams(req.query);
  const result = await blogService.getAllBlogsService(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blogs retrieved successfully",
    data: result,
  });
});

// Create comment controller
export const createComment = catchAsync(async (req: Request, res: Response) => {
  const { content, blogId } = req.body;
  const userId = res.locals.user._id;

  const result = await blogService.createCommentService(
    { content, blogId },
    userId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment added successfully",
    data: result,
  });
});

// Update comment status controller
export const updateCommentStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { blogId, commentId, approved } = req.body;
    const userId = res.locals.user._id;

    const result = await blogService.updateCommentStatusService(
      { blogId, commentId, approved },
      userId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Comment status updated successfully",
      data: result,
    });
  }
);

// Delete comment controller
export const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const { blogId, commentId } = req.body;
  const userId = res.locals.user._id;

  const result = await blogService.deleteCommentService(
    { blogId, commentId },
    userId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment deleted successfully",
    data: result,
  });
});

// Get blog comments controller
export const getBlogComments = catchAsync(
  async (req: Request, res: Response) => {
    const { blogId } = req.params;
    const onlyApproved = req.query.onlyApproved !== "false";

    const comments = await blogService.getBlogCommentsService(
      blogId,
      onlyApproved
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Comments retrieved successfully",
      data: comments,
    });
  }
);

// Get recent blogs controller
export const getRecentBlogs = catchAsync(
  async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const blogs = await blogService.getRecentBlogsService(limit);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Recent blogs retrieved successfully",
      data: blogs,
    });
  }
);

// Get popular blogs controller
export const getPopularBlogs = catchAsync(
  async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const blogs = await blogService.getPopularBlogsService(limit);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Popular blogs retrieved successfully",
      data: blogs,
    });
  }
);
