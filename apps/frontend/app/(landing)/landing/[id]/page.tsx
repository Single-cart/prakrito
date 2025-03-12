import LandingCheckout from "@/components/LandingCheckout";
import ProductDesc from "@/components/ProductDesc";
import { getSingleLanding } from "@/lib/fetch/landing.data";
import { getImgUrl } from "@/lib/getImgPath";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { Check, Clock, Phone, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

const Page: FC<Props> = async ({ params }) => {
  const { id } = await params;
  const landing = await getSingleLanding(id);
  const landingData = landing?.data;
  const productData = landingData?.product;

  if (!landingData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-red-500">
            Landing page not found
          </h2>
          <p className="mt-2">The requested landing page could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section with Animated Heading */}
      <div className="relative py-8 sm:py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 z-0"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 sm:mb-6 animate-fadeIn font-bengali">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              {landingData?.heading}
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-center max-w-3xl mx-auto text-gray-600 animate-slideUp px-2 font-bengali">
            আপনার প্রত্যাশা পূরণ করে এমন প্রিমিয়াম গুণমান প্রোডাক্ট খুজুন।
          </p>

          <Link
            href={"#order"}
            className="cursor-pointer text-center flex items-center justify-center mt-6 sm:mt-8"
          >
            <Button
              size="lg"
              variant="secondary"
              className="text-base sm:text-lg py-5 font-bengali"
            >
              <ShoppingBag className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> অর্ডার করতে
              চাই
            </Button>
          </Link>
        </div>
      </div>

      {/* Product Display Section */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Product Image with Animation */}
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-2xl group mx-auto w-full max-w-md md:max-w-none">
            {productData?.images && productData.images.length > 0 ? (
              <div className="aspect-square relative">
                <Image
                  src={getImgUrl(productData.images[0])}
                  alt={productData.name || "Product Image"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>
            ) : (
              <div className="aspect-square bg-gray-200 flex items-center justify-center">
                <ShoppingBag className="h-16 w-16 sm:h-24 sm:w-24 text-gray-400" />
              </div>
            )}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-primary text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-bold animate-pulse">
              Special Offer
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 animate-fadeIn font-bengali">
              {productData?.name || "Premium Product"}
            </h2>

            {/* Price Section */}
            <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-md">
              <div className="flex items-end gap-2 sm:gap-3">
                {productData?.price && (
                  <span className="text-gray-500 line-through text-base sm:text-xl">
                    ৳{productData.price}
                  </span>
                )}
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary animate-bounce">
                  ৳{productData?.discountPrice || "Call for price"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 font-bengali">
                *শুধুমাত্র সীমিত সময়ের জন্য অফার মূল্য
              </p>
            </div>

            {/* Features */}
            <div className="space-y-2 sm:space-y-3 font-bengali">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                <span className="text-sm sm:text-base">Premium Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                <span className="text-sm sm:text-base">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                <span className="text-sm sm:text-base">100% Authentic</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                <span className="text-sm sm:text-base">Limited Time Offer</span>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-primary/10 p-4 sm:p-6 rounded-lg sm:rounded-xl">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 font-bengali">
                যোগাযোগের তথ্য
              </h3>
              <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-primary animate-bounce" />
                <a
                  href={`tel:${landingData.phone}`}
                  className="font-bold hover:text-primary transition-colors"
                >
                  {landingData.phone}
                </a>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href={`https://wa.me/${landingData.phone?.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white flex-1 text-base sm:text-lg py-5 font-bengali"
                >
                  হোয়াটসঅ্যাপ
                </Button>
              </Link>
              <Link href={"#order"}>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 text-base sm:text-lg border-primary text-primary hover:bg-primary/10 py-5 font-bengali"
                >
                  অর্ডার করুন
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description Section */}
      {productData?.description && (
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 font-bengali">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden">
            <div className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-3xl font-bold mb-2 text-center">
                পণ্যের বিবরণ
              </h2>
              <Separator className="my-3 sm:my-4" />
              <ProductDesc productDesc={productData.description} />
            </div>
          </div>
        </div>
      )}

      {/* Additional Product Images */}
      {productData?.images && productData.images.length > 0 && (
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center font-bengali">
            প্রোডাক্ট গ্যালারী
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
            {productData.images.map((image: string, index: number) => (
              <div
                key={index}
                className="aspect-square relative rounded-md sm:rounded-lg overflow-hidden shadow-sm sm:shadow-md hover:shadow-lg sm:hover:shadow-xl transition-shadow"
              >
                <Image
                  src={getImgUrl(image)}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action Section */}
      <div className="bg-primary text-white py-10 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 font-bengali">
            এখনই অর্ডার করুন!
          </h2>
          <p className="text-base sm:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto font-bengali font-semibold">
            এই অফার মিস করবেন না। আপনার অর্ডার দেওয়ার জন্য এখনই আমাদের সাথে
            যোগাযোগ করুন!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-base sm:text-lg py-5"
              // onClick={() =>
              //   (window.location.href = `tel:${landingData.phone}`)
              // }
            >
              <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />{" "}
              {landingData.phone}
            </Button>
            <Link href={"#order"}>
              <Button
                size="lg"
                variant="secondary"
                className="text-base sm:text-lg py-5 font-bengali"
                // onClick={() =>
                //   (window.location.href = `tel:${landingData.phone}`)
                // }
              >
                <ShoppingBag className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> অর্ডার
                করতে চাই
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="" id="#order">
        <LandingCheckout product={productData} />
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm sm:text-base">
            © {new Date().getFullYear()} All Rights Reserved
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            Contact: {landingData.phone}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Page;
