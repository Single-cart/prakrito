import type { blog } from "@workspace/shared/index";
import mongoose, { Model, Schema } from "mongoose";

const blogCommentSchema: Schema<blog.IBlogComment> = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Comment user is required"],
  },
  fullName: {
    type: String,
    required: [true, "Comment user name is required"],
  },
  avatar: {
    type: String,
  },
  content: {
    type: String,
    required: [true, "Comment content is required"],
  },
  approved: {
    type: Boolean,
    default: false,
  },
  createdOn: {
    type: Date,
    default: () => new Date(),
  },
});

const blogSchema: Schema<blog.IBlog> = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Blog title is required"],
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "Blog slug is required"],
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
    },
    summary: {
      type: String,
      required: [true, "Blog summary is required"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    tags: {
      type: [String],
      default: [],
    },
    featuredImage: {
      type: String,
      required: [true, "Featured image is required"],
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    comments: [blogCommentSchema],
    numOfComments: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.index(
  {
    title: "text",
    content: "text",
    summary: "text",
    tags: "text",
  },
  {
    weights: {
      title: 5,
      summary: 4,
      content: 3,
      tags: 2,
    },
  }
);

const BlogModel: Model<blog.IBlog> = mongoose.model<blog.IBlog>(
  "Blog",
  blogSchema
);

export default BlogModel;
