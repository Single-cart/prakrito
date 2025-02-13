"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { styles } from "@/app/styles";
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
import { cn } from "@workspace/ui/lib/utils";

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

const ByNowCheckout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const [selectedShippingPrice, setSelectedShippingPrice] = useState(0);

  const [createOrder, { isLoading, error, isError, isSuccess }] =
    useCreateOrderMutation();
  const { refetch } = useGetOrderStatusQuery({});
  const { user } = useAuth();
  const { buyNowItem } = useSelector((state: RootState) => state.cart);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cartBuyNowItem = buyNowItem as any;
  console.log(cartBuyNowItem);
  // const totalAmount =
  //   parseInt(buyNowItem?.price) + parseInt(buyNowItem?.shippingPrice);
  const orderItems = [
    {
      productName: cartBuyNowItem?.productName,
      price: parseInt(cartBuyNowItem?.price),
      quantity: cartBuyNowItem?.quantity,
      image: cartBuyNowItem?.image,
      product: cartBuyNowItem?.product,
      colors: cartBuyNowItem?.colors,
      size: cartBuyNowItem?.size,
    },
  ];

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
  });

  const handleSubmit = async (value: z.infer<typeof orderSchema>) => {
    if (cartBuyNowItem?.price) {
      const data = {
        ...value,
        user: user?._id ? user?._id : "",
        paymentType: "Cash on delivery",
        orderItems,
        itemsPrice: parseInt(cartBuyNowItem?.price),
        shippingPrice: selectedShippingPrice,
        totalAmount: calculatedAmount,
      };

      await createOrder(data);
      await refetch();
    } else {
      toast.error("Product select again");
    }
  };

  const handleShippingChange = (shippingPrice: number) => {
    if (cartBuyNowItem?.price) {
      const newTotal = parseInt(cartBuyNowItem.price) + shippingPrice;
      setCalculatedAmount(newTotal);
      setSelectedShippingPrice(shippingPrice);
    }
  };

  // useEffect(() => {
  //   if (cartBuyNowItem?.price && cartBuyNowItem?.shippingPrice) {
  //     const amount =
  //       parseInt(cartBuyNowItem.price) + parseInt(cartBuyNowItem.shippingPrice);
  //     setCalculatedAmount(amount);
  //   }
  // }, [cartBuyNowItem]);

  useEffect(() => {
    if (isSuccess) {
      const amount = calculatedAmount;
      toast.success("Order Placed successfully");
      router.replace(`/orderSuccess?amount=${amount}`);

      setTimeout(() => {
        return dispatch(clearBuyNow());
      }, 100);
    } else if (isError) {
      const errorData = error as { data: { message: string } };
      toast.error(errorData?.data?.message);
    }
  }, [dispatch, error, isError, isSuccess, router, calculatedAmount]);

  useEffect(() => {
    form.setValue("fullName", user?.fullName || "");
    form.setValue("email", user?.email || "");
    form.setValue("phone", user?.phone || "");
    form.setValue("address", user?.address || "");
    form.setValue("orderNots", "");
  }, [
    form,
    user?.address,
    user?.email,
    user?.fullName,
    cartBuyNowItem,
    user?.phone,
  ]);

  // lg:mt-[140px] mt-[80px]
  return (
    <div
      className={cn(
        styles.paddingX,
        styles.paddingY,
        " max-w-[1200px] w-full mx-auto"
      )}
    >
      <div className="">
        <h1 className={cn("text-3xl font-semibold")}>Checkout</h1>
        <Separator />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col lg:flex-row gap-10 mt-10"
        >
          <div className="flex-1 bg-primary-foreground p-4">
            <h2 className="mb-6 text-lg font-[500] text-secondary-foreground flex items-center gap-2">
              <Receipt size={20} /> Billing Details{" "}
            </h2>
            <div className="space-y-4">
              <FormField
                name="fullName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-primary">Full Name</Label>
                    <FormControl>
                      <Input
                        // disabled={isLoading}
                        placeholder="Enter Your Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-primary">Email (Optional)</Label>
                    <FormControl>
                      <Input
                        // disabled={isLoading}
                        placeholder="Enter Your Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="phone"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-primary">Phone Number</Label>
                    <FormControl>
                      <Input
                        // disabled={isLoading}
                        placeholder="Enter Your Phone Number"
                        {...field}
                      />
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
                    <Label className="text-primary">Address</Label>
                    <FormControl>
                      <Input
                        // disabled={isLoading}
                        placeholder="Enter Your Full Address"
                        {...field}
                      />
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
                    <Label>Order Nots (Optional)</Label>
                    <Input placeholder="Enter Your Order Nots" {...field} />
                  </FormItem>
                )}
              />

              <div className="">
                <ShippingPriceSelection
                  form={form}
                  insideDhaka={cartBuyNowItem?.insideDhaka}
                  outsideDhaka={cartBuyNowItem?.outsideDhaka}
                  onShippingChange={handleShippingChange}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 bg-primary-foreground p-4">
            <h2 className="mb-6 text-lg font-[500] text-secondary-foreground flex items-center gap-2">
              <ListOrdered size={20} /> Your Order{" "}
            </h2>
            <Suspense fallback={<ComponentLoader />}>
              <BuyNowOrder
                minShippingPrice={selectedShippingPrice}
                selectItem={orderItems}
                totalPrice={cartBuyNowItem?.price}
                totalAmount={calculatedAmount}
                isLoading={isLoading}
              />
            </Suspense>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ByNowCheckout;
