import httpStatus from "http-status";
import ApiError from "../../errorHandlers/ApiError";
import catchAsync from "../../middlewares/catchAsync";
import sendResponse from "../../utils/sendResponse";
import CustomerModel from "./review.model";

export const createCustomerReview = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Image is Required");
  }

  const customerReview = await CustomerModel.create({
    image: req.file?.path,
  });

  sendResponse(res, {
    success: true,
    message: "Customer review create successfully",
    data: {
      customerReview,
    },
    statusCode: httpStatus.CREATED,
  });
});

export const getAllCustomerReview = catchAsync(async (req, res) => {
  const customerReview = await CustomerModel.find();

  sendResponse(res, {
    success: true,
    message: "All Customer review",
    data: {
      customerReview,
    },
    statusCode: httpStatus.OK,
  });
});

export const deleteCustomerReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const customerReview = await CustomerModel.findByIdAndDelete(id, {
    new: true,
  });

  if (!customerReview) {
    throw new ApiError(404, "Customer review not found");
  }

  sendResponse(res, {
    success: true,
    message: "Customer review deleted successfully",
    data: {
      customerReview,
    },
    statusCode: httpStatus.OK,
  });
});
