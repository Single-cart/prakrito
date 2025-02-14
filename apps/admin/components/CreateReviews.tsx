"use client";

import { customRevalidate } from "@/lib/fetch/customRevalidate";
import { useCreateReviewMutation } from "@/redux/features/customerReview/customerReviewApi";
import { Card } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import { Upload } from "lucide-react";
import { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

const CreateReviews = () => {
  const [createReview, { isLoading, isSuccess, error }] =
    useCreateReviewMutation();

  const { getRootProps, getInputProps, isDragAccept, isDragReject, isFocused } =
    useDropzone({
      accept: {
        "image/png": [".png"],
        "image/jpg": [".jpg"],
        "image/jpeg": [".jpeg"],
        "image/webp": [".webp"],
      },
      maxFiles: 1,
      maxSize: 5000000,
      onDrop: async (acceptedFiles) => {
        const file = acceptedFiles[0];
        const formData = new FormData();
        if (file) {
          formData.append("image", file);
        }
        await createReview({
          data: formData,
        });
        await customRevalidate("customerReview");
      },
    });

  useEffect(() => {
    if (isSuccess) {
      toast.success("File Upload successful");
    } else if (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorData = error as any;
      toast.error(errorData?.data?.message);
    }
  }, [error, isSuccess]);

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed text-center flex flex-col items-center justify-center h-44 transition-all cursor-pointer",
        isDragAccept && "border-green-500",
        isDragReject && "border-red-500",
        isFocused && "border-blue-500"
      )}
    >
      <input {...getInputProps()} />
      <Upload className="w-10 h-10 text-gray-400 mb-2" />
      <p className="text-sm text-gray-500">
        {isLoading ? "Image Uploading..." : "Drag & Drop Review Image"}
      </p>
    </Card>
  );
};

export default CreateReviews;
