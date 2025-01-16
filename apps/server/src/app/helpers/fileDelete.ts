import { NextFunction, Request } from "express";
import fs from "fs/promises";
import path from "path";
import Upload from "../modules/upload-file/upload.model";

interface ICleanupOptions {
  deleteFromDB?: boolean;
}

/**
 * Deletes files from both storage and database
 */
const fileDelete = async (
  req: Request,
  next: NextFunction,
  options: ICleanupOptions = { deleteFromDB: true }
): Promise<void> => {
  try {
    const uploadedFileIds: string[] = [];

    // Get uploaded file IDs from request
    if (req.body?.uploadedFiles) {
      uploadedFileIds.push(...req.body.uploadedFiles);
    }

    if (uploadedFileIds.length > 0 && options.deleteFromDB) {
      const filesToDelete = await Upload.find({
        _id: { $in: uploadedFileIds },
      });

      // Delete files from storage
      await Promise.all(
        filesToDelete.map(async (file) => {
          const fullPath = path.join(process.cwd(), file.path);
          try {
            await fs.unlink(fullPath);
          } catch (error) {
            console.error(`Error deleting file ${fullPath}:`, error);
          }
        })
      );

      await Upload.deleteMany({ _id: { $in: uploadedFileIds } });
    }

    //  handle files that are in the current request but not yet saved to DB
    // if (req.file) {
    //   await fs.unlink(req.file.path);
    // }

    // if (req.files) {
    //   if (Array.isArray(req.files)) {
    //     await Promise.all(
    //       req.files.map((file) => fs.unlink(file.path))
    //     );
    //   } else {
    //     for (const field of Object.values(req.files)) {
    //       if (Array.isArray(field)) {
    //         await Promise.all(
    //           field.map((file) => fs.unlink(file.path))
    //         );
    //       }
    //     }
    //   }
    // }
  } catch (error) {
    console.error("Error in file cleanup:", error);
    next(error);
  }
};

export default fileDelete;
