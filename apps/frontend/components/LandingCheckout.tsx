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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Textarea } from "@workspace/ui/components/textarea";
import { MinusIcon, PlusIcon, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const LandingCheckout = ({ product }: { product: any }) => {
  const [createOrder, { isLoading, error, isError, isSuccess }] =
    useCreateOrderMutation();

  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [shippingLocation, setShippingLocation] = useState("outside");
  const [shippingPrice, setShippingPrice] = useState(
    product?.outsideDhaka || 120
  );

  // Add validation state
  const [showValidation, setShowValidation] = useState(false);

  // Compute these values
  const hasSizes = product?.size && product.size.length > 0;
  const hasColors = product?.colors && product.colors.length > 0;

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
    // Set initial shipping price to outside Dhaka
    handleShippingChange("outside");

    // Set initial size and color if available
    if (product?.size && product.size.length > 0) {
      const firstSize = product.size[0];
      setSelectedSize(
        typeof firstSize === "object" ? firstSize.name : firstSize
      );
    }
    if (product?.colors && product.colors.length > 0) {
      const firstColor = product.colors[0];
      setSelectedColor(
        typeof firstColor === "object" ? firstColor.name : firstColor
      );
    }
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

  const handlePlaceOrder = async (e: any) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("সকল তথ্য পূরণ করুন", {
        id: "form-validation",
      });
      return;
    }

    // Check if product has sizes and colors and validate selection
    const hasSizes = product?.size && product.size.length > 0;
    const hasColors = product?.colors && product.colors.length > 0;

    if (hasSizes && !selectedSize) {
      return;
    }

    if (hasColors && !selectedColor) {
      return;
    }

    // Create order items array
    const orderItems = [
      {
        productName: product?.name,
        price: Number(product?.discountPrice),
        quantity: quantity,
        image: product?.images?.[0],
        product: product?._id,
        colors: selectedColor,
        size: selectedSize,
      },
    ];

    // Calculate total amount
    const totalAmount =
      (product?.discountPrice || 0) * quantity + shippingPrice;

    // Create order data
    const orderData = {
      fullName: formData.name,
      phone: formData.phone,
      address: formData.address,
      paymentType: "Cash on delivery",
      orderItems,
      itemsPrice: Number(product?.discountPrice),
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
            <h3 className="text-xl font-bold mb-6 text-center font-bengali">
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
                <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="font-semibold font-bengali">
                      {product?.name}
                    </span>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center">
                    <div className="flex items-center border rounded-md overflow-hidden">
                      <button
                        type="button"
                        className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                        onClick={handleQuantityDecrement}
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        min="1"
                        className="w-12 text-center border-x p-2"
                        readOnly
                      />
                      <button
                        type="button"
                        className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                        onClick={handleQuantityIncrement}
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <div className="font-bold text-lg">
                      <span>৳{product?.discountPrice || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Size and Color Selection */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Size Selection */}

              {product?.size && product.size.length > 0 && (
                <div>
                  <Label className="font-bengali mb-2 block">
                    সাইজ নির্বাচন করুন <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedSize}
                    onValueChange={setSelectedSize}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="সাইজ নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.size.map((size: any) => (
                        <SelectItem
                          key={typeof size === "object" ? size._id : size}
                          value={typeof size === "object" ? size.name : size}
                        >
                          {typeof size === "object" ? size.name : size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {hasSizes && !selectedSize && (
                    <p className="text-red-500 text-sm mt-1">
                      সাইজ নির্বাচন করুন
                    </p>
                  )}
                </div>
              )}

              {/* Color Selection */}
              {product?.colors && product.colors.length > 0 && (
                <div>
                  <Label className="font-bengali mb-2 block">
                    কালার নির্বাচন করুন <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedColor}
                    onValueChange={setSelectedColor}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="কালার নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.colors.map((color: any) => (
                        <SelectItem
                          key={typeof color === "object" ? color._id : color}
                          value={typeof color === "object" ? color.name : color}
                        >
                          {typeof color === "object" ? color.name : color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {hasColors && !selectedColor && (
                    <p className="text-red-500 text-sm mt-1">
                      কালার নির্বাচন করুন
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Customer Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div>
              <div>
                <h3 className="text-xl font-bold mb-6 font-bengali">
                  আপনার তথ্য
                </h3>

                <div className="space-y-4">
                  <div className="form-row">
                    <Label
                      htmlFor="billing_first_name"
                      className="font-bengali mb-2 block"
                    >
                      আপনার নাম <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="name"
                      id="billing_first_name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full ${showValidation && !formData.name ? "border-red-500" : ""}`}
                      required
                    />
                    {showValidation && !formData.name && (
                      <p className="text-red-500 text-sm mt-1">আপনার নাম দিন</p>
                    )}
                  </div>

                  <div className="form-row">
                    <Label
                      htmlFor="billing_phone"
                      className="font-bengali mb-2 block"
                    >
                      আপনার মোবাইল নাম্বার{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="tel"
                      name="phone"
                      id="billing_phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full ${showValidation && !formData.phone ? "border-red-500" : ""}`}
                      required
                    />
                    {showValidation && !formData.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        আপনার মোবাইল নাম্বার দিন
                      </p>
                    )}
                  </div>

                  <div className="form-row">
                    <Label
                      htmlFor="billing_address_1"
                      className="font-bengali mb-2 block"
                    >
                      গ্রাম, থানা, জেলা পূর্ণ ঠিকানা লিখুন{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      name="address"
                      id="billing_address_1"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full ${showValidation && !formData.address ? "border-red-500" : ""}`}
                      rows={4}
                      required
                    />
                    {showValidation && !formData.address && (
                      <p className="text-red-500 text-sm mt-1">
                        আপনার ঠিকানা দিন
                      </p>
                    )}
                  </div>

                  {/* Delivery Location Selection */}
                  <div className="form-row">
                    <Label className="font-bengali mb-2 block">
                      ডেলিভারি লোকেশন <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      onValueChange={handleShippingChange}
                      defaultValue={shippingLocation}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="inside" id="inside" />
                        <Label
                          htmlFor="inside"
                          className="font-normal font-bengali"
                        >
                          ঢাকার ভিতরে (৳{product?.insideDhaka || 60})
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="outside" id="outside" />
                        <Label
                          htmlFor="outside"
                          className="font-normal font-bengali"
                        >
                          ঢাকার বাইরে (৳{product?.outsideDhaka || 120})
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div>
                <h3 className="text-xl font-bold mb-6 font-bengali">
                  আপনার অর্ডার
                </h3>

                <div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-bengali font-medium">পণ্য</span>
                      <span className="font-bengali font-medium">মূল্য</span>
                    </div>

                    <div className="flex justify-between py-3 border-b">
                      <span className="font-bengali">
                        {product?.name} <strong>× {quantity}</strong>
                        {selectedSize && <span> - {selectedSize}</span>}
                        {selectedColor && <span> - {selectedColor}</span>}
                      </span>
                      <span>৳{(product?.discountPrice || 0) * quantity}</span>
                    </div>

                    {/* Removed duplicate product entry */}

                    <div className="flex justify-between py-3 border-b">
                      <span className="font-bengali">ডেলিভারি চার্জ</span>
                      <span>৳{shippingPrice}</span>
                    </div>

                    <div className="flex justify-between py-3 font-bold text-lg">
                      <span className="font-bengali">সর্বমোট</span>
                      <span>
                        ৳
                        {(product?.discountPrice || 0) * quantity +
                          shippingPrice}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2 text-sm text-gray-500">
                    <p className="font-bengali">
                      * ঢাকার ভিতরে ডেলিভারি চার্জ ৳{product?.insideDhaka || 60}
                    </p>
                    <p className="font-bengali">
                      * ঢাকার বাইরে ডেলিভারি চার্জ ৳
                      {product?.outsideDhaka || 120}
                    </p>
                    <p className="font-bengali">
                      * ক্যাশ অন ডেলিভারি সুবিধা উপলব্ধ
                    </p>
                  </div>

                  <div className="mt-6">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-6 text-lg font-bengali bg-primary hover:bg-primary/90"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          অর্ডার প্রসেসিং...
                        </span>
                      ) : (
                        "অর্ডার কনফার্ম করুন"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LandingCheckout;
