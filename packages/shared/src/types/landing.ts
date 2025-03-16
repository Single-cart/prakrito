import mongoose, { Document } from "mongoose";

export interface ILanding extends Document {
  name: string;
  heading: string;
  phone: string;
  product: mongoose.Schema.Types.ObjectId;
  order: number;
  isActive: boolean;
  youtubeLink: string;
}
