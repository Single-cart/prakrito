/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { LoadingButton } from "@/components/LoaderButton";
import { categoryType, product } from "@workspace/shared/index";
import { Button } from "@workspace/ui/components/button";
import {
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";

import { customRevalidate } from "@/lib/fetch/customRevalidate";
import {
  useGetCartItemQuery,
  useTotalPriceQuery,
} from "@/redux/features/cart/cartApi";
import { useGetAllCategoryQuery } from "@/redux/features/category/categoryApi";
import { useUpdateProductMutation } from "@/redux/features/product/productApi";
import { InfoIcon, PackageIcon, TagIcon } from "lucide-react";

const UpdateDescForm = dynamic(() => import("../_components/UpdateDescForm"), {
  ssr: false,
});
const AddColorsSize = dynamic(() => import("./AddColorsSize"), {
  ssr: false,
});

type Props = {
  product: product.IProductRes;
};

const UpdateProductInfo: FC<Props> = ({ product }) => {
  const [subcategory, setSubcategory] = useState<
    categoryType.ISubCategory[] | null
  >(null);
  const [images, setImages] = useState<FileList | null>(null);
  const router = useRouter();
  console.log("product stock", product);
  const { refetch } = useGetCartItemQuery({});
  const { refetch: totalPriceRefetch } = useTotalPriceQuery({});
  const { data } = useGetAllCategoryQuery({});
  const [updateProduct, { isLoading, error, isSuccess }] =
    useUpdateProductMutation();
  const category = data?.data as categoryType.ICategorySubcategory[] | null;
  const form = useForm({
    defaultValues: {
      name: product?.name || "",
      price: product?.price?.toString() || "",
      discountPrice: product?.discountPrice?.toString() || "",
      insideDhaka:
        product?.insideDhaka === 0 ? "0" : product?.insideDhaka?.toString(),
      outsideDhaka:
        product?.outsideDhaka === 0 ? "0" : product?.outsideDhaka?.toString(),
      stock: product?.stock === 0 ? "0" : product?.stock?.toString(),
      description: product?.description || "",
      category: product?.category?._id || "",
      subcategory: product?.subcategory?._id || "",
      colors: product?.colors || [],
      size: product?.size || [],
      order: product?.order.toString() || "0",
    },
  });

  const handleSubmit = async (value: any) => {
    try {
      // Instead of FormData, let's send a regular object
      const requestData: product.IUpdateProductInput = {
        id: product?._id,
        name: value.name,
        price: Number(value.price),
        discountPrice: value.discountPrice.toString(),
        insideDhaka: Number(value.insideDhaka),
        outsideDhaka: Number(value.outsideDhaka),
        stock: Number(value.stock),
        description: value.description,
        category: value.category,
        subcategory: value.subcategory,
        order: Number(value.order),
        colors: value.colors.map((color: any) => ({
          name: color.name,
          stock: Boolean(color.stock),
        })),
        size: value.size.map((size: any) => ({
          name: size.name,
          available: Boolean(size.available),
        })),
      };

      // Only handle images with FormData if there are new images
      if (images && images.length > 0) {
        const formData = new FormData();

        // Add all the regular data
        Object.keys(requestData).forEach((key) => {
          if (key === "colors" || key === "size") {
            formData.append(key, JSON.stringify(requestData[key]));
          } else {
            formData.append(key, requestData[key]);
          }
        });

        // Add images
        Array.from(images).forEach((file) => {
          formData.append("images", file);
        });

        await updateProduct({ data: formData });
      } else {
        // If no new images, send regular JSON
        await updateProduct({
          data: requestData,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      await Promise.all([
        await customRevalidate("getAllProducts"),
        await customRevalidate("singleProduct"),
        await refetch(),
        await totalPriceRefetch(),
      ]);
      router.refresh();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImages(e.target.files);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Product Updated Successfully");
      router.replace("/products");
    } else if (error) {
      toast.error("Somthing is wrong. please try again");
    }
  }, [error, isSuccess, router]);

  useEffect(() => {
    const defaultSubcategory =
      category &&
      category?.find((item) => item?._id === product?.category?._id);
    if (defaultSubcategory) {
      setSubcategory(defaultSubcategory?.subcategory);
    }
  }, [category, product?.category?._id]);

  return (
    <div className="w-full">
      <CardHeader>
        <CardTitle>Update Product</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <InfoIcon className="h-4 w-4 md:hidden" />
                  <span className="hidden md:inline">Basic Info</span>
                  <span className="md:hidden">Basic</span>
                </TabsTrigger>
                <TabsTrigger
                  value="pricing"
                  className="flex items-center gap-2"
                >
                  <TagIcon className="h-4 w-4 md:hidden" />
                  <span className="hidden md:inline">Pricing & Stock</span>
                  <span className="md:hidden">Pricing</span>
                </TabsTrigger>
                <TabsTrigger
                  value="attributes"
                  className="flex items-center gap-2"
                >
                  <PackageIcon className="h-4 w-4 md:hidden" />
                  <span className="hidden md:inline">Attributes</span>
                  <span className="md:hidden">Attrs</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="category"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            const selectedCategory = data?.category?.find(
                              (item: any) => item?._id === value
                            );
                            setSubcategory(
                              selectedCategory?.subcategory || null
                            );
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {category?.map((item) => (
                              <SelectItem key={item?._id} value={item?._id}>
                                {item?.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="subcategory"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subcategory</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subcategory" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subcategory?.map((item) => (
                              <SelectItem key={item?._id} value={item?._id}>
                                {item?.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormLabel>Product Images</FormLabel>
                  <Input
                    type="file"
                    multiple
                    onChange={handleChange}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="cursor-pointer"
                  />
                  <FormDescription>
                    Uploading new images will replace existing ones
                  </FormDescription>
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="price"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Regular Price</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="discountPrice"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Price</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="order"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Order</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1,2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="stock"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="insideDhaka"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inside Dhaka</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="outsideDhaka"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Outside Dhaka</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="attributes" className="space-y-4 mt-4">
                <AddColorsSize form={form} />
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Product Description</h2>
                  <UpdateDescForm form={form} />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-4">
              {isLoading ? (
                <LoadingButton />
              ) : (
                <Button type="submit" className="w-32">
                  Update Product
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </div>
  );
};

export default UpdateProductInfo;
