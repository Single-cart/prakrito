/* eslint-disable @typescript-eslint/no-explicit-any */
import ImageLightbox from "@/components/ImageLightbox";
import LandingCheckout from "@/components/LandingCheckout";
import ProductDesc from "@/components/ProductDesc";
import { getSingleLanding } from "@/lib/fetch/landing.data";
import { getImgUrl } from "@/lib/getImgPath";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel";
import { Separator } from "@workspace/ui/components/separator";
import {
  Award,
  Check,
  Phone,
  Play,
  Shield,
  ShoppingBag,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

const Page: FC<Props> = async ({ params }) => {
  const { id } = await params;

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return "";
    const cleanUrl = url.startsWith("@") ? url.substring(1) : url;
    let videoId = "";
    if (cleanUrl.includes("youtu.be/")) {
      videoId = cleanUrl.split("youtu.be/")[1] ?? "";
    } else if (cleanUrl.includes("youtube.com/watch")) {
      const urlParams = new URLSearchParams(cleanUrl.split("?")[1] ?? "");
      videoId = urlParams.get("v") || "";
    } else if (cleanUrl.includes("youtube.com/embed/")) {
      videoId = cleanUrl.split("youtube.com/embed/")[1] ?? "";
    }
    if (videoId && videoId.includes("?")) {
      videoId = videoId.split("?")[0] ?? "";
    }
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const landing = await getSingleLanding(id);
  const landingData = landing?.data;
  const productData = landingData?.product;

  console.log(landingData);

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
      {/* Hero Section */}
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 via-transparent to-purple-400/20 animate-gradient-shift"></div>
            <div className="absolute inset-0 bg-gradient-to-bl from-pink-400/20 via-transparent to-orange-400/20 animate-gradient-shift-reverse"></div>
          </div>
        </div>
        <div className="relative z-10 min-h-[70vh] flex items-center py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-4 animate-fade-in-down">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-noto">
                  <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-2 px-1 leading-normal sm:leading-normal md:leading-normal lg:leading-normal font-noto">
                    {landingData?.heading}
                  </span>
                </h1>
                <div className="mt-4 flex justify-center">
                  <div className="h-1 w-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
                </div>
              </div>
              {landingData?.description && (
                <div className="mb-6 animate-fade-in-up delay-200">
                  <p className="text-base sm:text-lg md:text-xl font-noto leading-relaxed text-gray-600 max-w-2xl mx-auto">
                    {landingData.description}
                  </p>
                </div>
              )}
              <div className="animate-fade-in-up delay-400">
                <Link href="#order">
                  <Button
                    size="lg"
                    className="text-base sm:text-lg md:text-xl py-4 px-8 sm:px-10 font-noto font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-pink-600 hover:via-purple-600 hover:to-blue-60 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-full"
                  >
                    <ShoppingBag className="inline-block mr-2 h-5 w-5" />
                    {landingData?.heroBtnText || "অর্ডার করতে চাই"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Display Section */}
      <div className="relative py-12 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
              Featured Product
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-noto">
              আমাদের প্রিমিয়াম প্রোডাক্ট
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            <div className="relative">
              <div className="sticky top-8">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-3xl opacity-50 blur-2xl"></div>
                  <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
                    {productData?.images && productData.images.length > 0 ? (
                      <div className="aspect-square relative">
                        <Image
                          src={getImgUrl(productData.images[0])}
                          alt={productData.name || "Product Image"}
                          fill
                          className="object-cover hover:scale-110 transition-transform duration-700"
                          priority
                        />
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                            🔥 Hot Deal
                          </span>
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            ✓ In Stock
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <ShoppingBag className="h-24 w-24 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
                {productData?.images && productData.images.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {productData.images
                      .slice(0, 4)
                      .map((image: string, index: number) => (
                        <div
                          key={index}
                          className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary transition-colors cursor-pointer"
                        >
                          <Image
                            src={getImgUrl(image)}
                            alt={`Product ${index + 1}`}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 font-noto">
                  {productData?.name || "Premium Product"}
                </h1>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1 font-noto">
                      বিশেষ অফার মূল্য
                    </p>
                    <div className="flex items-end gap-3">
                      {productData?.priceVariation &&
                        productData.priceVariation.length > 0 && (
                          <>
                            {(() => {
                              const availableVariation =
                                productData.priceVariation.find(
                                  (variation: any) =>
                                    variation.available !== false
                                );

                              if (!availableVariation) {
                                return (
                                  <span className="text-2xl font-bold text-primary">
                                    Call for price
                                  </span>
                                );
                              }

                              return (
                                <>
                                  <span className="text-4xl font-black text-primary">
                                    ৳{availableVariation.discountPrice}
                                  </span>
                                  {availableVariation.price && (
                                    <span className="text-xl text-gray-400 line-through">
                                      ৳{availableVariation.price}
                                    </span>
                                  )}
                                </>
                              );
                            })()}
                          </>
                        )}
                    </div>
                    <p className="text-xs text-green-600 mt-2 font-semibold">
                      ✓ Free Delivery Available
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Quality</p>
                      <p className="text-sm font-semibold">Premium</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Award className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Authentic</p>
                      <p className="text-sm font-semibold">100%</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-noto">
                        দ্রুত অর্ডারের জন্য কল করুন
                      </p>
                      <a
                        href={`tel:${landingData.phone}`}
                        className="text-lg font-bold text-gray-900 hover:text-primary transition-colors"
                      >
                        {landingData.phone}
                      </a>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                    Available 24 Hours
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="#order">
                    <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 rounded-xl">
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      অর্ডার করুন
                    </Button>
                  </Link>
                  <Link
                    href={`https://wa.me/${landingData.phone?.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 rounded-xl">
                      <svg
                        className="mr-2 h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      WhatsApp
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New CTA Section */}
      <div className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-noto">
              এখনই অর্ডার করুন!
            </h2>
            <p className="mt-4 text-lg text-gray-600 font-noto">
              এই অফার মিস করবেন না। আপনার অর্ডার দেওয়ার জন্য এখনই আমাদের সাথে
              যোগাযোগ করুন!
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <a href={`tel:${landingData.phone}`}>
                  <Phone className="mr-3 h-5 w-5" />
                  {landingData.phone}
                </a>
              </Button>
              <Link href="#order">
                <Button
                  size="lg"
                  className="text-base font-noto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  অর্ডার করতে চাই
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* YouTube Videos Section */}
      {landingData?.youtubeLinks && landingData.youtubeLinks.length > 0 && (
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center p-2 bg-red-100 rounded-full mb-3">
                  <Play className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2 font-noto bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-pink-600">
                  প্রোডাক্ট ভিডিও দেখুন
                </h2>
              </div>
              <div className="relative max-w-4xl mx-auto">
                <Carousel
                  opts={{ align: "start", loop: true }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-3">
                    {landingData.youtubeLinks.map(
                      (link: string, index: number) => (
                        <CarouselItem
                          key={index}
                          className="pl-2 md:pl-3 basis-full md:basis-1/2"
                        >
                          <div className="p-0.5">
                            <Card className="border-0 shadow-md overflow-hidden">
                              <div className="aspect-video w-full relative rounded-md overflow-hidden bg-gray-100">
                                <iframe
                                  src={getYouTubeEmbedUrl(link)}
                                  title={`Product Video ${index + 1}`}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                                  className="absolute top-0 left-0 w-full h-full"
                                ></iframe>
                              </div>
                            </Card>
                          </div>
                        </CarouselItem>
                      )
                    )}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex -left-8 h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white" />
                  <CarouselNext className="hidden md:flex -right-8 h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white" />
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      )}

      {productData?.description && (
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 font-noto">
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

      {/* New Offer Section - Centered Layout */}
      {landingData?.offerTitle && landingData?.offerDescription && (
        <div className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              {/* Title */}
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-noto">
                  {landingData.offerTitle}
                </h2>
                <div className="mt-4 flex justify-center">
                  <div className="h-1 w-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
                </div>
              </div>

              {/* Centered Image */}
              <div className="mb-8 flex justify-center">
                <div className="relative w-full max-w-2xl aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  {landingData?.productGallery &&
                    landingData?.productGallery.length > 1 &&
                    landingData?.productGallery[1] &&
                    landingData?.productGallery[1].path && (
                      <Image
                        src={getImgUrl(landingData?.productGallery[1].path)}
                        alt={productData.name || "Offer Product Image"}
                        fill
                        className="object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                    )}
                </div>
              </div>

              {/* Centered Benefits List */}
              <div className="space-y-4 max-w-2xl mx-auto">
                {landingData.offerDescription
                  .split(",")
                  .map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 justify-center"
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="text-gray-700 font-noto text-lg flex-1 max-w-xl">
                        {item.trim()}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificates Section - Centered Layout */}
      {landingData?.certificates && landingData.certificates.length > 0 && (
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden max-w-5xl mx-auto">
            <div className="p-4 sm:p-6 flex flex-col items-center">
              {/* Centered Title */}
              <h2 className="text-xl sm:text-2xl font-bold mb-8 text-center font-noto bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                <Award className="inline-block mr-2 h-6 w-6" />
                {landingData?.certificateTitle || "আমাদের সার্টিফিকেট"}
              </h2>

              {/* Centered Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
                {landingData.certificates.map(
                  (certificate: any, index: number) => {
                    if (!certificate || !certificate.path) return null;
                    return (
                      <ImageLightbox
                        key={index}
                        imageUrl={getImgUrl(certificate.path)}
                        altText={`Certificate ${index + 1}`}
                      >
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer mx-auto">
                          <div className="aspect-[4/3] relative">
                            <Image
                              src={getImgUrl(certificate.path)}
                              alt={`Certificate ${index + 1}`}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        </Card>
                      </ImageLightbox>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Reviews Section */}
      {landingData?.reviews && landingData.reviews.length > 0 && (
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 sm:p-6 flex flex-col items-center">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center font-noto bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                <Users className="inline-block mr-2 h-6 w-6" />
                কাস্টমার রিভিউ
              </h2>
              <div className="relative max-w-6xl mx-auto">
                <Carousel
                  opts={{ align: "start", loop: true }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {landingData.reviews.map((review: any, index: number) => {
                      if (!review || !review.path) return null;
                      return (
                        <CarouselItem
                          key={index}
                          className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                        >
                          <ImageLightbox
                            imageUrl={getImgUrl(review.path)}
                            altText={`Customer Review ${index + 1}`}
                          >
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer mx-auto">
                              <div className="aspect-square relative">
                                <Image
                                  src={getImgUrl(review.path)}
                                  alt={`Customer Review ${index + 1}`}
                                  fill
                                  className="object-cover hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            </Card>
                          </ImageLightbox>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex -left-12 bg-white/90 backdrop-blur-sm hover:bg-white" />
                  <CarouselNext className="hidden md:flex -right-12 bg-white/90 backdrop-blur-sm hover:bg-white" />
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Gallery Section */}
      {landingData?.productGallery && landingData.productGallery.length > 0 && (
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 sm:p-6 flex flex-col items-center">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center font-noto bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                <Shield className="inline-block mr-2 h-6 w-6" />
                প্রোডাক্ট গ্যালারী
              </h2>
              <div className="relative max-w-6xl mx-auto">
                <Carousel
                  opts={{ align: "start", loop: true }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {landingData.productGallery.map(
                      (image: any, index: number) => {
                        if (!image || !image.path) return null;
                        return (
                          <CarouselItem
                            key={index}
                            className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4"
                          >
                            <ImageLightbox
                              imageUrl={getImgUrl(image.path)}
                              altText={`Gallery image ${index + 1}`}
                            >
                              <div className="aspect-square relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer mx-auto">
                                <Image
                                  src={getImgUrl(image.path)}
                                  alt={`Gallery image ${index + 1}`}
                                  fill
                                  className="object-cover hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            </ImageLightbox>
                          </CarouselItem>
                        );
                      }
                    )}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex -left-12 bg-white/90 backdrop-blur-sm hover:bg-white" />
                  <CarouselNext className="hidden md:flex -right-12 bg-white/90 backdrop-blur-sm hover:bg-white" />
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="" id="order">
        <LandingCheckout product={productData} />
      </div>

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
