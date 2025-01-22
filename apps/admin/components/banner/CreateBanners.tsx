"use client";

import { useCreateBannerMutation } from "@/redux/features/banners/bannerApi";
import { useGetAllCategoryQuery } from "@/redux/features/category/categoryApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { bannerZodSchema, categoryType } from "@workspace/shared/index";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { cn } from "@workspace/ui/lib/utils";
import { AlertCircle, CableIcon, CheckCircle2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

const CreateBanners = () => {
  // State management
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  // API hooks
  const [createBanner, { isLoading, isSuccess, error }] =
    useCreateBannerMutation();
  const { data: categoryData, isLoading: isCategoryLoading } =
    useGetAllCategoryQuery({});
  const categories = categoryData?.data as categoryType.ICategorySubcategory[];

  // Form initialization with validation
  const form = useForm<z.infer<typeof bannerZodSchema.bannerSchema>>({
    resolver: zodResolver(bannerZodSchema.bannerSchema),
    defaultValues: {
      bannerType: "mainBanner",
      category: "",
      order: 0,
      isActive: true,
    },
    mode: "onChange",
  });

  const bannerType = form.watch("bannerType");

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragAccept, isDragReject, isFocused } =
    useDropzone({
      accept: {
        "image/png": [".png"],
        "image/jpg": [".jpg", ".jpeg"],
        "image/webp": [".webp"],
      },
      maxFiles: 1,
      maxSize: 5000000,
      onDrop: (acceptedFiles) => {
        if (acceptedFiles?.[0]) {
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
          }
          const file = acceptedFiles[0];
          setSelectedImage(file);
          setPreviewUrl(URL.createObjectURL(file));
          setFormError(null);
        }
      },
      onDropRejected: (fileRejections) => {
        const error = fileRejections[0]?.errors[0];
        if (error) {
          switch (error.code) {
            case "file-too-large":
              setFormError("Image must be smaller than 5MB");
              break;
            case "file-invalid-type":
              setFormError("Please upload a PNG, JPG, or WEBP file");
              break;
            default:
              setFormError(error.message);
          }
        }
      },
    });

  // Form submission handler
  const onSubmit = async (
    values: z.infer<typeof bannerZodSchema.bannerSchema>
  ) => {
    try {
      if (!selectedImage) {
        setFormError("Please select an image");
        return;
      }

      if (values.bannerType === "categoryBanner" && !values.category) {
        setFormError("Please select a category");
        return;
      }

      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("bannerType", values.bannerType);
      formData.append("order", (values.order ?? "0").toString());
      formData.append("isActive", (values.isActive ?? true).toString());

      if (values.bannerType === "categoryBanner" && values.category) {
        formData.append("category", values.category);
      }

      const response = await createBanner({ data: formData }).unwrap();
      console.log("Banner created successfully:", response);

      // Reset form state
      form.reset({
        bannerType: "mainBanner",
        category: "",
        order: 0,
        isActive: true,
      });
      setSelectedImage(null);
      setPreviewUrl(null);
      setFormError(null);
    } catch (err) {
      console.error("Failed to create banner:", err);
      setFormError("Failed to create banner. Please try again.");
    }
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Toast notifications
  useEffect(() => {
    if (isSuccess) {
      toast.success("Banner created successfully");
      router.push("/banners");
    } else if (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorData = error as any;
      toast.error(errorData?.data?.message || "Failed to create banner");
    }
  }, [error, isSuccess, router]);

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
  }, [isMounted]);

  // Image preview renderer
  const renderImagePreview = () => {
    if (!previewUrl) {
      return (
        <div className="p-8 text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop your banner image here, or click to select
          </p>
          <p className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
        </div>
      );
    }

    return (
      <div className="relative w-full h-48">
        {previewUrl && (
          <>
            <Image
              src={previewUrl}
              alt="Banner preview"
              fill
              className="object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (previewUrl) {
                  URL.revokeObjectURL(previewUrl);
                }
                setSelectedImage(null);
                setPreviewUrl(null);
              }}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Create New Banner</h2>
          <p className="text-gray-600">
            Add a new banner to display on your website
          </p>
        </div>

        {formError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Banner Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="bannerType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Type</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value !== "categoryBanner") {
                          form.setValue("category", "");
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Banner Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mainBanner">Main Banner</SelectItem>
                        <SelectItem value="categoryBanner">
                          Category Banner
                        </SelectItem>
                        <SelectItem value="topBanner">Top Banner</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {bannerType === "categoryBanner" && (
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setFormError(null);
                        }}
                        value={field.value}
                        disabled={isCategoryLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((item) => (
                            <SelectItem
                              key={item?._id.toString()}
                              value={item?._id.toString()}
                            >
                              {item?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Order and Active Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter display order"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormDescription>
                      Lower numbers appear first
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Banner will be visible when active
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <FormLabel>Banner Image</FormLabel>
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-lg transition-all",
                  isDragAccept && "border-green-500 bg-green-50",
                  isDragReject && "border-red-500 bg-red-50",
                  isFocused && "border-blue-500",
                  "cursor-pointer"
                )}
              >
                <input {...getInputProps()} />
                {renderImagePreview()}
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              {isLoading ? (
                <>
                  <CableIcon className="mr-2 h-4 w-4 animate-spin" />
                  Creating Banner...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Create Banner
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateBanners;
