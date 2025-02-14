"use client";

import { customRevalidate } from "@/lib/fetch/customRevalidate";
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

// Extended schema for multiple images
const extendedBannerSchema = bannerZodSchema.bannerSchema;

const CreateBanners = () => {
  // State management for desktop image
  const [selectedDesktopImage, setSelectedDesktopImage] = useState<File | null>(
    null
  );
  const [desktopPreviewUrl, setDesktopPreviewUrl] = useState<string | null>(
    null
  );

  // State management for mobile image
  const [selectedMobileImage, setSelectedMobileImage] = useState<File | null>(
    null
  );
  const [mobilePreviewUrl, setMobilePreviewUrl] = useState<string | null>(null);

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
  const form = useForm<z.infer<typeof extendedBannerSchema>>({
    resolver: zodResolver(extendedBannerSchema),
    defaultValues: {
      bannerType: "mainBanner",
      category: "",
      order: "0",
      isActive: true,
    },
    mode: "onChange",
  });

  const bannerType = form.watch("bannerType");

  // Desktop image dropzone configuration
  const desktopDropzone = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    maxSize: 5000000,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.[0]) {
        if (desktopPreviewUrl) {
          URL.revokeObjectURL(desktopPreviewUrl);
        }
        const file = acceptedFiles[0];
        setSelectedDesktopImage(file);
        setDesktopPreviewUrl(URL.createObjectURL(file));
        setFormError(null);
      }
    },
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error) {
        switch (error.code) {
          case "file-too-large":
            setFormError("Desktop image must be smaller than 5MB");
            break;
          case "file-invalid-type":
            setFormError("Please upload a PNG, JPG, or WEBP file for desktop");
            break;
          default:
            setFormError(error.message);
        }
      }
    },
  });

  // Mobile image dropzone configuration
  const mobileDropzone = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    maxSize: 5000000,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.[0]) {
        if (mobilePreviewUrl) {
          URL.revokeObjectURL(mobilePreviewUrl);
        }
        const file = acceptedFiles[0];
        setSelectedMobileImage(file);
        setMobilePreviewUrl(URL.createObjectURL(file));
        setFormError(null);
      }
    },
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error) {
        switch (error.code) {
          case "file-too-large":
            setFormError("Mobile image must be smaller than 5MB");
            break;
          case "file-invalid-type":
            setFormError("Please upload a PNG, JPG, or WEBP file for mobile");
            break;
          default:
            setFormError(error.message);
        }
      }
    },
  });

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof extendedBannerSchema>) => {
    try {
      if (!selectedDesktopImage) {
        setFormError("Please select a desktop image");
        return;
      }

      if (values.bannerType === "categoryBanner" && !values.category) {
        setFormError("Please select a category");
        return;
      }

      const formData = new FormData();
      formData.append("desktopImage", selectedDesktopImage);

      if (selectedMobileImage) {
        formData.append("mobileImage", selectedMobileImage);
      }

      formData.append("bannerType", values.bannerType);
      formData.append("order", (values.order ?? "0").toString());
      formData.append("isActive", (values.isActive ?? true).toString());

      if (values.bannerType === "categoryBanner" && values.category) {
        formData.append("category", values.category);
      }

      await createBanner({ data: formData });
      await customRevalidate("Banner");

      // Reset form state
      form.reset({
        bannerType: "mainBanner",
        category: "",
        order: "0",
        isActive: true,
      });
      setSelectedDesktopImage(null);
      setDesktopPreviewUrl(null);
      setSelectedMobileImage(null);
      setMobilePreviewUrl(null);
      setFormError(null);
    } catch (err) {
      console.error("Failed to create banner:", err);
      setFormError("Failed to create banner. Please try again.");
    }
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (desktopPreviewUrl) {
        URL.revokeObjectURL(desktopPreviewUrl);
      }
      if (mobilePreviewUrl) {
        URL.revokeObjectURL(mobilePreviewUrl);
      }
    };
  }, [desktopPreviewUrl, mobilePreviewUrl]);

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

  // Image preview renderers
  const renderDesktopImagePreview = () => {
    if (!desktopPreviewUrl) {
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
            Drag and drop desktop banner image here, or click to select
          </p>
          <p className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
        </div>
      );
    }

    return (
      <div className="relative w-full h-48">
        {desktopPreviewUrl && (
          <>
            <Image
              src={desktopPreviewUrl}
              alt="Desktop banner preview"
              fill
              className="object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (desktopPreviewUrl) {
                  URL.revokeObjectURL(desktopPreviewUrl);
                }
                setSelectedDesktopImage(null);
                setDesktopPreviewUrl(null);
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

  const renderMobileImagePreview = () => {
    if (!mobilePreviewUrl) {
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
            Drag and drop mobile banner image here, or click to select
          </p>
          <p className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
        </div>
      );
    }

    return (
      <div className="relative w-full h-48">
        {mobilePreviewUrl && (
          <>
            <Image
              src={mobilePreviewUrl}
              alt="Mobile banner preview"
              fill
              className="object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (mobilePreviewUrl) {
                  URL.revokeObjectURL(mobilePreviewUrl);
                }
                setSelectedMobileImage(null);
                setMobilePreviewUrl(null);
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

            {/* Desktop Image Upload */}
            <div className="space-y-4">
              <FormLabel>Desktop Banner Image (Required)</FormLabel>
              <div
                {...desktopDropzone.getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-lg transition-all",
                  desktopDropzone.isDragAccept &&
                    "border-green-500 bg-green-50",
                  desktopDropzone.isDragReject && "border-red-500 bg-red-50",
                  desktopDropzone.isFocused && "border-blue-500",
                  "cursor-pointer"
                )}
              >
                <input {...desktopDropzone.getInputProps()} />
                {renderDesktopImagePreview()}
              </div>
            </div>

            {/* Mobile Image Upload */}
            <div className="space-y-4">
              <FormLabel>Mobile Banner Image (Optional)</FormLabel>
              <div
                {...mobileDropzone.getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-lg transition-all",
                  mobileDropzone.isDragAccept && "border-green-500 bg-green-50",
                  mobileDropzone.isDragReject && "border-red-500 bg-red-50",
                  mobileDropzone.isFocused && "border-blue-500",
                  "cursor-pointer"
                )}
              >
                <input {...mobileDropzone.getInputProps()} />
                {renderMobileImagePreview()}
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
