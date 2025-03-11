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
