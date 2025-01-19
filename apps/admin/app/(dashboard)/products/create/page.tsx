/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { useCreateProductMutation } from "@/redux/features/product/productApi";
import { resetProductData } from "@/redux/features/product/productSlice";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import ProductFormPreview from "../_components/ProductFormPreview";
import ProductFormStep from "../_components/ProductFormStep";
import ProductInfoForm from "../_components/ProductInfoForm";

import { LoadingButton } from "@/components/LoaderButton";
import { revalidateTag } from "next/cache";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
const ProductDescForm = dynamic(
  () => import("../_components/ProductDescForm"),
  { ssr: false }
);

const CreateProduct = () => {
  const [formStep, setFormStep] = useState(0);
  const [localImages, setLocalImages] = useState<File[]>([]);
  const dispatch = useDispatch();
  const router = useRouter();

  const { productCreateData } = useSelector((state: any) => state.product);
  const [createProduct, { isSuccess, error, isLoading }] =
    useCreateProductMutation({});

  const handleCreate = async () => {
    try {
      const formData = new FormData();

      // Append form data
      formData.append("name", productCreateData.name);
      formData.append("category", productCreateData.category);
      formData.append("subcategory", productCreateData.subcategory);
      formData.append("price", productCreateData.price);
      formData.append("discountPrice", productCreateData.discountPrice);
      formData.append("stock", productCreateData.stock);
      formData.append("shipping", productCreateData.shipping);
      formData.append("description", productCreateData.description);
      formData.append("colors", JSON.stringify(productCreateData.colors));
      formData.append("size", JSON.stringify(productCreateData.size));

      // Append images
      localImages.forEach((image) => {
        formData.append("images", image);
      });

      await createProduct({
        data: formData,
      });

      revalidateTag("getAllProducts");
    } catch (error) {
      // Handle errors
      console.error("Error creating product:", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Product Created successfull");
      setLocalImages([]);
      dispatch(resetProductData());
      setFormStep(0);
      router.push("/products");
    } else if (error) {
      const errorData = error as any;
      toast.error(errorData?.data?.message);
    }
  }, [dispatch, error, isSuccess, router]);

  return (
    <div className="p-4">
      <div className="">
        <h1 className="font-semibold text-2xl mb-4">Create Product</h1>

        <Card>
          <CardHeader>
            <CardTitle>
              <ProductFormStep formStep={formStep} setFormStep={setFormStep} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {formStep === 0 && (
              <ProductInfoForm
                setLocalImages={setLocalImages}
                formStep={formStep}
                setFormStep={setFormStep}
              />
            )}

            {formStep === 1 && (
              <ProductDescForm formStep={formStep} setFormStep={setFormStep} />
            )}

            {formStep === 2 && <ProductFormPreview localImages={localImages} />}

            <div className="my-10">
              {formStep === 2 &&
                (isLoading ? (
                  <LoadingButton />
                ) : (
                  <Button className="" onClick={handleCreate}>
                    Create Product
                  </Button>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateProduct;
