"use client";

import { FC, useEffect } from "react";
import toast from "react-hot-toast";

import { AlertPopup } from "@/components/AlertPopup";
import { useDeleteProductMutation } from "@/redux/features/product/productApi";
import type { product } from "@workspace/shared/index";
import { Button } from "@workspace/ui/components/button";
import { FilePenLine, Trash } from "lucide-react";
import { revalidateTag } from "next/cache";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  product: product.IProduct;
};

const ProductAction: FC<Props> = ({ product }) => {
  const router = useRouter();

  const [deleteProduct, { isLoading, isSuccess, error }] =
    useDeleteProductMutation();

  const handleDeleteProduct = async () => {
    const productId = product?._id;

    try {
      await deleteProduct({ productId });
      revalidateTag("getAllProducts");
      router.refresh();
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Product deleted successfull");
    } else if (error) {
      console.log(error);
      toast.error("Somthing is wrong. try again");
    }
  }, [error, isSuccess]);

  return (
    <div className="flex items-center gap-5">
      <div className="">
        <Link href={`/products/${product?.slug}`}>
          <Button size={"icon"}>
            <FilePenLine />
          </Button>
        </Link>
      </div>
      <div className="">
        <AlertPopup actionFunc={handleDeleteProduct}>
          <Button disabled={isLoading} size={"icon"} className="bg-red-400">
            <Trash className="" />
          </Button>
        </AlertPopup>
      </div>
    </div>
  );
};

export default ProductAction;
