import ApiError from "../../errorHandlers/ApiError";
import { deleteImage } from "../../helpers/deleteFile";
import { SubCategoryModel } from "../category/category.model";
import BannerModel from "./banner.model";

interface BannerImages {
  desktopImage?: string;
  mobileImage?: string;
}

export const createBannerService = async (
  bannerType: string,
  category: string,
  images: BannerImages,
  isActive?: boolean,
  order?: number
) => {
  if (!images.desktopImage && !images.mobileImage) {
    throw new ApiError(400, "At least one banner image is required");
  }

  if (bannerType === "categoryBanner" && !category) {
    if (images.desktopImage) {
      await deleteImage(images.desktopImage);
    }
    if (images.mobileImage) {
      await deleteImage(images.mobileImage);
    }
    throw new ApiError(400, "Category is required");
  }

  if (category && bannerType !== "categoryBanner") {
    if (images.desktopImage) {
      await deleteImage(images.desktopImage);
    }
    if (images.mobileImage) {
      await deleteImage(images.mobileImage);
    }
    throw new ApiError(400, "Your banner type should be categoryBanner");
  }

  const banner = await BannerModel.create({
    bannerType,
    category,
    desktopImage: images.desktopImage,
    mobileImage: images.mobileImage,
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

  if (banner.mobileImage || banner.desktopImage) {
    await deleteImage(banner.mobileImage);
    await deleteImage(banner.desktopImage);
  }

  return banner;
};

export const updateBannerService = async ({
  id,
  bannerType,
  category,
  mobileImage,
  desktopImage,
  isActive,
  order,
}: {
  id: string;
  bannerType?: string;
  category?: string;
  mobileImage?: string;
  desktopImage?: string;
  isActive?: boolean;
  order?: number;
}) => {
  const existingBanner = await BannerModel.findById(id);

  if (!existingBanner) {
    throw new ApiError(404, "Banner not found");
  }

  const updateData: any = {};

  if (bannerType !== undefined) updateData.bannerType = bannerType;
  if (category !== undefined) updateData.category = category;
  if (isActive !== undefined) updateData.isActive = isActive;
  if (order !== undefined) updateData.order = order;

  // Handle desktop image update
  if (desktopImage) {
    updateData.desktopImage = desktopImage;
    // Delete previous desktop image if it exists
    if (existingBanner.desktopImage) {
      await deleteImage(existingBanner.desktopImage);
    }
  }

  // Handle mobile image update
  if (mobileImage) {
    updateData.mobileImage = mobileImage;
    // Delete previous mobile image if it exists
    if (existingBanner.mobileImage) {
      await deleteImage(existingBanner.mobileImage);
    }
  }

  // Apply updates
  const updatedBanner = await BannerModel.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  return updatedBanner;
};
