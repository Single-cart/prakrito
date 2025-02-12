"use client";

import { env } from "@/lib/env";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ProductCarousel = ({ images }: { images: [] }) => {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <Carousel
        showArrows={true}
        autoFocus
        autoPlay
        showThumbs={true}
        stopOnHover
        verticalSwipe="standard"
        infiniteLoop
        thumbWidth={65}
        renderThumbs={(children) => children}
      >
        {images?.map((item, index) => (
          <div className="" key={index}>
            <Image
              src={`${env.NEXT_PUBLIC_SERVER_URL}/${item}`}
              alt="product images"
              width={400}
              height={400}
              priority={index === 0}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ProductCarousel;
