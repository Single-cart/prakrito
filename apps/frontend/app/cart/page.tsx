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
  const { allCartProducts, totalPrice } = useSelector(
    (state: RootState) => state.cart
  );

  console.log(allCartProducts);

  const totalPriceData = totalPrice as any;

  const router = useRouter();
  const dispatch = useDispatch();

  const [isLoadingFetch, setIsLoadingFetch] = useState(false);
  const [isMount, setIsMount] = useState(false);
  const [selectAll, setSelectAll] = useState<boolean>();
  const [toggleProduct, setToggleProduct] = useState<any[]>([]);

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

  //size change
  const handleSizeChange = async (cartId: string, value: string) => {
    setIsLoadingFetch(true);
    await syncCart({ cartItemId: cartId, size: value });
    await refetch();
    setIsLoadingFetch(false);
  };

  //colors change
  const handleColorsChange = async (cartId: string, value: string) => {
    setIsLoadingFetch(true);
    await syncCart({ cartItemId: cartId, colors: value });
    await refetch();
    setIsLoadingFetch(false);
  };

  //side effects

  useEffect(() => {
    const initialToggleProduct =
      allCartProducts?.cartItem?.map((item: any) => ({
        selected: item.selected,
        cartItemId: item._id,
      })) || [];
    setToggleProduct(initialToggleProduct);
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
                        TK. {totalPriceData?.totalMainPrice}
                      </span>{" "}
                      <span className="text-green-500 font-[500]">
                        TK. {totalPriceData?.totalDiscountPrice}
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
                                      src={`${env.NEXT_PUBLIC_SERVER_URL}/${product?.product?.image}`}
                                      alt={product?.product?.slug}
                                      width={120}
                                      height={120}
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
                                      handleSizeChange(product?._id, value)
                                    }
                                    defaultValue={product?.size}
                                  >
                                    <SelectTrigger className="w-full md:min-w-[140px]">
                                      <SelectValue placeholder="Select Size" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full md:min-w-[140px]">
                                      {product?.product?.size
                                        ?.filter(
                                          (item: any) =>
                                            item?.available === true
                                        )
                                        .map(
                                          (filterItem: any, index: number) => (
                                            <SelectItem
                                              key={index}
                                              value={filterItem?.name}
                                            >
                                              {filterItem?.name}
                                            </SelectItem>
                                          )
                                        )}
                                    </SelectContent>
                                  </Select>

                                  <Select
                                    onValueChange={(value) =>
                                      handleColorsChange(product?._id, value)
                                    }
                                    defaultValue={product?.colors}
                                  >
                                    <SelectTrigger className="w-full md:min-w-[140px]">
                                      <SelectValue placeholder="Select Color" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full md:min-w-[140px]">
                                      {product?.product?.colors
                                        ?.filter(
                                          (item: any) => item?.stock === true
                                        )
                                        .map(
                                          (filterItem: any, index: number) => (
                                            <SelectItem
                                              key={index}
                                              value={filterItem?.name}
                                            >
                                              {filterItem?.name}
                                            </SelectItem>
                                          )
                                        )}
                                    </SelectContent>
                                  </Select>

                                  {/* <select onChange={(e) => handleSizeChange(product?._id, e)} name="size" id="size" aria-placeholder="select size" className="">
                                    <option defaultValue={product?.size} value="">Size: <span className="font-bold text-green-300">{product?.size}</span></option>
                                    {product?.product?.size
                                      ?.filter((item: any) => item?.available === true).map((filterItem: any, index: number) => (
                                        <option key={index} value={filterItem?.name}>
                                          {filterItem?.name}
                                        </option>
                                      ))}
                                  </select>

                                  <select onChange={(e) => handleColorsChange(product?._id, e)} name="colors" id="colors" aria-placeholder="select colors" className="">
                                    <option defaultValue={product?.colors} value="">Colors: <span className="font-bold text-green-300">{product?.colors}</span></option>
                                    {product?.product?.colors
                                      ?.filter((item: any) => item?.stock === true).map((filterItem: any, index: number) => (
                                        <option key={index} value={filterItem?.name}>
                                          {filterItem?.name}
                                        </option>
                                      ))}
                                  </select> */}
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
                                      {product?.discountPrice} TK.
                                    </h1>
                                    <p className="line-through">
                                      {product?.price} TK.
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
                      alt="cash on deliviery"
                      height={25}
                      width={25}
                    />
                    <h1>Cash on Delivery Available</h1>
                  </div>
                  <div className="flex items-center gap-3 space-y-5">
                    <Image
                      className="mt-2"
                      src={"/replacement-policy.png"}
                      alt="cash on deliviery"
                      height={25}
                      width={25}
                    />
                    <h1>7 Days Replacement Policy</h1>
                  </div>
                  <div className="flex items-center gap-3 space-y-5">
                    <Image
                      className="mt-2"
                      src={"/authentic.png"}
                      alt="cash on deliviery"
                      height={25}
                      width={25}
                    />
                    <h1>100% Authentice</h1>
                  </div>
                  <div className="flex items-center gap-3 space-y-5">
                    <Image
                      className="mt-2"
                      src={"/image-processing.png"}
                      alt="cash on deliviery"
                      height={25}
                      width={25}
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
