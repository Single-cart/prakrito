import { landing } from "@workspace/shared";
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../middlewares/catchAsync";
import sendResponse from "../../utils/sendResponse";
import * as landingService from "./landing.service";

// Create landing page
export const createLanding = catchAsync(async (req: Request, res: Response) => {
  const {
    heading,
    product,
    name,
    phone,
    order,
    isActive,
    youtubeLink,
    youtubeLinks,
    description,
    certificateTitle,
    certificates,
    heroBtnText,
    offerTitle,
    offerDescription,
    reviews,
    productGallery,
  } = req.body;

  const landingData: Pick<
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
  > = {
    heading,
    product,
    name,
    phone,
    youtubeLink,
    youtubeLinks,
    description,
    certificateTitle,
    certificates,
    heroBtnText,
    offerTitle,
    offerDescription,
    reviews,
    productGallery,
    order: order ? Number(order) : 0,
    isActive: isActive !== undefined ? Boolean(isActive) : true,
  };

  const result = await landingService.createLandingService(landingData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Landing page created successfully",
    data: result,
  });
});

// Get all landing pages
export const getAllLandings = catchAsync(
  async (req: Request, res: Response) => {
    const result = await landingService.getAllLandingsService();

    sendResponse<landing.ILanding[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Landing pages retrieved successfully",
      data: result.data,
    });
  }
);

// Get single landing page
export const getSingleLanding = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await landingService.getSingleLandingService(id);

    sendResponse<landing.ILanding>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Landing page retrieved successfully",
      data: result,
    });
  }
);

// Update landing page
export const updateLanding = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updateData = req.body;

  const result = await landingService.updateLandingService(id, updateData);

  sendResponse<landing.ILanding>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Landing page updated successfully",
    data: result,
  });
});

// Delete landing page
export const deleteLanding = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await landingService.deleteLandingService(id);

  sendResponse<landing.ILanding>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Landing page deleted successfully",
    data: result,
  });
});
