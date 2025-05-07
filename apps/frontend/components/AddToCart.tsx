import {
  useAddToCartMutation,
  useGetCartItemQuery,
  useTotalPriceQuery,
} from "@/redux/features/cart/cartApi";
import { product } from "@workspace/shared/index";
import { Button } from "@workspace/ui/components/button";
import { ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { customEvent } from "./gtm/customEvent";
import { LoadingButton } from "./LoaderButton";

interface AddToCartProps {
  product: product.IProductRes;
  priceVariationIndex?: number;
  className?: string;
  btnFull?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

const AddToCart = ({
  product,
  priceVariationIndex = 1,
  className = "",
  btnFull = "",
  size = "sm",
  variant = "default",
}: AddToCartProps) => {
  const { refetch } = useGetCartItemQuery({});
  const { refetch: totalPriceRefetch } = useTotalPriceQuery({});
  const [addToCart, { isLoading, isSuccess, error, isError }] =
    useAddToCartMutation();

  const isAvailable =
    priceVariationIndex === 0
      ? (product.stock ?? 0) > 0
      : (product.priceVariation?.[priceVariationIndex - 1]?.available ?? false);

  const handleAddToCart = async () => {
    if (!isAvailable) {
      toast.error("Product Out of stock");
      return;
    }

    try {
      await addToCart({
        productId: product._id,
        priceVariationIndex,
      }).unwrap();

      const stockFilters = product.priceVariation?.filter(
        (items) => items.available === true
      );
      const firstDiscountPrice = stockFilters && stockFilters[0]?.discountPrice;

      customEvent({
        event: "add_to_cart",
        ecommerce: {
          currencyCode: "BDT",
          value: firstDiscountPrice,
          product: product,
        },
      });

      await refetch();
      await totalPriceRefetch();
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Product Add To Cart");
    } else if (isError) {
      const errorData = error as { data: { message: string } };
      toast.error(errorData?.data?.message);
    }
  }, [error, isError, isSuccess]);

  return (
    <div className={className}>
      {isLoading ? (
        <LoadingButton className={btnFull} />
      ) : (
        <Button
          disabled={!isAvailable}
          onClick={handleAddToCart}
          className={`hover:bg-primary/90 bg-primary text-white transition-all flex items-center justify-center gap-2 ${btnFull}`}
          size={size}
          variant={variant}
        >
          <ShoppingCart size={16} />
          <span>Add To Cart</span>
        </Button>
      )}
    </div>
  );
};

export default AddToCart;
