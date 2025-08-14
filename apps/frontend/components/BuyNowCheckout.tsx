"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import BuyNowOrder from "@/components/BuyNowOrder";
import ComponentLoader from "@/components/ComponentLoader";
import { clearBuyNow } from "@/redux/features/cart/cartSlice";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";

import { customEvent } from "@/components/gtm/customEvent";
import ShippingPriceSelection from "@/components/ShippingPrice";
import { useAuth } from "@/hooks/useAuth";
import {
  useCreateOrderMutation,
  useGetOrderStatusQuery,
} from "@/redux/features/orders/orderApi";
import { RootState } from "@/redux/store";
import { ListOrdered, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const orderSchema = z.object({
  fullName: z.string().min(1, "Enter Your Full Name"),
  email: z.string().optional(),
  phone: z
    .string()
    .min(1, "Enter Your Phone Number")
    .regex(/^(\+88)?(01[3-9]\d{8})$/, "Invalid Phone Number"),
  address: z.string().min(1, "Enter Shipping Address"),
  orderNots: z.string().optional(),
  shippingLocation: z.enum(["inside", "outside"], {
    required_error: "Please select a delivery location",
  }),
});

const BuyNowCheckout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const [selectedShippingPrice, setSelectedShippingPrice] = useState(0);
  const [createOrder, { isLoading, error, isError, isSuccess, data }] =
    useCreateOrderMutation();
  const { refetch } = useGetOrderStatusQuery({});
  const { user } = useAuth();
  const { buyNowItem } = useSelector((state: RootState) => state.cart as any);

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      orderNots: "",
      shippingLocation: "outside",
    },
  });

  useEffect(() => {
    if (isSuccess && data?.order) {
      toast.success("Order Placed successfully");
      router.replace("/orderSuccess?orderId=" + data?.order?._id);
      setTimeout(() => dispatch(clearBuyNow()), 100);
    } else if (isError) {
      const errorData = error as { data: { message: string } };
      toast.error(errorData?.data?.message);
    }
  }, [data?.order, dispatch, error, isError, isSuccess, router]);

  useEffect(() => {
    form.setValue("fullName", user?.fullName || "");
    form.setValue("email", user?.email || "");
    form.setValue("phone", user?.phone || "");
    form.setValue("address", user?.address || "");
    form.setValue("orderNots", "");
    form.setValue("shippingLocation", "outside", {
      shouldValidate: true,
    });

    if (buyNowItem?.product) {
      const defaultShippingPrice = buyNowItem.product.outsideDhaka || 0;
      setSelectedShippingPrice(defaultShippingPrice);

      const selectedVariation =
        buyNowItem.product.priceVariation?.[buyNowItem.priceVariationIndex - 1];

      if (selectedVariation) {
        setCalculatedAmount(
          selectedVariation.discountPrice + defaultShippingPrice
        );
      }
    }
  }, [form, user, buyNowItem, router]);

  const selectedVariation =
    buyNowItem?.product?.priceVariation?.[buyNowItem?.priceVariationIndex - 1];

  const orderItems = [
    {
      productName: buyNowItem?.product?.name,
      price: selectedVariation?.discountPrice || 0,
      quantity: 1,
      image: buyNowItem?.product?.images?.[0],
      product: buyNowItem?.product?._id,
      priceVariationIndex: buyNowItem?.priceVariationIndex,
    },
  ];

  const handleSubmit = async (value: z.infer<typeof orderSchema>) => {
    if (!selectedVariation) {
      toast.error("Invalid product variation");
      return;
    }

    const productPrice =
      Number(selectedVariation.discountPrice) ||
      Number(selectedVariation.price) ||
      0;
    const totalPrice = productPrice;
    const shipping = Number(selectedShippingPrice) || 0;
    const totalAmount = productPrice + shipping;

    const data = {
      ...value,
      user: user?._id || "",
      paymentType: "Cash on delivery",
      orderItems,
      itemsPrice: totalPrice,
      shippingPrice: shipping,
      totalAmount: totalAmount,
    };

    try {
      await createOrder(data).unwrap();

      customEvent({
        event: "purchase",
        ecommerce: {
          currencyCode: "BDT",
          value: totalAmount,
          items: [
            {
              item_name: buyNowItem?.product?.name || "",
              price: productPrice,
              quantity: 1,
            },
          ],
           userData: {
          ...value,
        },
        },
      });

      await refetch();
    } catch (err) {
      console.error("Order creation failed:", err);
    }
  };

  const handleShippingChange = (shippingPrice: number) => {
    if (selectedVariation) {
      setSelectedShippingPrice(shippingPrice);
      const newTotal = selectedVariation.discountPrice + shippingPrice;
      setCalculatedAmount(newTotal);
    }
  };

  return (
    <Suspense fallback={<ComponentLoader />}>
      <div className="w-full mx-auto p-2">
        <div>
          <h1 className="text-2xl font-semibold">Checkout</h1>
          <Separator />
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-6 mt-6"
          >
            <div className="flex-1 bg-primary-foreground p-4 rounded-lg">
              <h2 className="mb-4 text-lg font-[500] text-secondary-foreground flex items-center gap-2">
                <Receipt size={18} /> Billing Details
              </h2>
              <div className="space-y-4">
                <FormField
                  name="fullName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-primary">আপনার নাম</Label>
                      <FormControl>
                        <Input placeholder="আপনার নাম লিখুন..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-primary">ইমেইল (Optional)</Label>
                      <FormControl>
                        <Input placeholder="আপনার ইমেইল লিখুন..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <FormField
                  name="phone"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-primary">মোবাইল নাম্বার</Label>
                      <FormControl>
                        <Input placeholder="আপনার ফোন নাম্বার দিন" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="address"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-primary">আপনার ঠিকানা</Label>
                      <FormControl>
                        <Input placeholder="আপনার ঠিকানা লিখুন" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="orderNots"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Label>অর্ডার নোট (Optional)</Label>
                      <Input placeholder="আপনার অর্ডার নোট লিখুন" {...field} />
                    </FormItem>
                  )}
                />
                <div>
                  <ShippingPriceSelection
                    form={form}
                    insideDhaka={buyNowItem?.product?.insideDhaka}
                    outsideDhaka={buyNowItem?.product?.outsideDhaka}
                    onShippingChange={handleShippingChange}
                  />
                </div>
              </div>
            </div>

            <div className="w-full bg-primary-foreground p-4 rounded-lg">
              <h2 className="mb-4 text-lg font-[500] text-secondary-foreground flex items-center gap-2">
                <ListOrdered size={18} /> Your Order
              </h2>
              <Suspense fallback={<ComponentLoader />}>
                <BuyNowOrder
                  minShippingPrice={selectedShippingPrice}
                  selectItem={orderItems}
                  totalPrice={selectedVariation?.discountPrice || 0}
                  totalAmount={calculatedAmount}
                  isLoading={isLoading}
                />
              </Suspense>
            </div>
          </form>
        </Form>
      </div>
    </Suspense>
  );
};

export default BuyNowCheckout;
