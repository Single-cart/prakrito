"use client";

import { Separator } from "@workspace/ui/components/separator";
import { cn } from "@workspace/ui/lib/utils";
import { Star } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const RatingsFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeRating = searchParams.get("ratings");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleClick = (rating: number) => {
    const star = rating.toString();
    router.push(`/products?${createQueryString("ratings", star)}`);
  };

  const ratingOptions = [
    { value: 5, label: "5 Stars & Above" },
    { value: 4, label: "4 Stars & Above" },
    { value: 3, label: "3 Stars & Above" },
    { value: 2, label: "2 Stars & Above" },
    { value: 1, label: "1 Star & Above" },
  ];

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-lg mb-2 text-primary-foreground">
        Rating
      </h3>
      <Separator className="mb-3 bg-gray-200" />

      <div className="flex flex-col space-y-1">
        {ratingOptions.map((option) => {
          const isActive = activeRating === option.value.toString();

          return (
            <div
              key={`rating-${option.value}`}
              onClick={() => handleClick(option.value)}
              className={cn(
                "flex items-center py-2 px-2 rounded-md transition-all duration-200 cursor-pointer group",
                isActive ? "bg-primary/10" : "hover:bg-gray-100"
              )}
            >
              <div className="flex mr-2">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={`star-${option.value}-${index}`}
                    size={16}
                    className={cn(
                      "transition-colors",
                      index < option.value
                        ? isActive
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 group-hover:text-gray-400"
                    )}
                  />
                ))}
              </div>
              <span
                className={cn(
                  "text-sm transition-colors",
                  isActive ? "text-primary font-medium" : "text-gray-700"
                )}
              >
                {option.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RatingsFilters;
