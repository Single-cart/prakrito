/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getImgUrl } from "@/lib/getImgPath";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import {
  ClipboardCheck,
  Package,
  ShoppingBag,
  TruckIcon,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useGetSingleOrdersQuery } from "../../redux/features/orders/orderApi";

const SuccessOrder = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [copied, setCopied] = useState(false);

  const { data, isLoading } = useGetSingleOrdersQuery(orderId || "");
  const orderDetails = data?.order;
  const copyToClipboard = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full min-h-screen py-8 px-4 md:px-8 max-w-4xl mx-auto">
      <div className="flex flex-col items-center justify-center mb-8">
        <Image
          src={"/order-success.png"}
          width={80}
          height={80}
          alt="Order Success"
          className="mb-2"
        />
        <h1 className="text-xl md:text-2xl font-semibold text-center">
          Your order has been successfully placed!
        </h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-medium">Order Summary</h2>
                </div>
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                  {orderDetails?.orderStatus}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                      {orderDetails?.orderId}
                    </code>
                    <button
                      onClick={copyToClipboard}
                      className="text-primary hover:text-primary/80"
                      title="Copy to clipboard"
                    >
                      <ClipboardCheck size={16} />
                    </button>
                    {copied && (
                      <span className="text-green-500 text-xs">Copied!</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Date Placed</p>
                  <p className="font-medium mt-1">
                    {orderDetails?.createdAt
                      ? formatDate(orderDetails.createdAt)
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Payment Method
                  </p>
                  <p className="font-medium mt-1">
                    {orderDetails?.paymentType}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-medium mt-1">
                    ৳
                    {Number(orderDetails?.totalAmount) ||
                      Number(orderDetails?.itemsPrice) +
                        Number(orderDetails?.shippingPrice) ||
                      0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border bg-card text-card-foreground shadow">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-medium">Customer Information</h2>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">
                      {orderDetails?.shippingInfo?.fullName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">
                      {orderDetails?.user?.email || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">
                      {orderDetails?.shippingInfo?.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TruckIcon className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-medium">Shipping Information</h2>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">
                      {orderDetails?.shippingInfo?.address}
                    </p>
                  </div>

                  {orderDetails?.orderNots && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Order Notes
                      </p>
                      <p className="font-medium">{orderDetails.orderNots}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-medium">Order Items</h2>
              </div>

              <div className="space-y-4">
                {orderDetails?.orderItems?.map((item: any, index: number) => {
                  // Get the product info (now populated from backend)
                  const product = item.product;
                  const variation =
                    product?.priceVariation?.[item.priceVariationIndex - 1];
                  const productImage = product?.images?.[0];
                  const variationQuantity = variation?.quantity || "";

                  return (
                    <div
                      key={item._id}
                      className="flex flex-col sm:flex-row justify-between items-start border rounded-md p-4 gap-3"
                    >
                      <div className="flex gap-3 w-full sm:w-auto">
                        {productImage ? (
                          <div className="h-20 w-20 flex-shrink-0 relative rounded-md overflow-hidden">
                            <Image
                              src={getImgUrl(productImage)}
                              alt={product?.name || "Product image"}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-20 w-20 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
                            {index + 1}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-base truncate pr-2">
                            {product?.name || `Product #${index + 1}`}
                          </p>
                          <div className="flex flex-wrap items-center gap-1 mt-2">
                            {variation?.size && (
                              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                                Size: {variation.size}
                              </span>
                            )}
                            {variation?.color && (
                              <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
                                Color: {variation.color}
                              </span>
                            )}
                            {variation?.weight && (
                              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                                Weight: {variation.weight}
                              </span>
                            )}
                            {variationQuantity && (
                              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                                Quantity: {variationQuantity}
                              </span>
                            )}
                            {!variation && (
                              <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                                Variation: {item.priceVariationIndex}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right mt-2 sm:mt-0 w-full sm:w-auto">
                        <p className="font-medium text-lg">৳{item.price}</p>
                      </div>
                    </div>
                  );
                })}

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm">Subtotal:</p>
                    <p className="font-medium">
                      ৳{Number(orderDetails?.itemsPrice) || 0}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm">Shipping:</p>
                    <p className="font-medium">
                      ৳{Number(orderDetails?.shippingPrice) || 0}
                    </p>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <p className="font-medium">Total:</p>
                    <p className="font-medium">
                      ৳
                      {Number(orderDetails?.totalAmount) ||
                        Number(orderDetails?.itemsPrice || 0) +
                          Number(orderDetails?.shippingPrice || 0) ||
                        0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="/">
              <Button variant="outline">Return to Home</Button>
            </Link>

            <Link href="/profile/order-history">
              <Button>View All Orders</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuccessOrder;
