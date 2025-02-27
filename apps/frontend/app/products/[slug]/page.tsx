import { styles } from "@/app/styles";
import Cart from "@/components/Cart";
import ColorsAndSize from "@/components/ColorsAndSize";
import ProductDesc from "@/components/ProductDesc";
import ProductCarousel from "@/components/ProductSlider";
import Ratings from "@/components/Ratings";
import RelatedProduct from "@/components/RelatedProduct";
import Reviews from "@/components/Reviews";
import { Separator } from "@workspace/ui/components/separator";

import { singleProduct } from "@/lib/fetch/getProduct";
import { cn } from "@workspace/ui/lib/utils";
import { RefreshCcw, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

type Props = {
  params: Promise<{ slug: string }>;
};

const Page: FC<Props> = async ({ params }) => {
  const { slug } = await params;
  const product = await singleProduct(slug);
  const productInfo = product?.data?.product;

  return (
    <div className={cn(styles.paddingX, "")}>
      {/* <ClientAnalytics
        event="product_view"
        pageData={{
          title: productInfo?.name,
          type: "product",
        }}
        productData={{
          name: productInfo?.name,
          id: productInfo?._id,
          price: productInfo?.discountPrice,
          brand: productInfo?.description?.brand,
          category: productInfo?.subcategory?.name,
          variant: productInfo?.description?.colors,
        }}
      /> */}
      <div className="fixed top-[90%] z-40 right-5 lg:hidden">
        <Cart />
      </div>
      <div className="flex lg:flex-row flex-col justify-between gap-6 lg:px-6 px-0">
        <div className="bg-primary-foreground w-full flex md:flex-row flex-col justify-center">
          <div className="flex-1 md:p-4 p-1">
            <ProductCarousel images={productInfo?.images} />
          </div>
          <div className="flex-1 md:p-4 p-1 space-y-2">
            <h1 className="font-[500] md:text-2xl text-xl">
              {productInfo?.name}
            </h1>
            <div className="">
              {/* Use a key to ensure consistent rendering */}
              <Ratings
                numOfRating={Math.ceil(productInfo?.ratings) || 0}
                size="20px"
                space="2px"
              />
              <span> | {productInfo?.numOfReviews || 0} Reviews</span>
            </div>
            <h1 className="text-xl font-semibold space-x-2">
              <span className="line-through">TK. {productInfo?.price}</span>
              <span>TK. {productInfo?.discountPrice}</span>
            </h1>
            <h1>
              <span className="font-[500]">Category:</span>{" "}
              <Link
                className="text-blue-400"
                href={`/products/?subcategory=${productInfo?.subcategory?._id}`}
              >
                {productInfo?.subcategory?.name}
              </Link>
            </h1>

            <div className="space-y-2">
              {productInfo?.stock > 0 ? (
                <div className="flex items-center gap-2 font-[500] text-lg">
                  <Image
                    src={"/order-success.png"}
                    width={15}
                    height={15}
                    alt="in stock"
                  />
                  <span>In Stock</span>
                </div>
              ) : (
                <div className="flex items-center font-[500] text-lg text-red-500">
                  <X /> <span>Out Of Stock</span>
                </div>
              )}
            </div>
            <ColorsAndSize product={productInfo} />

            <div className="text-xs space-y-2 pt-3">
              <h2 className="flex items-center gap-2">
                <RefreshCcw /> <span>7 Days Replacement Policy</span>
              </h2>
              <h2 className=" flex items-center gap-2">
                <Image
                  src={"/cash-on-delivery.png"}
                  alt="cash on delivery"
                  width={20}
                  height={20}
                />{" "}
                <span>Cash on Delivery Available</span>
              </h2>
            </div>
          </div>
        </div>
        <div className="bg-primary-foreground basis-1/3 md:p-4 p-1">
          <RelatedProduct product={product?.data?.relatedProducts} />
        </div>
      </div>

      <div className="bg-primary-foreground my-4 lg:mx-6 mx-0 py-4">
        <h1 className="text-2xl font-semibold px-4">Description</h1>
        <Separator className="my-5" />
        {/* Description */}
        <div className="px-4">
          <ProductDesc productDesc={productInfo?.description} />
        </div>
      </div>

      <div className="bg-primary-foreground my-4 lg:mx-6 mx-0 py-4">
        <Reviews
          name={productInfo?.name}
          image={productInfo?.images[0]}
          productId={productInfo?._id}
          productRatings={productInfo?.ratings}
          numOfReviews={productInfo?.numOfReviews}
        />
      </div>
    </div>
  );
};

export default Page;
