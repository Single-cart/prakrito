/* eslint-disable @typescript-eslint/no-explicit-any */
import { styles } from "@/app/styles";
import { env } from "@/lib/env";
import { getAllCustomerReviews } from "@/lib/fetch/customerReview";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel";
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";

const CustomerReview = async () => {
  const data = await getAllCustomerReviews();

  return (
    <div className="">
      {data?.data?.customerReview && data?.data?.customerReview?.length > 0 && (
        <div className="">
          <h1 className={cn(styles.headingText, "text-center")}>Highlights</h1>
          <div className="flex flex-col items-center justify-center mt-5">
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full max-w-[680px]"
            >
              <CarouselContent>
                {data?.data?.customerReview?.map((item: any) => (
                  <CarouselItem key={item?.image} className="md:basis-1/2">
                    <div className="p-1">
                      <Image
                        className="w-[340px] mx-auto"
                        src={`${env.NEXT_PUBLIC_SERVER_URL}/${item.image}`}
                        alt="customer review"
                        height={200}
                        width={340}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="md:flex hidden" />
              <CarouselNext className="md:flex hidden" />
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerReview;
