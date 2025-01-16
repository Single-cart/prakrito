import { Schema, model } from "mongoose";
import { IUpload } from "./upload.interface";

const uploadSchema = new Schema<IUpload>(
  {
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    purpose: {
      type: String,
      enum: ["product", "user", "category", "brand"],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Upload = model<IUpload>("Upload", uploadSchema);
export default Upload;
