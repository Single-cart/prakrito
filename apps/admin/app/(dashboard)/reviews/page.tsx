import CreateReviews from "@/components/CreateReviews";
import ReviewDeleteBtn from "@/components/ReviewDeleteBtn";
import { getAllCustomerReviews } from "@/lib/fetch/customer-review.data";
import { getImgUrl } from "@/lib/getImgPath";
import { Card } from "@workspace/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { ZoomIn } from "lucide-react";
import Image from "next/image";

type IReviews = {
  _id: string;
  image: string;
};

const Page = async () => {
  const data = await getAllCustomerReviews();

  return (
    <div className="p-6 space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight mb-4">
          Create Reviews
        </h1>
        <CreateReviews />
      </section>

      <section>
        <h1 className="text-3xl font-bold tracking-tight mb-4">
          All Customer Reviews
        </h1>
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {data?.data &&
            data?.data?.customerReview?.map((item: IReviews) => (
              <div key={item._id} className="relative break-inside-avoid mb-4">
                <div className="absolute top-2 right-2 z-20">
                  <ReviewDeleteBtn id={item._id} />
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="group relative overflow-hidden rounded-lg cursor-pointer transform hover:scale-[1.02] transition-all">
                      <div className="relative">
                        <Image
                          src={getImgUrl(item.image)}
                          alt="Customer reviews"
                          width={500}
                          height={300}
                          className="w-full h-auto object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ZoomIn className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <div className="relative w-full aspect-[3/2]">
                      <Image
                        src={getImgUrl(item.image)}
                        alt="Customer reviews"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default Page;
