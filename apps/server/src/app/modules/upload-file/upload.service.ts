import fs from "fs/promises";
import httpStatus from "http-status";
import path from "path";
import ApiError from "../../errorHandlers/ApiError";
import { IUpload } from "./upload.interface";
import Upload from "./upload.model";

export const saveFileInfo = async (
  fileData: Partial<IUpload>
): Promise<IUpload> => {
  const upload = await Upload.create(fileData);
  return upload;
};

export const deleteFile = async (
  uploadId: string,
  userId: string
): Promise<void> => {
  const upload = await Upload.findOne({ _id: uploadId, userId });

  if (!upload) {
    throw new ApiError(httpStatus.NOT_FOUND, "File not found");
  }

  // Delete from filesystem
  try {
    await fs.unlink(path.join(process.cwd(), upload.path));
  } catch (error) {
    console.error("Error deleting file from filesystem:", error);
  }

  // Delete from database
  await Upload.findByIdAndDelete(uploadId);
};

export const getFilesByPurpose = async (
  purpose: string,
  userId: string
): Promise<IUpload[]> => {
  return Upload.find({ purpose, userId, isActive: true });
};
