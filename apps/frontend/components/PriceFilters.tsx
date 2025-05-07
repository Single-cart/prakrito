"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Separator } from "@workspace/ui/components/separator";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const PriceFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice"));
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice"));
  const params = new URLSearchParams(searchParams);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      return params.toString();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams, minPrice]
  );

  const handleQuery = () => {
    if (minPrice) {
      router.push(`/products?${createQueryString("minPrice", minPrice)}`);
    }
    if (maxPrice) {
      router.push(`/products?${createQueryString("maxPrice", maxPrice)}`);
    }
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <h1 className="font-medium text-lg mb-2 text-primary">Price</h1>
      <Separator className="mb-3 bg-gray-200" />

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            name="minPrice"
            placeholder="Min"
            type="number"
            onChange={(e) => setMinPrice(e.target.value)}
            value={minPrice?.toString()}
            className="border-gray-300 focus-visible:ring-primary"
          />
        </div>

        <span className="text-gray-500">to</span>

        <div className="relative flex-1">
          <Input
            name="maxPrice"
            placeholder="Max"
            type="number"
            onChange={(e) => setMaxPrice(e.target.value)}
            value={maxPrice?.toString()}
            className="border-gray-300 focus-visible:ring-primary"
          />
        </div>

        <Button
          onClick={handleQuery}
          size="sm"
          className="bg-primary hover:bg-primary/90 transition-colors"
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default PriceFilters;
