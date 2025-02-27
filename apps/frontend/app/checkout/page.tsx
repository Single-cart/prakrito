/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { styles } from "@/app/styles";
import ComponentLoader from "@/components/ComponentLoader";
import Orders from "@/components/Orders";
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

import { customEvent } from "@/components/gtm/customEvent";
import PageViewTracker from "@/components/gtm/PageViewTracker";
import ShippingPriceSelection from "@/components/ShippingPrice";
import { useAuth } from "@/hooks/useAuth";
import {
  useGetCartItemQuery,
  useTotalPriceQuery,
} from "@/redux/features/cart/cartApi";
import { clearCart } from "@/redux/features/cart/cartSlice";
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
  shippingLocation: z.enum(["inside", "outside"], {
    required_error: "Please select a delivery location",
  }),
  orderNots: z.string().optional(),
});

const Checkout = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { refetch } = useGetCartItemQuery({});
  const { refetch: orderStatusRefetch } = useGetOrderStatusQuery({});
  const [selectedShippingPrice, setSelectedShippingPrice] = useState(0);
  const [calculatedAmount, setCalculatedAmount] = useState(0);

  useTotalPriceQuery({});
  const [createOrder, { isLoading, error, isError, isSuccess }] =
    useCreateOrderMutation();
  const { user } = useAuth();
  const { allCartProducts, totalPrice } = useSelector(
    (state: RootState) => state.cart
  );
  const totalPriceData = totalPrice as any;

  const selectItem = allCartProducts?.cartItem?.filter(
    (item: any) => item?.selected === true
  );

  //find lowest shipping charge

  const minInsideDhakaPrice = selectItem?.reduce((min, item) => {
    const insidePrice = parseInt(item?.product?.insideDhaka) || Infinity;
    return insidePrice < min ? insidePrice : min;
  }, Infinity);

  const minOutsideDhakaPrice = selectItem?.reduce((min, item) => {
    const outsidePrice = parseInt(item?.product?.outsideDhaka) || Infinity;
    return outsidePrice < min ? outsidePrice : min;
  }, Infinity);

  // If no valid prices found, default to 0
  const finalInsidePrice =
    minInsideDhakaPrice === Infinity ? 0 : minInsideDhakaPrice;
  const finalOutsidePrice =
    minOutsideDhakaPrice === Infinity ? 0 : minOutsideDhakaPrice;

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      orderNots: "",
      shippingLocation: "outside",
    },
  });

  const orderItems = selectItem?.map((item: any) => ({
    productName: item?.product?.name,
    price: item?.discountPrice,
    quantity: item?.quantity,
    image: item?.product?.image,
    product: item?.productId,
    colors: item?.colors,
    size: item?.size,
    _id: item?._id,
  }));

  const handleSubmit = async (value: z.infer<typeof orderSchema>) => {
    const data = {
      ...value,
      user: user?._id ? user?._id : "",
      paymentType: "Cash on delivery",
      orderItems,
      itemsPrice: totalPriceData?.totalDiscountPrice,
      shippingPrice: selectedShippingPrice,
      totalAmount: calculatedAmount,
    };

    await createOrder(data);

    customEvent({
      event: "purchase",
      ecommerce: {
        currencyCode: "BDT",
        value: calculatedAmount,
        items: orderItems.map((item: any) => ({
          item_name: item.productName,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    });

    await orderStatusRefetch();
    await refetch();
  };

  useEffect(() => {
    // Set initial shipping price to outside Dhaka by default
    const initialShippingPrice = finalOutsidePrice;
    setSelectedShippingPrice(initialShippingPrice);

    // Calculate initial total amount
    if (totalPriceData?.totalDiscountPrice) {
      const initialTotal =
        totalPriceData.totalDiscountPrice + initialShippingPrice;
      setCalculatedAmount(initialTotal);
    }
  }, [finalOutsidePrice, totalPriceData?.totalDiscountPrice]);

  const handleShippingChange = (shippingPrice: number) => {
    if (totalPriceData?.totalDiscountPrice) {
      const newTotal = totalPriceData.totalDiscountPrice + shippingPrice;
      setCalculatedAmount(newTotal);
      setSelectedShippingPrice(shippingPrice);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Order successfully plased");
      router.replace("/orderSuccess");
      dispatch(clearCart());
    } else if (isError) {
      const errroData = error as any;
      toast.error(errroData?.data?.message);
    }
  }, [dispatch, error, isError, isSuccess, refetch, router]);

  useEffect(() => {
    form.setValue("fullName", user?.fullName || "");
    form.setValue("email", user?.email || "");
    form.setValue("phone", user?.phone || "");
    form.setValue("address", user?.address || "");
    form.setValue("orderNots", "");
  }, [form, user?.address, user?.email, user?.fullName, user?.phone]);

  // lg:mt-[140px] mt-[80px]
  return (
    <Suspense fallback={<ComponentLoader />}>
      <PageViewTracker
        event="initiate_checkout"
        pageData={{
          title: "Checkout",
          type: "checkout",
        }}
        productData={orderItems}
      />
      <div className={cn(styles.paddingX, styles.paddingY, " w-full mx-auto")}>
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
                    insideDhaka={finalInsidePrice}
                    outsideDhaka={finalOutsidePrice}
                    onShippingChange={handleShippingChange}
                    // initialPrice={selectedShippingPrice}
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 bg-primary-foreground p-4">
              <h2 className="mb-6 text-lg font-[500] text-secondary-foreground flex items-center gap-2">
                <ListOrdered size={20} /> Your Order{" "}
              </h2>
              <Suspense fallback={<ComponentLoader />}>
                <Orders
                  minShippingPrice={selectedShippingPrice}
                  selectItem={selectItem}
                  totalPrice={totalPrice}
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

export default Checkout;
