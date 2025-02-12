"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@workspace/ui/components/carousel";

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

import { env } from "@/lib/env";

interface Props {
  banner: {
    _id: string;
    bannerType: string;
    category?: string;
    image: string;
  }[];
}

const BannerSlider = ({ banner }: Props) => {
  return (
    <div className="bg-primary-foreground rounded-lg">
      <Carousel
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
        className=""
      >
        <CarouselContent className="max-h-[320px] h-full">
          {banner?.map((item) => (
            <CarouselItem key={item._id}>
              <div className="rounded-lg w-full h-full">
                <Image
                  src={`${env.NEXT_PUBLIC_SERVER_URL}/${item.image}`}
                  alt="avater"
                  height={320}
                  width={2000}
                  className="h-full"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default BannerSlider;
