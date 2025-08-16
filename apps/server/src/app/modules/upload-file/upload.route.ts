import express from "express";
import { z } from "zod";
import { fileUploader } from "../../middlewares/uploadFile";
import { isAuthenticated } from "../../middlewares/authGuards";
import validateRequest from "../../middlewares/validateRequest";
import {
  deleteUploadedFile,
  getUploads,
  uploadFiles,
} from "./upload.controller";

const uploadRouter = express.Router();

const uploadSchema = z.object({
  body: z.object({
    purpose: z.enum(["product", "user", "category", "brand", "landing"]),
  }),
});

uploadRouter.post(
  "/multiple",
  isAuthenticated,
  (req, res, next) => {
    const { purpose } = req.query;
    if (
      !purpose ||
      !["product", "user", "category", "brand", "landing"].includes(
        purpose as string
      )
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "A valid 'purpose' query parameter is required.",
        });
    }
    const destination = `public/uploads/${purpose}`;
    fileUploader(destination, "array", "files", 10)(req, res, next);
  },
  (req, res, next) => {
    req.body.purpose = req.query.purpose;
    next();
  },
  validateRequest(uploadSchema),
  uploadFiles
);

uploadRouter.delete("/:uploadId", isAuthenticated, deleteUploadedFile);
uploadRouter.get("/", isAuthenticated, getUploads);

export default uploadRouter;
