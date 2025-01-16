import { Schema } from "mongoose";

export interface IUpload {
  fileName: string;
  originalName: string;
  path: string;
  mimeType: string;
  size: number;
  userId: Schema.Types.ObjectId;
  purpose: "product" | "user" | "category" | "brand";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
