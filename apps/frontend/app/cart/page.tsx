/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { styles } from "@/app/styles";
import ComponentLoader from "@/components/ComponentLoader";
import {
  useGetCartItemQuery,
  useSyncCartMutation,
  useTotalPriceQuery,
} from "@/redux/features/cart/cartApi";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";
import { cn } from "@workspace/ui/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import { useAuth } from "@/hooks/useAuth";
import { env } from "@/lib/env";
import { deleteCartItem } from "@/redux/features/cart/cartSlice";
import { RootState } from "@/redux/store";
import { ArrowRight, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const CartPage = () => {
  const [syncCart, { error, isError }] = useSyncCartMutation();
  const { isLoading, isSuccess, refetch } = useGetCartItemQuery({});
  const { refetch: totalPriceRefetch } = useTotalPriceQuery({});
  const { user } = useAuth();
  const { allCartProducts } = useSelector((state: RootState) => state.cart);

  const router = useRouter();
  const dispatch = useDispatch();

  const [isLoadingFetch, setIsLoadingFetch] = useState(false);
  const [isMount, setIsMount] = useState(false);
  const [selectAll, setSelectAll] = useState<boolean>();
  const [toggleProduct, setToggleProduct] = useState<any[]>([]);
  const [calculatedTotals, setCalculatedTotals] = useState<{
    totalMainPrice: number;
    totalDiscountPrice: number;
  }>({ totalMainPrice: 0, totalDiscountPrice: 0 });

  //select all product
  const handleSelectAll = async (e: ChangeEvent<HTMLInputElement>) => {
    setIsLoadingFetch(true);
    setSelectAll(e.target.checked);
    setToggleProduct((prev) =>
      prev?.map((item) => ({ ...item, selected: e.target.checked }))
    );

    await syncCart({ isSelectAll: e.target.checked });
    setIsLoadingFetch(false);

    await refetch();
    await totalPriceRefetch();
  };

  //handle toggol product
  const handleSingleSelect = async (
    cartItemId: string,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setToggleProduct((prev) =>
      prev?.map((item) =>
        item?.cartItemId === cartItemId
          ? { ...item, selected: e.target.checked }
          : item
      )
    );

    const isAllSelected = toggleProduct.every((item) => item.selected);
    setSelectAll(isAllSelected);

    await syncCart({ isSelect: e.target.checked, cartItemId });
    await refetch();
    await totalPriceRefetch();
  };

  //update product quantity and update price
  const handleQuantityDecrement = async (
    cartItemId: string,
    quantity: number
  ) => {
    setIsLoadingFetch(true);
    await syncCart({ cartItemId, cartQuantity: quantity - 1 });
    setIsLoadingFetch(false);
    await refetch();
    await totalPriceRefetch();
  };
  const handleQuantityIncrement = async (
    cartItemId: string,
    quantity: number
  ) => {
    setIsLoadingFetch(true);
    await syncCart({ cartItemId, cartQuantity: quantity + 1 });
    setIsLoadingFetch(false);
    await refetch();
    await totalPriceRefetch();
  };

  //handle delete product from cart
  const handleDeleteProduct = async (cartItemId: string) => {
    setIsLoadingFetch(true);
    await syncCart({ cartItemId, deleteCartItem: "true" });
    dispatch(deleteCartItem({ cartItemId }));
    setIsLoadingFetch(false);
    await refetch();
    await totalPriceRefetch();
  };

  //handle proceed
  const handleProceed = async () => {
    const isOneSelect = toggleProduct.find((item) => item.selected === true);
    if (!isOneSelect) {
      toast.error("Select Atleast One Product");
    } else {
      router.push("/checkout");
    }
  };

  // Update price variation index
  const handlePriceVariationChange = async (cartId: string, value: string) => {
    try {
      setIsLoadingFetch(true);
      const priceVariationIndex = parseInt(value);

      if (isNaN(priceVariationIndex) || priceVariationIndex < 1) {
        toast.error("Invalid price variation selection");
        return;
      }

      const result = await syncCart({
        cartItemId: cartId,
        priceVariationIndex: priceVariationIndex,
      });

      if (result.data?.success) {
        toast.success("Product variation updated");
        await refetch();
        await totalPriceRefetch();
      } else {
        toast.error("Failed to update variation");
      }
    } catch (error: any) {
      console.error("Error updating price variation:", error);
      const errorMsg =
        error?.data?.message || "Failed to update product variation";
      toast.error(errorMsg);
    } finally {
      setIsLoadingFetch(false);
    }
  };

  //side effects
  useEffect(() => {
    const initialToggleProduct =
      allCartProducts?.cartItem?.map((item: any) => ({
        selected: item.selected,
        cartItemId: item._id,
      })) || [];
    setToggleProduct(initialToggleProduct);

    // Calculate the total price based on selected variations
    const calculateTotalPrice = () => {
      if (!allCartProducts?.cartItem?.length)
        return { totalMainPrice: 0, totalDiscountPrice: 0 };

      let totalMainPrice = 0;
      let totalDiscountPrice = 0;

      allCartProducts.cartItem.forEach((item) => {
        if (item.selected) {
          const priceVariation =
            item.product?.priceVariation?.[item.priceVariationIndex - 1];

          if (priceVariation) {
            const price = parseFloat(priceVariation.price) || 0;
            const discountPrice =
              parseFloat(priceVariation.discountPrice) || price;

            totalMainPrice += price * item.quantity;
            totalDiscountPrice += discountPrice * item.quantity;
          } else {
            totalMainPrice += item.price * item.quantity;
            totalDiscountPrice += item.discountPrice * item.quantity;
          }
        }
      });

      return { totalMainPrice, totalDiscountPrice };
    };

    // Set calculated totals to state
    setCalculatedTotals(calculateTotalPrice());
  }, [allCartProducts]);

  useEffect(() => {
    setSelectAll(allCartProducts?.selectAll);
  }, [allCartProducts?.selectAll]);

  useEffect(() => {
    if (isError) {
      const errorMessage = error as any;
      toast.error(errorMessage?.data?.message);
    }
  }, [error, isError]);

  //for handle hidretion errro
  useEffect(() => {
    setIsMount(true);
  }, []);

  if (!isMount) {
    return <ComponentLoader />;
  }

  // lg:mt-[180px] mt-[100px]
  return (
    <div>
      {isLoading || isLoadingFetch ? (
        <ComponentLoader />
      ) : (
        <div>
          {allCartProducts?.cartItem?.length > 0 ? (
            <div className={cn(styles.paddingX, "")}>
              <div className="lg:flex justify-between w-full mx-auto gap-6 md:p-4 p-0 block">
                <div className="w-full">
                  <div className="flex flex-col-reverse gap-6 md:flex-row items-center justify-between bg-primary-foreground md:p-4 py-3 px-2 shadow-sm">
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        name="all-item"
                        onChange={handleSelectAll}
                      />
                      <Label htmlFor="all-item">Select All</Label>
                    </div>
                    <h1>
                      {user?.fullName ? user.fullName : ""} - Your Total:{" "}
                      <span className="text-red-500 line-through">
                        TK. {calculatedTotals.totalMainPrice.toFixed(2)}
                      </span>{" "}
                      <span className="text-green-500 font-[500]">
                        TK. {calculatedTotals.totalDiscountPrice.toFixed(2)}
                      </span>
                    </h1>
                  </div>
                  <div className="mt-6 bg-primary-foreground shadow-sm">
                    {isSuccess &&
                      allCartProducts?.cartItem &&
                      allCartProducts?.cartItem?.map(
                        (product: any, index: number) => (
                          <div key={product.productId + index}>
                            <div
                              className={cn(
                                product.selected ? "bg-gray-100" : "",
                                " md:flex block justify-between items-center md:gap-10 md:mb-0 mb-6 md:p-4 py-4 px-2"
                              )}
                            >
                              <div className="basis-[50%] mb-6 md:mb-0 flex justify-start items-center gap-4">
                                <input
                                  name="items"
                                  type="checkbox"
                                  checked={
                                    toggleProduct?.find(
                                      (item) =>
                                        item?.cartItemId === product?._id
                                    )?.selected || false
                                  }
                                  onChange={(e) =>
                                    handleSingleSelect(product?._id, e)
                                  }
                                />
                                <div className="flex flex-grow justify-start gap-4">
                                  <div className="flex-shrink-0">
                                    <Image
                                      className="max-w-full max-h-full object-contain"
                                      src={
                                        product?.product?.images?.[0]
                                          ? `${env.NEXT_PUBLIC_SERVER_URL}/${product.product.images[0]}`
                                          : product?.product?.image?.[0]
                                            ? `${env.NEXT_PUBLIC_SERVER_URL}/${product.product.image[0]}`
                                            : "/natural.png"
                                      }
                                      alt={
                                        product?.product?.slug ||
                                        "Product image"
                                      }
                                      width={120}
                                      height={120}
                                      onError={(e) => {
                                        const target =
                                          e.target as HTMLImageElement;
                                        target.src = "/natural.png";
                                      }}
                                    />
                                  </div>
                                  <div className="space-y-4">
                                    <h1>
                                      <Link
                                        href={`/products/${product?.product?.slug}`}
                                      >
                                        {product?.product?.name}
                                      </Link>
                                    </h1>
                                    <Button
                                      onClick={() =>
                                        handleDeleteProduct(product?._id)
                                      }
                                      className="hover:bg-red-300"
                                      variant={"link"}
                                      size={"icon"}
                                    >
                                      <Trash2 size={15} />
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              <div className="basis-[50%] block md:flex md:justify-between md:gap-0 items-center justify-center gap-10">
                                <div className="flex flex-col gap-3">
                                  <Select
                                    onValueChange={(value) =>
                                      handlePriceVariationChange(
                                        product?._id,
                                        value
                                      )
                                    }
                                    defaultValue={
                                      product?.priceVariationIndex?.toString() ||
                                      "1"
                                    }
                                  >
                                    <SelectTrigger className="w-full md:min-w-[140px]">
                                      <SelectValue placeholder="Select Variation" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full md:min-w-[140px]">
                                      {/* Display available variations */}
                                      {product?.product?.priceVariation &&
                                        Array.isArray(
                                          product?.product?.priceVariation
                                        ) &&
                                        product?.product?.priceVariation.map(
                                          (variation: any, idx: number) => {
                                            const indexToUse = idx + 1; // 1-based index
                                            const isSelected =
                                              product?.priceVariationIndex ===
                                              indexToUse;
                                            const isAvailable =
                                              variation?.available === true;

                                            return (
                                              <SelectItem
                                                key={idx}
                                                value={indexToUse.toString()}
                                                disabled={!isAvailable}
                                              >
                                                {isSelected ? "✓ " : ""}
                                                {isAvailable
                                                  ? ""
                                                  : "[Out of Stock] "}
                                                Qty:{" "}
                                                {variation?.quantity || "N/A"} -
                                                ৳
                                                {variation?.discountPrice ||
                                                  variation?.price}
                                              </SelectItem>
                                            );
                                          }
                                        )}

                                      {/* Show message if no variations */}
                                      {(!product?.product?.priceVariation ||
                                        !Array.isArray(
                                          product?.product?.priceVariation
                                        ) ||
                                        product?.product?.priceVariation
                                          .length === 0) && (
                                        <SelectItem
                                          value={
                                            product?.priceVariationIndex?.toString() ||
                                            "1"
                                          }
                                        >
                                          No variations available
                                        </SelectItem>
                                      )}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="flex items-center justify-between md:pt-0 pt-6 gap-10">
                                  <div className="flex items-center justify-center">
                                    <button
                                      className={cn(
                                        product?.quantity <= 1
                                          ? "cursor-not-allowed"
                                          : "",
                                        "px-2 text-center font-semibold border-gray-300 border bg-gray-200"
                                      )}
                                      onClick={() =>
                                        handleQuantityDecrement(
                                          product?._id,
                                          product.quantity
                                        )
                                      }
                                      disabled={product?.quantity <= 1}
                                    >
                                      -
                                    </button>
                                    <input
                                      className="w-[35px] px-1 text-center border-gray-300 border outline-none"
                                      disabled
                                      value={product?.quantity}
                                      type="number"
                                      name="quantity"
                                    />
                                    <button
                                      className="px-2 text-center border-gray-300 border bg-gray-200"
                                      onClick={() =>
                                        handleQuantityIncrement(
                                          product?._id,
                                          product.quantity
                                        )
                                      }
                                    >
                                      +
                                    </button>
                                  </div>
                                  <div className="">
                                    <h1 className="font-semibold">
                                      {product?.product?.priceVariation &&
                                      product?.priceVariationIndex &&
                                      (product?.product?.priceVariation[
                                        product?.priceVariationIndex - 1
                                      ]?.discountPrice ??
                                        null)
                                        ? `${product?.product?.priceVariation[product?.priceVariationIndex - 1]?.discountPrice} TK.`
                                        : product?.discountPrice
                                          ? `${product?.discountPrice} TK.`
                                          : ""}
                                    </h1>
                                    <p className="line-through">
                                      {product?.product?.priceVariation &&
                                      product?.priceVariationIndex &&
                                      (product?.product?.priceVariation[
                                        product?.priceVariationIndex - 1
                                      ]?.price ??
                                        null)
                                        ? `${product?.product?.priceVariation[product?.priceVariationIndex - 1]?.price} TK.`
                                        : product?.price
                                          ? `${product?.price} TK.`
                                          : ""}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Separator />
                          </div>
                        )
                      )}
                  </div>

                  <div className="p-4 bg-primary-foreground flex items-end flex-col">
                    <Button
                      className="gap-2"
                      onClick={handleProceed}
                      disabled={toggleProduct?.length === 0}
                    >
                      Place Order <ArrowRight size={15} />{" "}
                    </Button>
                  </div>
                </div>

                <div className="basis-1/3 h-[230px] bg-primary-foreground p-4">
                  <div className="flex items-center gap-3 space-y-5">
                    <Image
                      className="mt-2"
                      src={"/cash-on-delivery.png"}
                      alt="cash on delivery"
                      height={25}
                      width={25}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/natural.png";
                      }}
                    />
                    <h1>Cash on Delivery Available</h1>
                  </div>
                  <div className="flex items-center gap-3 space-y-5">
                    <Image
                      className="mt-2"
                      src={"/replacement-policy.png"}
                      alt="replacement policy"
                      height={25}
                      width={25}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/natural.png";
                      }}
                    />
                    <h1>7 Days Replacement Policy</h1>
                  </div>
                  <div className="flex items-center gap-3 space-y-5">
                    <Image
                      className="mt-2"
                      src={"/authentic.png"}
                      alt="authentic"
                      height={25}
                      width={25}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/natural.png";
                      }}
                    />
                    <h1>100% Authentice</h1>
                  </div>
                  <div className="flex items-center gap-3 space-y-5">
                    <Image
                      className="mt-2"
                      src={"/image-processing.png"}
                      alt="image processing"
                      height={25}
                      width={25}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/natural.png";
                      }}
                    />
                    <h1>As shown in picture</h1>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-screen">
              <Image
                src={"/icon_empty_cart.png"}
                alt="empty cart"
                width={200}
                height={200}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/natural.png";
                }}
              />
              <h1 className="mt-6 mb-6 font-semibold text-2xl">
                Your Cart is Empty!
              </h1>
              <p>Looks like you haven&apos;t made order yet.</p>
              <Link href={"/"} className="font-semibold text-blue-500">
                Continue to Shopping
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartPage;
