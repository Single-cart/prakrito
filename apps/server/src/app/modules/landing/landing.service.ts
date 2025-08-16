import { landing } from "@workspace/shared";
import { SortOrder } from "mongoose";
import ApiError from "../../errorHandlers/ApiError";
import LandingModel from "./landing.model";

// Create landing
export const createLandingService = async (
  landingData: Pick<
    landing.ILanding,
    | "heading"
    | "product"
    | "name"
    | "phone"
    | "order"
    | "isActive"
    | "youtubeLink"
    | "youtubeLinks"
    | "description"
    | "certificateTitle"
    | "certificates"
    | "heroBtnText"
    | "offerTitle"
    | "offerDescription"
    | "reviews"
    | "productGallery"
  >
): Promise<landing.ILanding> => {
  const nameExists = await LandingModel.findOne({ name: landingData.name });
  if (nameExists) {
    throw new ApiError(400, "Landing page name should be unique");
  }

  const landing = await LandingModel.create(landingData);
  return landing;
};

// Get all landings with pagination
export const getAllLandingsService = async (): Promise<{
  data: landing.ILanding[];
}> => {
  // Default sort by order field
  const sortConditions: { [key: string]: SortOrder } = { order: 1 };

  const result = await LandingModel.find()
    .populate("product")
    .populate("certificates")
    .populate("reviews")
    .populate("productGallery")
    .sort(sortConditions);

  return {
    data: result,
  };
};

// Get single landing
export const getSingleLandingService = async (
  id: string
): Promise<landing.ILanding | null> => {
  const result = await LandingModel.findById(id)
    .populate("product")
    .populate("certificates")
    .populate("reviews")
    .populate("productGallery");

  return result;
};

// Update landing
export const updateLandingService = async (
  id: string,
  payload: Partial<landing.ILanding>
): Promise<landing.ILanding | null> => {
  // Check if name is being updated and already exists
  if (payload.name) {
    const nameExists = await LandingModel.findOne({
      name: payload.name,
      _id: { $ne: id },
    });
    if (nameExists) {
      throw new ApiError(400, "Landing page name should be unique");
    }
  }

  const result = await LandingModel.findByIdAndUpdate(id, payload, {
    new: true,
  })
    .populate("product")
    .populate("certificates")
    .populate("reviews")
    .populate("productGallery");

  return result;
};

// Delete landing
export const deleteLandingService = async (
  id: string
): Promise<landing.ILanding | null> => {
  const result = await LandingModel.findByIdAndDelete(id);
  return result;
};
