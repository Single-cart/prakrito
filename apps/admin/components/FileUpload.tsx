"use client";

import { File as FileIcon, Loader2, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";

import { getImgUrl } from "@/lib/getImgPath";
import {
  useDeleteUploadedFileMutation,
  useGetUploadsQuery,
  useUploadFilesMutation,
} from "@/redux/features/upload/uploadApi";
import { Button } from "@workspace/ui/components/button";

interface FileUploadProps {
  onUploadComplete: (fileIds: string[]) => void;
  purpose: "product" | "user" | "category" | "brand" | "landing";
  maxFiles?: number;
  label: string;
  description?: string;
  displayFileIds: string[];
  onFileRemoved: (fileId: string) => void;
}

export default function FileUpload({
  onUploadComplete,
  purpose,
  maxFiles = 1,
  label,
  description,
  displayFileIds,
  onFileRemoved,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadFiles, { isLoading: isUploading }] = useUploadFilesMutation();
  const { data: uploadedFilesData, isLoading: isFetching } = useGetUploadsQuery(purpose);
  const [deleteUploadedFile] = useDeleteUploadedFileMutation();

  const filesToDisplay = uploadedFilesData?.data?.filter((file: any) =>
    displayFileIds.includes(file._id)
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      if (files.length + newFiles.length > maxFiles) {
        toast.error(`You can only upload a maximum of ${maxFiles} files.`);
        return;
      }
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select files to upload.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const result = await uploadFiles({ formData, purpose }).unwrap();

      toast.success("Files uploaded successfully!");

      const fileIds = result.data.map((file: any) => file._id);
      onUploadComplete(fileIds);
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      const errorMessage =
        error.data?.errorMessages?.[0]?.message ||
        error.data?.message ||
        "File upload failed";
      toast.error(errorMessage);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await deleteUploadedFile(fileId).unwrap();
      toast.success("File deleted successfully.");
      onFileRemoved(fileId); // Notify parent to update its state
    } catch (error) {
      toast.error("Failed to delete file.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium">{label}</label>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <div
        className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 hover:border-gray-400"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className="hidden"
        />
        <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
        <p className="mb-2 text-sm text-gray-500">
          <span className="font-semibold">Click to upload</span>
        </p>
        <p className="text-xs text-gray-500">Images (up to {maxFiles} files)</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected for Upload:</h4>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 border rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <FileIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-sm">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  disabled={isUploading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
          <Button
            onClick={handleUpload}
            disabled={isUploading || files.length === 0}
            className="mt-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              `Upload ${files.length} file(s)`
            )}
          </Button>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Uploaded Files:</h4>
        {isFetching ? (
          <p>Loading files...</p>
        ) : filesToDisplay?.length > 0 ? (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filesToDisplay.map((file: any) => (
              <li
                key={file._id}
                className="relative group border rounded-lg overflow-hidden aspect-square"
              >
                <Image
                  src={getImgUrl(file.path)}
                  alt={file.originalName}
                  fill
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteFile(file._id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No files uploaded yet.</p>
        )}
      </div>
    </div>
  );
}