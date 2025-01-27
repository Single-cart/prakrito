import { categoryType } from "@workspace/shared/index";
import { Model, model, Schema } from "mongoose";

const categorySchema: Schema<categoryType.ICategory> = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "category name is required"],
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "category slug is required"],
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CategoryModel: Model<categoryType.ICategory> = model(
  "Category",
  categorySchema
);

const subCategorySchema: Schema<categoryType.ISubCategory> = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "category name is required"],
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "category slug is required"],
      lowercase: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

export const SubCategoryModel: Model<categoryType.ISubCategory> = model(
  "SubCategory",
  subCategorySchema
);
