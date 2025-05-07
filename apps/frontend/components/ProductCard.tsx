"use client";

import { env } from "@/lib/env";
import { product } from "@workspace/shared/index";
import Image from "next/image";
import Link from "next/link";
import AddToCart from "./AddToCart";
import Ratings from "./Ratings";

type Props = {
  product: product.IProductRes;
};

const ProductCard = ({ product }: Props) => {
  const { name, images, ratings, stock, priceVariation, numOfReviews } =
    product;

  const stockFilters = priceVariation?.filter(
    (items) => items.available === true
  );
  const fristPrice = stockFilters && stockFilters[0]?.price;
  const fristDiscountPrice = stockFilters && stockFilters[0]?.discountPrice;
  const discountParsentage =
    fristPrice && fristDiscountPrice
      ? ((parseInt(fristPrice) - parseInt(fristDiscountPrice)) /
          parseInt(fristPrice)) *
        100
      : 0;

  const porductImg = `${env.NEXT_PUBLIC_SERVER_URL}/${images[0]}`;

  return (
    <div className="max-w-[220px]  w-full bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group overflow-hidden border border-gray-100">
      {/* Product Image with Discount Badge */}
      <div className="relative h-[200px] overflow-hidden bg-gray-50 flex items-center justify-center">
        {discountParsentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            {discountParsentage.toFixed()}% OFF
          </div>
        )}
        {stock <= 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span className="text-white font-semibold px-3 py-1 bg-red-500 rounded-md">
              Out of Stock
            </span>
          </div>
        )}
        <Link
          href={`/products/${product.slug}`}
          className="flex items-center justify-center w-full h-full p-2"
        >
          <Image
            src={porductImg}
            alt={name}
            width={250}
            height={180}
            className="max-h-full w-auto object-contain group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
      </div>

      {/* Product Details */}
      <div className="p-2 flex flex-col gap-1">
        <Link href={`/products/${product.slug}`} className="hover:text-primary">
          <h3 className="font-medium font-noto text-sm md:text-base truncate whitespace-nowrap overflow-hidden">
            {name}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Ratings
              size="16px"
              space="0px"
              numOfRating={Math.floor(ratings!)}
              ratingId={`product-${product.slug}`}
            />
            <span className="text-xs text-gray-500 ml-1">({numOfReviews})</span>
          </div>
          {stock > 0 && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full hidden sm:block">
              In Stock
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-primary">
            ৳{fristDiscountPrice}
          </span>
          {discountParsentage > 0 && (
            <span className="text-xs text-gray-400 line-through">
              ৳{fristPrice}
            </span>
          )}
        </div>

        {/* Direct Add to Cart Button */}
        <AddToCart product={product} className="w-full" btnFull="w-full" />
      </div>
    </div>
  );
};

export default ProductCard;
