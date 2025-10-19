"use client";

import { useGetAllCategoryQuery } from "@/redux/features/category/categoryApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoryType, productZodSchema } from "@workspace/shared/index";
import { Button } from "@workspace/ui/components/button";
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
import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useDispatch } from "react-redux";
import { z } from "zod";

import { creactProductData } from "@/redux/features/product/productSlice";
import { Switch } from "@workspace/ui/components/switch";
import AddPriceVariation from "./AddPriceVariation";

interface Props {
  formStep: number;
  setFormStep: (formStep: number) => void;
  setLocalImages: Dispatch<SetStateAction<File[]>>;
}

const ProductInfoForm: FC<Props> = ({
  formStep,
  setFormStep,
  setLocalImages,
}) => {
  const [subcategory, setSubcategory] = useState<
    categoryType.ISubCategory[] | null
  >(null);
  const [images, setImages] = useState<FileList | null>(null);

  //redux state
  const { data } = useGetAllCategoryQuery({});
  const categoryData: categoryType.ICategorySubcategory[] | undefined =
    data?.data;

  const dispatch = useDispatch();

  const form: UseFormReturn<z.infer<typeof productZodSchema.ProductSchema>> =
    useForm<z.infer<typeof productZodSchema.ProductSchema>>({
      resolver: zodResolver(productZodSchema.ProductSchema),
      defaultValues: {
        name: "",
        category: "",
        subcategory: "",

        stock: "",
        insideDhaka: "",
        outsideDhaka: "",
        priceVariation: [],
        order: "0",
        isActive: true,
      },
    });

  console.log(form.watch());

  const handleSubmit = async (
    value: z.infer<typeof productZodSchema.ProductSchema>
  ) => {
    try {
      // Make sure at least one price variation exists
      if (!value.priceVariation || value.priceVariation.length === 0) {
        form.setError("priceVariation", {
          type: "manual",
          message: "At least one price variation is required",
        });
        return;
      }

      // Check if each price variation has the required fields
      const isValid = value.priceVariation.every(
        (variation) =>
          variation.discountPrice &&
          variation.quantity &&
          variation.available !== undefined
      );

      if (!isValid) {
        form.setError("priceVariation", {
          type: "manual",
          message: "All price variation fields must be filled",
        });
        return;
      }

      const formData = new FormData();
      if (images && images.length > 0) {
        const imageArray = Array.from(images);

        imageArray.forEach((file) => {
          formData.append("images", file);
        });

        dispatch(creactProductData(value));
        setLocalImages(imageArray);
        setFormStep(formStep + 1);
        form.reset();
      } else {
        // If no images, show an error
        alert("Please select at least one image");
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    setImages(files);
  };

  return (
    <div className="max-w-[700px] w-full mx-auto">
      <Form {...form}>
        <form
          encType="multipart/form-data"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-5"
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Product Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-5">
            <FormField
              name="order"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Product Order"
                      {...field}
                    />
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
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Product Stock"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <FormField
              name="insideDhaka"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inside Dhaka</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Inside Dhaka Shipping Charge"
                      {...field}
                    />
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
                    <Input
                      type="number"
                      placeholder="Enter Outside Dhaka Shipping Charge"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
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
                        (item) => item._id === value
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
                      {data && categoryData ? (
                        categoryData?.map((item) =>
                          // Make sure item._id is never empty
                          item?._id ? (
                            <SelectItem key={item._id} value={item._id}>
                              {item.name}
                            </SelectItem>
                          ) : null
                        )
                      ) : (
                        // Use a non-empty placeholder value
                        <SelectItem value="no-categories" disabled>
                          No categories available
                        </SelectItem>
                      )}
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
                        <SelectValue placeholder="Select Subcategory" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subcategory && subcategory.length > 0 ? (
                        subcategory.map((item) =>
                          item?._id ? (
                            <SelectItem key={item._id} value={item._id}>
                              {item.name}
                            </SelectItem>
                          ) : null
                        )
                      ) : (
                        <SelectItem value="no-subcategories" disabled>
                          No subcategories available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <AddPriceVariation form={form} />
          <div className="">
            <FormLabel>Product Image</FormLabel>
            <Input
              required
              type="file"
              multiple
              onChange={handleChange}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              placeholder="Product Image(max 5)"
            />
          </div>

          <FormField
            name="isActive"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Product</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Toggle to show/hide this product from customers
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end">
            <Button type="submit">Next</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductInfoForm;
