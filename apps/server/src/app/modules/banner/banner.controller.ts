import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../middlewares/catchAsync";
import sendResponse from "../../utils/sendResponse";
import * as bannerService from "./banner.service";

export const createBanner = catchAsync(async (req: Request, res: Response) => {
  const { bannerType, category, isActive, order } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const desktopImagePath = files?.desktopImage?.[0]?.path;
  const mobileImagePath = files?.mobileImage?.[0]?.path;

  const result = await bannerService.createBannerService(
    bannerType,
    category,
    {
      desktopImage: desktopImagePath,
      mobileImage: mobileImagePath,
    },
    isActive,
    Number(order)
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Banner created successfully",
    data: result,
  });
});

export const getAllBanners = catchAsync(async (req: Request, res: Response) => {
  const { bannerType, category } = req.query;

  const result = await bannerService.getAllBannersService(
    bannerType as string,
    category as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "All banners retrieved successfully",
    data: result,
  });
});

export const getActiveBanners = catchAsync(
  async (req: Request, res: Response) => {
    const { bannerType, category } = req.query;

    const result = await bannerService.getActiveBannersService(
      bannerType as string,
      category as string
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "All banners retrieved successfully",
      data: result,
    });
  }
);

export const getSingleBanner = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await bannerService.getSingleBannerService(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Banner retrieved successfully",
      data: result,
    });
  }
);

export const updateBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { bannerType, category, isActive, order } = req.body;

  const files = req.files as
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined;

  const desktopImagePath = files?.desktopImage?.[0]?.path;
  const mobileImagePath = files?.mobileImage?.[0]?.path;

  const result = await bannerService.updateBannerService({
    id,
    bannerType,
    category,
    desktopImage: desktopImagePath,
    mobileImage: mobileImagePath,
    isActive,
    order: order ? Number(order) : undefined,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Banner updated successfully",
    data: result,
  });
});
export const deleteBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  await bannerService.deleteBannerService(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Banner deleted successfully",
  });
});
