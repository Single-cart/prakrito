"use client";

import { env } from "@/lib/env";
import { product } from "@workspace/shared/index";
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { CartDialog } from "./CartDialog";
import Ratings from "./Ratings";

type Props = {
  product: product.IProductRes;
};

const ProductCard = ({ product }: Props) => {
  const { name, images, ratings, stock, price, discountPrice, numOfReviews } =
    product;
  const discountParsentage = ((price - parseInt(discountPrice!)) / price) * 100;
  const porductImg = `${env.NEXT_PUBLIC_SERVER_URL}/${images[0]}`;

  return (
    <div className="max-w-[250px] w-full h-auto sm:h-[420px] bg-primary-foreground md:p-4 p-1 group shadow-sm hover:shadow-md flex flex-col justify-between rounded-lg">
      <div className="max-w-[250px] h-auto group-hover:scale-105 transition duration-300">
        <Link href={`/products/${product.slug}`}>
          <Image src={porductImg} alt={name} width={250} height={100} />
        </Link>
      </div>

      <div className="">
        <h1 className="text-sm md:text-[16px] font-semibold leading-5 lg:leading-6 mt-2 hover:text-[#000000a6] transition-all">
          <Link href={`/products/${product.slug}`}>
            {name?.length > 45 ? <span>{name.substring(0, 30)}...</span> : name}
          </Link>
        </h1>
        <div className="flex items-center justify-center gap-1">
          <Ratings
            size="15px"
            space="0px"
            numOfRating={Math.floor(ratings!)}
            ratingId={`product-${product.slug}`}
          />
          <span>({numOfReviews})</span>
        </div>
        <h2
          className={cn(stock > 0 ? "text-green-500" : "text-rose-500", "my-1")}
        >
          {stock > 0 ? "In Stock" : "Out Of Stock"}
        </h2>
        <h3 className="font-semibold text-sm lg:font-bold mb-2">
          TK. {discountPrice} ({discountParsentage.toFixed()}% Off)
        </h3>
      </div>

      <CartDialog btnFull="w-full" product={product} />
    </div>
  );
};

export default ProductCard;
