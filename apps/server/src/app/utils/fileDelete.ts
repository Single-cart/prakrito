import { NextFunction, Request } from "express";

import fs from "fs/promises";

const fileDelete = async (req: Request, next: NextFunction) => {
  if (req.file) {
    await fs.unlink(req.file.path);
  }

  if (req.files) {
    if (Array.isArray(req.files)) {
      await Promise.all(req.files.map((file) => fs.unlink(file.path)));
    } else {
      for (const field of Object.values(req.files)) {
        if (Array.isArray(field)) {
          await Promise.all(field.map((file) => fs.unlink(file.path)));
        }
      }
    }
  }
};

export default fileDelete;
