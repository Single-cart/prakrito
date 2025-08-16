import { landing } from "@workspace/shared";
import mongoose, { Model } from "mongoose";

const landingSchema = new mongoose.Schema<landing.ILanding>({
  heading: {
    type: String,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },

  youtubeLinks: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    default: "",
  },
  certificateTitle: {
    type: String,
    default: "",
  },
  certificates: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Upload" }],
    default: [],
  },
  heroBtnText: {
    type: String,
    default: "",
  },
  offerTitle: {
    type: String,
    default: "",
  },
  offerDescription: {
    type: String,
    default: "",
  },
  reviews: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Upload" }],
    default: [],
  },
  productGallery: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Upload" }],
    default: [],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const LandingModel: Model<landing.ILanding> = mongoose.model(
  "Landing",
  landingSchema
);
export default LandingModel;
