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
import AddColorsSize from "../_components/AddColorsSize";

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
        price: "",
        discountPrice: "",
        stock: "",
        shipping: "",
        colors: [],
        size: [],
      },
    });

  const handleSubmit = async (
    value: z.infer<typeof productZodSchema.ProductSchema>
  ) => {
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

          <FormField
            name="price"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter Product Price"
                    {...field}
                  />
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
                  <Input
                    type="number"
                    placeholder="Enter Product Discount Price"
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

          <FormField
            name="shipping"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipping Charge</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter Shipping Charge"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <AddColorsSize form={form} />
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

          <div className="flex items-center justify-end">
            <Button type="submit">Next</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductInfoForm;
