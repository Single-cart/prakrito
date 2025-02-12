"use client";

import { byNowItem } from "@/redux/features/cart/cartSlice";
import { product } from "@workspace/shared/index";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const BuyNow = ({
  product,
  colors,
  size,
}: {
  product: product.IProductRes;
  colors: string;
  size: string;
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleClick = () => {
    if (!colors || !size) {
      toast.error("Please Select Size & Colors");
    } else if (product?.stock > 0) {
      dispatch(
        byNowItem({
          productName: product?.name,
          price: product?.discountPrice,
          quantity: 1,
          image: product?.images[0],
          product: product?._id,
          shippingPrice: product?.shipping,
          colors,
          size,
        })
      );

      router.push("/buynow");
    } else {
      toast.error("Product Out of stock");
    }
  };

  return (
    <Button
      variant={"outline"}
      onClick={handleClick}
      disabled={product?.stock <= 0}
    >
      Buy Now
    </Button>
  );
};

export default BuyNow;
