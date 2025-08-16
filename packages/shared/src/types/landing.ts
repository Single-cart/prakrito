import mongoose, { Document, Schema } from "mongoose";

export interface ILanding extends Document {
  name: string;
  heading: string;
  phone: string;
  product: mongoose.Schema.Types.ObjectId;
  order: number;
  isActive: boolean;
  youtubeLinks: string[];
  description: string;
  certificateTitle: string;
  certificates: Schema.Types.ObjectId[];
  heroBtnText: string;
  offerTitle: string;
  offerDescription: string;
  reviews: Schema.Types.ObjectId[];
  productGallery: Schema.Types.ObjectId[];
}
