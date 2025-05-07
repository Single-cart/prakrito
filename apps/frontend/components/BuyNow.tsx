"use client";

import { byNowItem } from "@/redux/features/cart/cartSlice";
import { product } from "@workspace/shared/index";
import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import BuyNowCheckout from "./BuyNowCheckout";

interface BuyNowProps {
  product: product.IProductRes;
  priceVariationIndex: number;
  className?: string;
}

const BuyNow = ({
  product,
  priceVariationIndex,
  className = "",
}: BuyNowProps) => {
  const dispatch = useDispatch();

  const isAvailable =
    priceVariationIndex === 0
      ? (product.stock ?? 0) > 0
      : (product.priceVariation?.[priceVariationIndex - 1]?.available ?? false);

  const handleClick = () => {
    if (!isAvailable) {
      toast.error("Product Out of stock");
      return;
    }

    dispatch(
      byNowItem({
        product,
        priceVariationIndex,
      })
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          onClick={handleClick}
          disabled={!isAvailable}
          className={className}
        >
          Buy Now
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[90vh] mx-auto max-w-[700px] w-full overflow-y-auto rounded-t-2xl"
      >
        <BuyNowCheckout />
      </SheetContent>
    </Sheet>
  );
};

export default BuyNow;
