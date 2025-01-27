"use client";

import { env } from "@/lib/env";
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
import { revalidateTag } from "next/cache";
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
    image: string;
  };
}

const UpdateBanner = ({ banner }: UpdateBannerProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [, setSubcategory] = useState<categoryType.ISubCategory[] | null>([]);

  const router = useRouter();

  const [updateBanner, { isLoading, isSuccess, error }] =
    useUpdateBannerMutation();
  const { data } = useGetAllCategoryQuery({});
  const categoryData = data?.data as categoryType.ICategorySubcategory[];

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
      onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
          setSelectedImage(file);
          const objectUrl = URL.createObjectURL(file);
          setPreviewUrl(objectUrl);
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

      if (selectedImage) {
        formData.append("image", selectedImage);
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
      await revalidateTag("Banner");
    } catch (err) {
      console.error("Failed to update banner:", err);
    }
  };

  // Cleanup function for object URLs
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Banner updated successfully");
      router.push("/banners");
    } else if (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorData = error as any;
      toast.error(errorData?.data?.message || "Failed to update banner");
    }
  }, [error, isSuccess, router]);

  const getCurrentImageUrl = () => {
    if (previewUrl) {
      return previewUrl;
    }

    return `${env.NEXT_PUBLIC_SERVER_URL}/${banner.image}`;
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

          {/* Current Image Preview */}
          <div className="space-y-4">
            <FormLabel>Current Banner Image</FormLabel>
            <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100">
              {banner.image && (
                <div className="relative w-full h-full">
                  <Image
                    src={getCurrentImageUrl()}
                    alt="Current banner"
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
          </div>

          {/* Image dropzone */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-4",
              isDragAccept || (isFocused && "border-blue-500"),
              isDragReject && "border-red-500",
              "text-center flex flex-col items-center justify-center h-44 transition-all"
            )}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <p className="text-sm text-gray-600">
              {isLoading
                ? "Updating image..."
                : "Drop new banner image here or click to select"}
            </p>
            {selectedImage && (
              <p className="text-sm text-green-600 mt-2">
                Selected: {selectedImage.name}
              </p>
            )}
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
