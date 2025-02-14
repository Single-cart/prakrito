"use client";

import { env } from "@/lib/env";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@workspace/ui/components/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

interface Props {
  banner: {
    _id: string;
    bannerType: string;
    category?: string;
    desktopImage: string;
    mobileImage: string;
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
      >
        <CarouselContent>
          {banner?.map((item) => (
            <CarouselItem key={item._id}>
              {/* Mobile Image */}
              <div className="relative aspect-[3/2] md:hidden w-full h-[320px]">
                <Image
                  src={`${env.NEXT_PUBLIC_SERVER_URL}/${item.mobileImage}`}
                  alt="Banner image"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw"
                  className="rounded-lg"
                  quality={90}
                />
              </div>

              {/* Desktop Image */}
              <div className="relative hidden md:block w-full h-[320px]">
                <Image
                  src={`${env.NEXT_PUBLIC_SERVER_URL}/${item.desktopImage}`}
                  alt="Banner image"
                  fill
                  priority
                  sizes="(min-width: 768px) 100vw"
                  className="rounded-lg"
                  quality={90}
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
