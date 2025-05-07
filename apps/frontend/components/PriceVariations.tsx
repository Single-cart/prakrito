/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";

import { Button } from "@workspace/ui/components/button";

import { product } from "@workspace/shared/index";
import { cn } from "@workspace/ui/lib/utils";
import AddToCart from "./AddToCart";
import BuyNow from "./BuyNow";

const PriceVariations = ({ product }: { product: product.IProductRes }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [priceVariation, setPriceVariant] = useState<any>();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(1);

  const availablePriceVariation = product?.priceVariation?.filter(
    (item) => item?.available === true
  );

  useEffect(() => {
    if (availablePriceVariation && availablePriceVariation.length > 0) {
      setPriceVariant(availablePriceVariation[0]);
      // Set initial selected variant index
      const index =
        product?.priceVariation?.findIndex(
          (p) => p.price === availablePriceVariation[0]?.price
        ) ?? -1;
      setSelectedVariantIndex(index !== -1 ? index + 1 : 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleVariantSelection = (variant: any, index: number) => {
    setPriceVariant(variant);
    const variantIndex =
      product?.priceVariation?.findIndex((p) => p.price === variant.price) ??
      -1;
    setSelectedVariantIndex(variantIndex !== -1 ? variantIndex + 1 : 1);
  };

  return (
    <div className="space-y-4">
      <div className="">
        {priceVariation?.discountPrice ? (
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">
              TK. {priceVariation?.discountPrice}
            </span>
            <span className="text-sm line-through text-muted-foreground">
              {priceVariation?.price && `TK.${priceVariation?.price}`}
            </span>
            {priceVariation?.price && priceVariation?.discountPrice && (
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                {Math.round(
                  ((Number(priceVariation.price) -
                    Number(priceVariation.discountPrice)) /
                    Number(priceVariation.price)) *
                    100
                )}
                % OFF
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {availablePriceVariation &&
            availablePriceVariation[0]?.discountPrice ? (
              <>
                <span className="text-xl font-bold text-primary">
                  TK. {availablePriceVariation[0]?.discountPrice}
                </span>
                <span className="text-sm line-through text-muted-foreground">
                  TK. {availablePriceVariation[0]?.price}
                </span>
                {availablePriceVariation[0]?.price &&
                  availablePriceVariation[0]?.discountPrice && (
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {Math.round(
                        ((Number(availablePriceVariation[0].price) -
                          Number(availablePriceVariation[0].discountPrice)) /
                          Number(availablePriceVariation[0].price)) *
                          100
                      )}
                      % OFF
                    </span>
                  )}
              </>
            ) : (
              <span className="text-xl font-bold text-primary">
                TK.{" "}
                {availablePriceVariation && availablePriceVariation[0]?.price}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="border border-dashed rounded-lg p-5 space-y-4 bg-card">
        <div className="">
          <h1 className="pb-2 font-semibold font-sans text-card-foreground flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full"></span>{" "}
            Select Quantity
          </h1>
          <div className="flex items-center flex-wrap gap-2 md:gap-3 mb-5">
            {availablePriceVariation &&
              availablePriceVariation?.map((prices, index: number) => (
                <Button
                  onClick={() => handleVariantSelection(prices, index)}
                  variant={
                    priceVariation?.price == prices?.price
                      ? "default"
                      : "outline"
                  }
                  size={"sm"}
                  className={cn(
                    "rounded-full transition-all duration-200",
                    priceVariation?.price == prices?.price
                      ? "bg-primary text-primary-foreground shadow-md transform scale-105"
                      : "hover:bg-primary/10"
                  )}
                  key={index + "dd"}
                >
                  {prices?.quantity}
                </Button>
              ))}
          </div>
        </div>
      </div>
      <div className="gap-3 flex flex-col pt-3">
        <AddToCart
          product={product}
          btnFull="w-full"
          className="w-full"
          variant="default"
        />

        <BuyNow product={product} priceVariationIndex={selectedVariantIndex} />
      </div>
    </div>
  );
};

export default PriceVariations;
