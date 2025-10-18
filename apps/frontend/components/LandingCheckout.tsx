/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getImgUrl } from "@/lib/getImgPath";
import { useCreateOrderMutation } from "@/redux/features/orders/orderApi";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { Textarea } from "@workspace/ui/components/textarea";
import { MinusIcon, PlusIcon, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const LandingCheckout = ({ product }: { product: any }) => {
  const [createOrder, { isLoading, error, isError, isSuccess }] =
    useCreateOrderMutation();

  const router = useRouter();
  const [selectedPriceVariationIndex, setSelectedPriceVariationIndex] =
    useState(0);
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: false,
    phone: false,
    address: false,
    variation: false,
  });
  const [shippingLocation, setShippingLocation] = useState("outside");
  const [shippingPrice, setShippingPrice] = useState(
    product?.outsideDhaka || 120
  );

  // Filter available price variations only using useMemo
  const availablePriceVariations = useMemo(
    () =>
      product?.priceVariation?.filter(
        (variation: any) => variation.available !== false
      ) || [],
    [product?.priceVariation]
  );

  // Set default selected variation to first available one
  useEffect(() => {
    if (availablePriceVariations.length > 0) {
      setSelectedPriceVariationIndex(0);
    }
  }, [availablePriceVariations]);

  // Handle quantity changes
  const handleQuantityDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleQuantityIncrement = () => {
    setQuantity(quantity + 1);
  };

  // Handle form input changes
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle shipping location change
  const handleShippingChange = (value: string) => {
    setShippingLocation(value);
    const newShippingPrice =
      value === "inside"
        ? product?.insideDhaka || 60
        : product?.outsideDhaka || 120;
    setShippingPrice(newShippingPrice);
  };

  // Initialize shipping price on component mount
  useEffect(() => {
    handleShippingChange("outside");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle success and error states
  useEffect(() => {
    if (isSuccess) {
      toast.success("Order Placed successfully");
      router.push("/landing/success");
    } else if (isError) {
      const errorData = error as { data: { message: string } };
      toast.error(errorData?.data?.message);
    }
  }, [error, isError, isSuccess, router]);

  // Validate form fields
  const validateForm = () => {
    const errors = {
      name: !formData.name.trim(),
      phone: !formData.phone.trim(),
      address: !formData.address.trim(),
      variation: availablePriceVariations.length === 0,
    };

    setFormErrors(errors);

    // Check if any errors exist
    return !Object.values(errors).some((error) => error);
  };

  const handlePlaceOrder = async (e: any) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      toast.error("সকল তথ্য পূরণ করুন", {
        id: "form-validation",
      });
      return;
    }

    // Get the selected price variation from available variations
    const selectedVariation =
      availablePriceVariations[selectedPriceVariationIndex];
    if (!selectedVariation) {
      toast.error("দয়া করে একটি বৈধ প্রোডাক্ট ভেরিয়েশন নির্বাচন করুন", {
        id: "variation-error",
      });
      return;
    }

    // Create order items array
    const orderItems = [
      {
        productName: product?.name,
        price: Number(selectedVariation.discountPrice || 0),
        quantity: quantity,
        image: product?.images?.[0],
        product: product?._id,
        priceVariationIndex: selectedPriceVariationIndex + 1,
      },
    ];

    // Calculate total amount
    const totalAmount =
      (selectedVariation.discountPrice || 0) * quantity + shippingPrice;

    // Create order data
    const orderData = {
      fullName: formData.name,
      phone: formData.phone,
      address: formData.address,
      paymentType: "Cash on delivery",
      orderItems,
      itemsPrice: Number(selectedVariation.discountPrice || 0) * quantity,
      shippingPrice: shippingPrice,
      totalAmount: totalAmount,
      shippingLocation: shippingLocation,
    };
    await createOrder(orderData);
  };

  return (
    <div id="order" className="bg-gray-50 py-10 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <form
          onSubmit={handlePlaceOrder}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          {/* Product Selection Section */}
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold mb-6 text-center font-noto">
              কোনটা নিবেন নিচ থেকে পছন্দ করুন
            </h3>

            <div>
              <div className="flex flex-col md:flex-row gap-4 items-center p-4 border rounded-lg bg-gray-50">
                {/* Checkbox */}
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                    checked
                    disabled
                  />
                </div>

                {/* Product Image */}
                <div className="w-24 h-24 relative rounded-md overflow-hidden">
                  {product?.images && product.images.length > 0 ? (
                    <Image
                      src={getImgUrl(product.images[0])}
                      alt={product.name || "Product Image"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-2">
                    {product?.name}
                  </h4>

                  {/* Price Variations */}
                  <div className="space-y-2">
                    {availablePriceVariations.length > 0 ? (
                      availablePriceVariations.map(
                        (variation: any, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="priceVariation"
                              checked={selectedPriceVariationIndex === index}
                              onChange={() =>
                                setSelectedPriceVariationIndex(index)
                              }
                              className="h-4 w-4 text-primary"
                            />
                            <span className="text-sm">
                              {variation.quantity} - ৳{variation.discountPrice}
                              {variation.price &&
                                variation.price !== variation.discountPrice && (
                                  <span className="ml-2 text-gray-500 line-through">
                                    ৳{variation.price}
                                  </span>
                                )}
                            </span>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-red-500 font-noto text-sm">
                        কোনো পণ্য উপলব্ধ নেই।
                      </p>
                    )}
                    {formErrors.variation && (
                      <p className="text-red-500 text-sm mt-1">
                        কোনো পণ্য উপলব্ধ নেই। যোগাযোগ করুন
                      </p>
                    )}
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleQuantityDecrement}
                      disabled={quantity <= 1}
                    >
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{quantity}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleQuantityIncrement}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information Section */}
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold mb-6 text-center font-noto">
              আপনার তথ্য দিন
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="font-noto">
                  নাম <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="আপনার নাম লিখুন"
                  className={`mt-1 ${formErrors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1 font-noto">
                    নাম দেওয়া আবশ্যক
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="font-noto">
                  ফোন নাম্বার <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="আপনার ফোন নাম্বার লিখুন"
                  className={`mt-1 ${formErrors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    ফোন নাম্বার দেওয়া আবশ্যক
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="address" className="font-noto">
                  ঠিকানা <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="আপনার পূর্ণ ঠিকানা লিখুন"
                  className={`mt-1 ${formErrors.address ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {formErrors.address && (
                  <p className="text-red-500 text-sm mt-1">
                    ঠিকানা দেওয়া আবশ্যক
                  </p>
                )}
              </div>

              <div>
                <Label className="font-noto mb-2 block">ডেলিভারি লোকেশন</Label>
                <RadioGroup
                  value={shippingLocation}
                  onValueChange={handleShippingChange}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="inside" id="inside" />
                    <Label htmlFor="inside" className="font-noto">
                      ঢাকার ভিতরে
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="outside" id="outside" />
                    <Label htmlFor="outside" className="font-noto">
                      ঢাকার বাইরে
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="p-6 border-t bg-gray-50">
            <h3 className="text-xl font-bold mb-6 text-center font-noto">
              অর্ডার সারসংক্ষেপ
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-noto">পণ্যের মূল্য ({quantity}টি):</span>
                <span>
                  ৳
                  {product?.priceVariation?.[selectedPriceVariationIndex]
                    ?.discountPrice * quantity || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-noto">শিপিং চার্জ:</span>
                <span>৳{shippingPrice}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold">
                <span className="font-noto">সর্বমোট:</span>
                <span>
                  ৳
                  {product?.priceVariation?.[selectedPriceVariationIndex]
                    ?.discountPrice *
                    quantity +
                    shippingPrice || 0}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="submit"
                size="lg"
                className="w-full text-lg py-6 font-noto bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary shadow-lg hover:shadow-xl transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <span>
                    <ShoppingBag className="inline-block mr-2 h-5 w-5" /> অর্ডার
                    কনফার্ম করুন
                  </span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LandingCheckout;
