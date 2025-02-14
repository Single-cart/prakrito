import { banner } from "@workspace/shared";
import mongoose, { Model } from "mongoose";

const bannerSchema = new mongoose.Schema<banner.IBanners>({
  bannerType: {
    type: String,
    enum: ["topBanner", "mainBanner", "categoryBanner"],
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  desktopImage: {
    type: String,
    required: true,
  },
  mobileImage: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const BannerModel: Model<banner.IBanners> = mongoose.model(
  "Banner",
  bannerSchema
);
export default BannerModel;
