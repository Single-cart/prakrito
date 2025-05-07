import { z } from "zod";

export const CreateBlogSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Blog title is required",
    }),
    content: z.string({
      required_error: "Blog content is required",
    }),
    summary: z.string({
      required_error: "Blog summary is required",
    }),
    category: z.string({
      required_error: "Category is required",
    }),
    tags: z.string().optional(),
    isPublished: z.string().optional(),
  }),
});

export const UpdateBlogSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: "Blog ID is required",
    }),
    title: z.string().optional(),
    content: z.string().optional(),
    summary: z.string().optional(),
    category: z.string().optional(),
    tags: z.string().optional(),
    isPublished: z.string().optional(),
  }),
});

export const CreateBlogCommentSchema = z.object({
  body: z.object({
    content: z.string({
      required_error: "Comment content is required",
    }),
    blogId: z.string({
      required_error: "Blog ID is required",
    }),
  }),
});

export const UpdateCommentStatusSchema = z.object({
  body: z.object({
    blogId: z.string({
      required_error: "Blog ID is required",
    }),
    commentId: z.string({
      required_error: "Comment ID is required",
    }),
    approved: z.boolean({
      required_error: "Approval status is required",
    }),
  }),
});

export const DeleteCommentSchema = z.object({
  body: z.object({
    blogId: z.string({
      required_error: "Blog ID is required",
    }),
    commentId: z.string({
      required_error: "Comment ID is required",
    }),
  }),
});

export const BlogFilterSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    category: z.string().optional(),
    author: z.string().optional(),
    tags: z.string().optional(),
    isPublished: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    onlyApproved: z.string().optional(),
  }),
});
