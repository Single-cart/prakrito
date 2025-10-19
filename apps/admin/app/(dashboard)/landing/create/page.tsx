/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Loader2, Plus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { Textarea } from "@workspace/ui/components/textarea";
import { cn } from "@workspace/ui/lib/utils";

import FileUpload from "@/components/FileUpload";
import NavHeader from "@/components/nav-header";
import { customRevalidate } from "@/lib/fetch/customRevalidate";
import { getImgUrl } from "@/lib/getImgPath";
import { useCreateLandingMutation } from "@/redux/features/landing/landingApi";
import { useGetAllProductsAdminQuery } from "@/redux/features/product/productApi";

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
  youtubeLinks: z.array(z.object({ value: z.string() })).optional(),
  description: z.string().optional(),
  certificateTitle: z.string().optional(),
  certificates: z.array(z.object({ value: z.string() })).optional(),
  heroBtnText: z.string().optional(),
  offerTitle: z.string().optional(),
  offerDescription: z.string().optional(),
  reviews: z.array(z.object({ value: z.string() })).optional(),
  productGallery: z.array(z.object({ value: z.string() })).optional(),
  order: z.coerce.number().int().nonnegative(),
  isActive: z.boolean().default(true),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function CreateLanding() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: productsData,
    isLoading: productsLoading,
    refetch,
  } = useGetAllProductsAdminQuery(
    { search: searchTerm },
    {
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }
  );

  const [createLanding, { isLoading }] = useCreateLandingMutation();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      heading: "",
      product: undefined,
      name: "",
      phone: "",
      youtubeLink: "",
      youtubeLinks: [{ value: "" }],
      description: "",
      certificateTitle: "",
      certificates: [],
      heroBtnText: "",
      offerTitle: "",
      offerDescription: "",
      reviews: [],
      productGallery: [],
      order: 0,
      isActive: true,
    },
  });

  const youtubeFields = useFieldArray({
    control: form.control,
    name: "youtubeLinks",
  });

  const handleUploadComplete = (
    fieldName: keyof FormSchemaType,
    fileIds: string[]
  ) => {
    const currentValues = form.getValues(fieldName as any) || [];
    const newValues = fileIds.map((id) => ({ value: id }));
    form.setValue(fieldName as any, [...currentValues, ...newValues]);
  };

  const handleFileRemoved = (
    fieldName: keyof FormSchemaType,
    fileIdToRemove: string
  ) => {
    const currentValues = form.getValues(fieldName as any) || [];
    form.setValue(
      fieldName as any,
      currentValues.filter((item: any) => item.value !== fileIdToRemove)
    );
  };

  async function onSubmit(values: FormSchemaType) {
    try {
      const filteredValues = {
        ...values,
        youtubeLinks: values.youtubeLinks
          ?.map((link) => link.value)
          .filter((link) => link.trim() !== ""),
        certificates: values.certificates?.map((cert) => cert.value),
        reviews: values.reviews?.map((review) => review.value),
        productGallery: values.productGallery?.map((img) => img.value),
      };

      await createLanding(filteredValues).unwrap();
      toast.success("Landing page created successfully");
      await customRevalidate("Landing");
      router.push("/landing");
    } catch (error) {
      console.error("Failed to create landing page:", error);
      toast.error("Failed to create landing page");
    }
  }

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

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter landing page description"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Detailed description for your landing page
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <FormField
                control={form.control}
                name="heroBtnText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Button Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter hero button text" {...field} />
                    </FormControl>
                    <FormDescription>
                      Text for the main call-to-action button
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <div className="space-y-3">
                <FormLabel>Additional YouTube Links</FormLabel>
                {youtubeFields.fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`youtubeLinks.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input
                              placeholder="Enter YouTube video URL"
                              {...field}
                            />
                          </FormControl>
                          {youtubeFields.fields.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => youtubeFields.remove(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => youtubeFields.append({ value: "" })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add YouTube Link
                </Button>
              </div>

              <div className="space-y-6 p-4 rounded-lg border">
                <h3 className="text-lg font-medium">Certificates</h3>

                <FormField
                  control={form.control}
                  name="certificateTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certificate Section Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter certificate section title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FileUpload
                  onUploadComplete={(fileIds) =>
                    handleUploadComplete("certificates", fileIds)
                  }
                  purpose="landing"
                  maxFiles={10}
                  label="Upload Certificate Images"
                  description="Upload certificate images for this landing page"
                  displayFileIds={
                    form.watch("certificates")?.map((c: any) => c.value) || []
                  }
                  onFileRemoved={(fileId) =>
                    handleFileRemoved("certificates", fileId)
                  }
                />
              </div>

              <div className="space-y-6 p-4 rounded-lg border">
                <h3 className="text-lg font-medium">What We Offer</h3>

                <FormField
                  control={form.control}
                  name="offerTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Offer Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter offer title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="offerDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Offer Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter offer description"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-3">
                <FormLabel>Reviews</FormLabel>
                <FileUpload
                  onUploadComplete={(fileIds) =>
                    handleUploadComplete("reviews", fileIds)
                  }
                  purpose="landing"
                  maxFiles={10}
                  label="Upload Review Images"
                  description="Upload review images for this landing page"
                  displayFileIds={
                    form.watch("reviews")?.map((r: any) => r.value) || []
                  }
                  onFileRemoved={(fileId) =>
                    handleFileRemoved("reviews", fileId)
                  }
                />
              </div>

              <div className="space-y-3">
                <FormLabel>Product Gallery</FormLabel>
                <FileUpload
                  onUploadComplete={(fileIds) =>
                    handleUploadComplete("productGallery", fileIds)
                  }
                  purpose="landing"
                  maxFiles={10}
                  label="Upload Product Gallery Images"
                  description="Upload product gallery images for this landing page"
                  displayFileIds={
                    form.watch("productGallery")?.map((p: any) => p.value) || []
                  }
                  onFileRemoved={(fileId) =>
                    handleFileRemoved("productGallery", fileId)
                  }
                />
              </div>

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
