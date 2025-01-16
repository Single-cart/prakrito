import { Request } from "express";
import fs from "fs";
import httpStatus from "http-status";
import multer from "multer";
import path from "path";
import ApiError from "../errorHandlers/ApiError";

type UploadPurpose = "product" | "user" | "category" | "brand";

const createStorage = (purpose: UploadPurpose) => {
  return multer.diskStorage({
    destination: (_req: Request, _file: Express.Multer.File, cb) => {
      const uploadPath = path.join(process.cwd(), `public/uploads/${purpose}`);

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename: (_req: Request, file: Express.Multer.File, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(
        null,
        `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
      );
    },
  });
};

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        httpStatus.BAD_REQUEST,
        "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."
      )
    );
  }
};

export const createUploader = (purpose: UploadPurpose) => {
  return multer({
    storage: createStorage(purpose),
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB per file
    },
  });
};
