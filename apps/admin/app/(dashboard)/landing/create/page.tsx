/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Switch } from "@workspace/ui/components/switch";
import { cn } from "@workspace/ui/lib/utils";

import NavHeader from "@/components/nav-header";
import { customRevalidate } from "@/lib/fetch/customRevalidate";
import { getImgUrl } from "@/lib/getImgPath";
import { useCreateLandingMutation } from "@/redux/features/landing/landingApi";
import { useGetAllProductsQuery } from "@/redux/features/product/productApi";

// Form schema
const formSchema = z.object({
  heading: z.string().min(2, {
    message: "Heading must be at least 2 characters.",
  }),
  product: z.string().optional(),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  youtubeLink: z.string().optional(),
  order: z.coerce.number().int().nonnegative(),
  isActive: z.boolean().default(true),
});

export default function CreateLanding() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Get products for the dropdown
  const {
    data: productsData,
    isLoading: productsLoading,
    refetch,
  } = useGetAllProductsQuery(
    { search: searchTerm },
    {
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }
  );
  console.log("productsData", productsData);
  // Create landing mutation
  const [createLanding, { isLoading }] = useCreateLandingMutation();

  // Form definition
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      heading: "",
      product: undefined,
      name: "",
      phone: "",
      youtubeLink: "",
      order: 0,
      isActive: true,
    },
  });

  // Form submission handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createLanding(values).unwrap();
      await customRevalidate("Landing");
      router.push("/landing");
    } catch (error) {
      console.error("Failed to create landing page:", error);
    }
  }

  // Breadcrumb navigation
  const bread = [
    {
      href: "/",
      text: "Dashboard",
      last: false,
    },
    {
      href: "/landing",
      text: "Landing Pages",
      last: false,
    },
    {
      href: "/landing/create",
      text: "Create",
      last: true,
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <NavHeader bread={bread} />

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create Landing Page</CardTitle>
          <CardDescription>
            Create a new landing page for your product promotion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter landing page name"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Name for landing page</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Heading */}
                <FormField
                  control={form.control}
                  name="heading"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heading</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter landing page heading"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The main heading for your landing page
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Product Selector */}
              <FormField
                control={form.control}
                name="product"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Product</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className={cn(
                              "justify-between h-auto py-3",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value && productsData?.data ? (
                              <div className="flex items-center gap-2">
                                {productsData?.data?.products?.find(
                                  (product: any) => product._id === field.value
                                )?.images?.length > 0 && (
                                  <div className="relative w-8 h-8 rounded overflow-hidden">
                                    <Image
                                      src={
                                        getImgUrl(
                                          productsData?.data?.products.find(
                                            (product: any) =>
                                              product._id === field.value
                                          )?.images?.[0]
                                        ) || ""
                                      }
                                      alt="Product thumbnail"
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <span>
                                  {
                                    productsData?.data?.products.find(
                                      (product: any) =>
                                        product._id === field.value
                                    )?.name
                                  }
                                </span>
                              </div>
                            ) : (
                              "Select a product"
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <div className="max-h-[300px] overflow-y-auto">
                          <div className="p-2">
                            <Input
                              placeholder="Search products..."
                              className="mb-2"
                              value={searchTerm}
                              onChange={(e) => {
                                const value = e.target.value;
                                setSearchTerm(value);
                                // Only trigger search when at least 2 characters are entered
                                // or when the search field is cleared
                                if (value.length >= 2 || value.length === 0) {
                                  refetch();
                                }
                              }}
                            />
                          </div>

                          {productsLoading ? (
                            <div className="flex items-center justify-center p-4">
                              <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                          ) : !productsData?.data?.products ||
                            productsData.data.products.length === 0 ? (
                            <div className="py-6 text-center text-sm">
                              No products found.
                            </div>
                          ) : (
                            <div>
                              {Array.isArray(productsData.data.products) &&
                                productsData.data.products.map(
                                  (product: any) => (
                                    <div
                                      key={product._id}
                                      className={cn(
                                        "flex items-center gap-2 py-2 px-3 cursor-pointer hover:bg-accent",
                                        field.value === product._id &&
                                          "bg-accent"
                                      )}
                                      onClick={() => {
                                        form.setValue("product", product._id);
                                        setOpen(false);
                                      }}
                                    >
                                      {product.images &&
                                        Array.isArray(product.images) &&
                                        product.images.length > 0 && (
                                          <div className="relative w-8 h-8 rounded overflow-hidden">
                                            <Image
                                              src={getImgUrl(product.images[0])}
                                              alt={product.name}
                                              fill
                                              className="object-cover"
                                            />
                                          </div>
                                        )}
                                      <span>{product.name}</span>

                                      {field.value === product._id && (
                                        <Check className="ml-auto h-4 w-4" />
                                      )}
                                    </div>
                                  )
                                )}
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select the product this landing page will promote
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order */}
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormDescription>
                        Order in which this landing page appears (0 = first)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Phone number for contact information
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* YouTube Link */}
              <FormField
                control={form.control}
                name="youtubeLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube Link (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="Enter YouTube video URL"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Add a YouTube video to your landing page
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Active Status */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Enable or disable this landing page
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/landing")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Landing Page
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
