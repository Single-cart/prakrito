"use client";

import { useState } from "react";

import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";

import { product } from "@workspace/shared/index";
import { cn } from "@workspace/ui/lib/utils";
import BuyNow from "./BuyNow";
import { CartDialog } from "./CartDialog";

const ColorsAndSize = ({ product }: { product: product.IProductRes }) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColors, setSelectedColors] = useState("");

  const availableColors = product?.colors?.filter(
    (color) => color?.stock === true
  );
  const availableSize = product?.size?.filter(
    (item) => item?.available === true
  );

  return (
    <div className="">
      <div className="border border-dashed p-4 space-y-4">
        <div className="">
          <h1 className="pb-2 text-sm font-semibold font-sans">
            Select Colors :{" "}
          </h1>
          <div className="flex items-center flex-wrap gap-2 md:gap-3 mb-5">
            {availableColors &&
              availableColors?.map((color, index: number) => (
                <Button
                  onClick={() => setSelectedColors(color?.name?.toString())}
                  variant={"outline"}
                  size={"sm"}
                  className={cn(
                    selectedColors == color?.name ? "bg-green-300" : ""
                  )}
                  key={index + "dd"}
                >
                  {color?.name}
                </Button>
              ))}
          </div>
        </div>
        <Separator />
        <div className="">
          <h1 className="pb-2 text-sm font-semibold font-sans">
            Select Size :{" "}
          </h1>
          <div className="flex items-center flex-wrap gap-2 md:gap-3 mb-5">
            {availableSize &&
              availableSize?.map((size, index: number) => (
                <Button
                  onClick={() => setSelectedSize(size.name?.toString())}
                  variant={"outline"}
                  size={"sm"}
                  className={cn(
                    selectedSize == size?.name ? "bg-green-300" : ""
                  )}
                  key={index + "ss"}
                >
                  {size?.name}
                </Button>
              ))}
          </div>
        </div>
      </div>
      <div className="gap-4 flex flex-col pt-5">
        <CartDialog product={product} btnFull="w-full" />

        <BuyNow colors={selectedColors} size={selectedSize} product={product} />
      </div>
    </div>
  );
};

export default ColorsAndSize;
