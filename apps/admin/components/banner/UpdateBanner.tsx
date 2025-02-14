"use client";

import { env } from "@/lib/env";
import { customRevalidate } from "@/lib/fetch/customRevalidate";
import { useUpdateBannerMutation } from "@/redux/features/banners/bannerApi";
import { useGetAllCategoryQuery } from "@/redux/features/category/categoryApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { bannerZodSchema, categoryType } from "@workspace/shared/index";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Form,
  FormControl,
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
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface UpdateBannerProps {
  banner: {
    _id: string;
    bannerType: "topBanner" | "mainBanner" | "categoryBanner" | undefined;
    category?: string;
    order: string;
    isActive: boolean;
    mobileImage: string;
    desktopImage: string;
  };
}

const UpdateBanner = ({ banner }: UpdateBannerProps) => {
  const [selectedMobileImage, setSelectedMobileImage] = useState<File | null>(
    null
  );
  const [selectedDesktopImage, setSelectedDesktopImage] = useState<File | null>(
    null
  );
  const [mobilePreviewUrl, setMobilePreviewUrl] = useState<string | null>(null);
  const [desktopPreviewUrl, setDesktopPreviewUrl] = useState<string | null>(
    null
  );
  const [, setSubcategory] = useState<categoryType.ISubCategory[] | null>([]);

  const router = useRouter();

  const [updateBanner, { isLoading, isSuccess, error }] =
    useUpdateBannerMutation();
  const { data } = useGetAllCategoryQuery({});
  const categoryData = data?.data as categoryType.ICategorySubcategory[];

  // Mobile image dropzone
  const {
    getRootProps: getMobileRootProps,
    getInputProps: getMobileInputProps,
    isDragAccept: isMobileDragAccept,
    isDragReject: isMobileDragReject,
    isFocused: isMobileFocused,
  } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    maxSize: 5000000,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setSelectedMobileImage(file);
        const objectUrl = URL.createObjectURL(file);
        setMobilePreviewUrl(objectUrl);
      }
    },
  });

  // Desktop image dropzone
  const {
    getRootProps: getDesktopRootProps,
    getInputProps: getDesktopInputProps,
    isDragAccept: isDesktopDragAccept,
    isDragReject: isDesktopDragReject,
    isFocused: isDesktopFocused,
  } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    maxSize: 5000000,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setSelectedDesktopImage(file);
        const objectUrl = URL.createObjectURL(file);
        setDesktopPreviewUrl(objectUrl);
      }
    },
  });

  const form = useForm<z.infer<typeof bannerZodSchema.bannerSchema>>({
    resolver: zodResolver(bannerZodSchema.bannerSchema),
    defaultValues: {
      bannerType: banner.bannerType,
      category: banner.category || "",
      order: banner.order.toString() || "0",
      isActive: banner.isActive,
    },
  });

  const handleSubmit = async (
    value: z.infer<typeof bannerZodSchema.bannerSchema>
  ) => {
    try {
      const formData = new FormData();

      if (selectedMobileImage) {
        formData.append("mobileImage", selectedMobileImage);
      }

      if (selectedDesktopImage) {
        formData.append("desktopImage", selectedDesktopImage);
      }

      formData.append("bannerType", value.bannerType);
      formData.append("order", value.order?.toString() || "0");
      formData.append("isActive", value.isActive ? "true" : "false");

      if (value.bannerType === "categoryBanner" && value.category) {
        formData.append("category", value.category);
      }

      await updateBanner({
        id: banner._id,
        body: formData,
      }).unwrap();
      await customRevalidate("Banner");
    } catch (err) {
      console.error("Failed to update banner:", err);
    }
  };

  // Cleanup function for object URLs
  useEffect(() => {
    return () => {
      if (mobilePreviewUrl) {
        URL.revokeObjectURL(mobilePreviewUrl);
      }
      if (desktopPreviewUrl) {
        URL.revokeObjectURL(desktopPreviewUrl);
      }
    };
  }, [mobilePreviewUrl, desktopPreviewUrl]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Banner updated successfully");
      router.push("/banners");
    } else if (error) {
      const errorData = error as any;
      toast.error(errorData?.data?.message || "Failed to update banner");
    }
  }, [error, isSuccess, router]);

  const getMobileImageUrl = () => {
    if (mobilePreviewUrl) {
      return mobilePreviewUrl;
    }
    return `${env.NEXT_PUBLIC_SERVER_URL}/${banner.mobileImage}`;
  };

  const getDesktopImageUrl = () => {
    if (desktopPreviewUrl) {
      return desktopPreviewUrl;
    }
    return `${env.NEXT_PUBLIC_SERVER_URL}/${banner.desktopImage}`;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="bannerType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
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

            {form.watch("bannerType") === "categoryBanner" && (
              <FormField
                name="category"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        const selectedCategory = categoryData?.find(
                          (item) => item?._id.toString() === value
                        );
                        setSubcategory(selectedCategory?.subcategory || null);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryData?.map((item) => (
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

          <div className="grid grid-cols-2 gap-6">
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="mt-0">Active</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Desktop Image Section */}
          <div className="space-y-4">
            <FormLabel>Desktop Banner Image</FormLabel>
            <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100">
              {banner.desktopImage && (
                <div className="relative w-full h-full">
                  <Image
                    src={getDesktopImageUrl()}
                    alt="Desktop banner"
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                    }}
                    width={500}
                    height={200}
                  />
                </div>
              )}
            </div>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-4",
                isDesktopDragAccept || (isDesktopFocused && "border-blue-500"),
                isDesktopDragReject && "border-red-500",
                "text-center flex flex-col items-center justify-center h-44 transition-all"
              )}
              {...getDesktopRootProps()}
            >
              <input {...getDesktopInputProps()} />
              <p className="text-sm text-gray-600">
                Drop new desktop banner image here or click to select
              </p>
              {selectedDesktopImage && (
                <p className="text-sm text-green-600 mt-2">
                  Selected: {selectedDesktopImage.name}
                </p>
              )}
            </div>
          </div>

          {/* Mobile Image Section */}
          <div className="space-y-4">
            <FormLabel>Mobile Banner Image</FormLabel>
            <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100">
              {banner.mobileImage && (
                <div className="relative w-full h-full">
                  <Image
                    src={getMobileImageUrl()}
                    alt="Mobile banner"
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                    }}
                    width={500}
                    height={200}
                  />
                </div>
              )}
            </div>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-4",
                isMobileDragAccept || (isMobileFocused && "border-blue-500"),
                isMobileDragReject && "border-red-500",
                "text-center flex flex-col items-center justify-center h-44 transition-all"
              )}
              {...getMobileRootProps()}
            >
              <input {...getMobileInputProps()} />
              <p className="text-sm text-gray-600">
                Drop new mobile banner image here or click to select
              </p>
              {selectedMobileImage && (
                <p className="text-sm text-green-600 mt-2">
                  Selected: {selectedMobileImage.name}
                </p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Updating Banner..." : "Update Banner"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UpdateBanner;
