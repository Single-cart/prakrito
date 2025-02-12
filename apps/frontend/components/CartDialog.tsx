"use client";

import { env } from "@/lib/env";
import {
  useAddToCartMutation,
  useGetCartItemQuery,
  useTotalPriceQuery,
} from "@/redux/features/cart/cartApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { cartZodSchema, product } from "@workspace/shared/index";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { LoadingButton } from "./LoaderButton";

export function CartDialog({
  product,
  btnFull,
}: {
  product: product.IProductRes;
  btnFull: string;
}) {
  const { refetch } = useGetCartItemQuery({});
  const { refetch: totalPriceRefetch } = useTotalPriceQuery({});

  const availableColors = product?.colors?.filter(
    (color) => color?.stock === true
  );
  const availableSize = product?.size?.filter(
    (item) => item?.available === true
  );
  const productImg = `${env.NEXT_PUBLIC_SERVER_URL}/${product?.images[0]}`;

  const [addToCart, { isLoading, isSuccess, error, isError }] =
    useAddToCartMutation();

  const handleSubmit = async (
    value: z.infer<typeof cartZodSchema.CartFormSchema>
  ) => {
    if (product?.stock > 0) {
      await addToCart({
        productId: product._id,
        size: value?.size,
        colors: value?.colors,
      });
      await refetch();
      await totalPriceRefetch();
    } else {
      toast.error("Product Out of stock");
    }
  };

  const form = useForm<z.infer<typeof cartZodSchema.CartFormSchema>>({
    resolver: zodResolver(cartZodSchema.CartFormSchema),
    defaultValues: {
      colors: "",
      size: "",
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Product Add To Cart");
    } else if (isError) {
      const errorData = error as { data: { message: string } };
      toast.error(errorData?.data?.message);
    }
  }, [error, isError, isSuccess]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={product?.stock <= 0}
          className="hover:bg-[#000000a2] transition-all"
        >
          Add To Cart
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center border-b pb-2">
            Size & Colors
          </DialogTitle>
          {/* Removed DialogDescription wrapper since we don't need the <p> tag */}
          <div className="mt-4">
            <div className="flex items-center gap-3 text-primary">
              <Image
                src={productImg}
                alt={product?.name}
                width={60}
                height={60}
              />
              <span className="text-lg font-medium">{product?.name}</span>
            </div>
          </div>
        </DialogHeader>

        <div className="max-w-[700px] w-full mx-auto">
          <Form {...form}>
            <form
              encType="multipart/form-data"
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-3"
            >
              <FormField
                name="colors"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colors</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Colors" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableColors?.map((item) => (
                          <SelectItem key={item?.name} value={item?.name}>
                            {item?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="size"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableSize &&
                          availableSize?.map((item) => (
                            <SelectItem key={item?.name} value={item?.name}>
                              {item?.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full pt-3">
                {isLoading ? (
                  <LoadingButton className={btnFull} />
                ) : (
                  <Button size="sm" className="w-full" type="submit">
                    Add To Cart
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
