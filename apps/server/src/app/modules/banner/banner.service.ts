import { merge } from "lodash";
import ApiError from "../../errorHandlers/ApiError";
import { deleteImage } from "../../helpers/deleteFile";
import { SubCategoryModel } from "../category/category.model";
import BannerModel from "./banner.model";

export const createBannerService = async (
  bannerType: string,
  category: string,
  image?: string,
  isActive?: boolean,
  order?: number
) => {
  if (!image) {
    throw new ApiError(400, "Banner image is required");
  }

  if (bannerType === "categoryBanner" && !category) {
    if (image) {
      await deleteImage(image);
    }
    throw new ApiError(400, "Category is required");
  }

  if (category && bannerType !== "categoryBanner") {
    if (image) {
      await deleteImage(image);
    }
    throw new ApiError(400, "Your banner type should be categoryBanner");
  }

  const banner = await BannerModel.create({
    bannerType,
    category,
    image,
    isActive,
    order,
  });

  return banner;
};

export const getAllBannersService = async (
  bannerType?: string,
  category?: string
) => {
  let query: Record<string, any> = {};

  if (bannerType) {
    query.bannerType = bannerType;
  }

  if (category) {
    const subcategory = await SubCategoryModel.findById(category);
    query.category = subcategory?.category;
  }

  const banners = await BannerModel.find(query)
    .sort({ order: 1 })
    .populate("category");

  if (!banners.length) {
    throw new ApiError(404, "No banners found");
  }

  return banners;
};

export const getActiveBannersService = async (
  bannerType?: string,
  category?: string
) => {
  let query: Record<string, any> = {
    isActive: true,
  };

  if (bannerType) {
    query.bannerType = bannerType;
  }

  if (category) {
    const subcategory = await SubCategoryModel.findById(category);
    query.category = subcategory?.category;
  }

  const banners = await BannerModel.find(query)
    .sort({ order: 1 })
    .populate("category");

  if (!banners.length) {
    throw new ApiError(404, "No banners found");
  }

  return banners;
};

export const getSingleBannerService = async (id: string) => {
  const banner = await BannerModel.findById(id).populate("category");

  if (!banner) {
    throw new ApiError(404, "Banner not found");
  }

  return banner;
};

export const deleteBannerService = async (id: string) => {
  const banner = await BannerModel.findByIdAndDelete(id);

  if (!banner) {
    throw new ApiError(404, "Banner not found");
  }

  if (banner.image) {
    await deleteImage(banner.image);
  }

  return banner;
};

export const updateBannerService = async ({
  id,
  bannerType,
  category,
  image,
  isActive,
  order,
}: {
  id: string;
  bannerType: string;
  category?: string;
  image?: string;
  isActive?: boolean;
  order?: number;
}) => {
  // First, get the existing banner
  const existingBanner = await BannerModel.findById(id);

  if (!existingBanner) {
    throw new ApiError(404, "Banner not found");
  }

  const updateData: any = {
    bannerType,
    category,
    isActive,
    order,
  };

  if (image) {
    updateData.image = image;
    await deleteImage(existingBanner.image);
  }

  const mergedData = merge({}, existingBanner.toObject(), updateData);

  const updatedBanner = await BannerModel.findByIdAndUpdate(id, mergedData, {
    new: true,
  });

  return updatedBanner;
};
