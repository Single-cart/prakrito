import httpStatus from "http-status";
import ApiError from "../../errorHandlers/ApiError";
import catchAsync from "../../middlewares/catchAsync";
import sendResponse from "../../utils/sendResponse";
import * as uploadService from "./upload.service";

export const uploadFiles = catchAsync(async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const { purpose } = req.body;
  const userId = res.locals.user._id;

  if (!files || files.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No files uploaded");
  }

  const uploadedFiles = await Promise.all(
    files.map((file) =>
      uploadService.saveFileInfo({
        fileName: file.filename,
        originalName: file.originalname,
        path: file.path.replace(process.cwd(), ""),
        mimeType: file.mimetype,
        size: file.size,
        userId,
        purpose,
      })
    )
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Files uploaded successfully",
    data: uploadedFiles,
  });
});

export const deleteUploadedFile = catchAsync(async (req, res) => {
  const { uploadId } = req.params;
  const userId = res.locals.user._id;

  await uploadService.deleteFile(uploadId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "File deleted successfully",
  });
});

export const getUploads = catchAsync(async (req, res) => {
  const { purpose } = req.query;
  const userId = res.locals.user._id;

  const files = await uploadService.getFilesByPurpose(
    purpose as string,
    userId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Files retrieved successfully",
    data: files,
  });
});
