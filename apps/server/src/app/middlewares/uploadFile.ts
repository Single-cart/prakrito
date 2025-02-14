import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

type UploadType = "single" | "array" | "fields";

export const fileUploader = (
  destination: string,
  uploadType: UploadType = "single",
  fieldConfig: string | { name: string; maxCount: number }[] = "file",
  maxCount: number = 5
) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },

    filename: (req, file, cb) => {
      const originalName = file.originalname.replace(/\s+/g, "-");
      const name = Date.now() + "-" + originalName;
      cb(null, name);
    },
  });

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/webp" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .png, .webp or .jpeg format allowed!"));
    }
  };

  const multerInstance = multer({
    fileFilter: fileFilter,
    storage: storage,
    limits: {
      fileSize: uploadType === "single" ? 1024 * 1024 * 5 : 1024 * 1024 * 40,
    },
  });

  switch (uploadType) {
    case "single":
      return multerInstance.single(fieldConfig as string);
    case "array":
      return multerInstance.array(fieldConfig as string, maxCount);
    case "fields":
      return multerInstance.fields(
        fieldConfig as { name: string; maxCount: number }[]
      );
    default:
      return multerInstance.single("file");
  }
};
