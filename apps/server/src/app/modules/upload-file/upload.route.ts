import express from "express";
import { createUploader } from "src/app/helpers/multer.config";
import { isAuthenticated } from "src/app/middlewares/authGuards";
import validateRequest from "src/app/middlewares/validateRequest";
import { z } from "zod";
import {
  deleteUploadedFile,
  getUploads,
  uploadFiles,
} from "./upload.controller";

const uploadRouter = express.Router();

const uploadSchema = z.object({
  body: z.object({
    purpose: z.enum(["product", "user", "category", "brand"]),
  }),
});

uploadRouter.post(
  "/multiple",
  isAuthenticated,
  validateRequest(uploadSchema),
  createUploader("product").array("files", 10), // Allow up to 10 files
  uploadFiles
);

uploadRouter.delete("/:uploadId", isAuthenticated, deleteUploadedFile);
uploadRouter.get("/", isAuthenticated, getUploads);

export default uploadRouter;
