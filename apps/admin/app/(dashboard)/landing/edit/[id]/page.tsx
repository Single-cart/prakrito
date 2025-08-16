"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import FileUpload from "@/components/FileUpload";
import NavHeader from "@/components/nav-header";
import { customRevalidate } from "@/lib/fetch/customRevalidate";
import {
  useGetLandingByIdQuery,
  useUpdateLandingMutation,
} from "@/redux/features/landing/landingApi";
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
import { Switch } from "@workspace/ui/components/switch";
import { Textarea } from "@workspace/ui/components/textarea";

// Form schema
const formSchema = z.object({
  heading: z.string().min(2, {
    message: "Heading must be at least 2 characters.",
  }),
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

export default function EditLanding() {
  const router = useRouter();
  const params = useParams();

  const landingId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : "";

  const {
    data: landingData,
    isLoading: fetchLoading,
    isError,
  } = useGetLandingByIdQuery(landingId, {
    skip: !landingId,
  });

  const [updateLanding, { isLoading }] = useUpdateLandingMutation();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      heading: "",
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
    fileIds: string[],
  ) => {
    const currentValues = form.getValues(fieldName as any) || [];
    const newValues = fileIds.map((id) => ({ value: id }));
    form.setValue(fieldName as any, [...currentValues, ...newValues]);
  };

  const handleFileRemoved = (
    fieldName: keyof FormSchemaType,
    fileIdToRemove: string,
  ) => {
    const currentValues = form.getValues(fieldName as any) || [];
    form.setValue(
      fieldName as any,
      currentValues.filter((item: any) => item.value !== fileIdToRemove),
    );
  };

  useEffect(() => {
    if (landingData?.data) {
      const data = landingData.data;
      form.reset({
        heading: data.heading || "",
        name: data.name || "",
        phone: data.phone || "",
        youtubeLink: data.youtubeLink || "",
        youtubeLinks: data.youtubeLinks?.length
          ? data.youtubeLinks.map((link: string) => ({ value: link }))
          : [{ value: "" }],
        description: data.description || "",
        certificateTitle: data.certificateTitle || "",
        certificates: data.certificates?.length
          ? data.certificates.map((cert: any) => ({ value: cert._id || cert }))
          : [],
        heroBtnText: data.heroBtnText || "",
        offerTitle: data.offerTitle || "",
        offerDescription: data.offerDescription || "",
        reviews: data.reviews?.length
          ? data.reviews.map((review: any) => ({ value: review._id || review }))
          : [],
        productGallery: data.productGallery?.length
          ? data.productGallery.map((img: any) => ({ value: img._id || img }))
          : [],
        order: data.order || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      });
    }
  }, [landingData, form, form.reset]);

  async function onSubmit(values: FormSchemaType) {
    if (!landingId) return;

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

      const result = await updateLanding({
        id: landingId,
        body: filteredValues,
      }).unwrap();

      toast.success("Landing page updated successfully");
      await customRevalidate("Landing");
      if (result.success) {
        router.push("/landing");
      }
    } catch (error) {
      console.error("Failed to update landing page:", error);
      toast.error("Failed to update landing page");
    }
  }

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-6">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Failed to load landing page data. Please try again.</p>
            <Button className="mt-4" onClick={() => router.push("/landing")}>
              Return to Landing Pages
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <NavHeader
        bread={[
          { href: "/", text: "Dashboard", last: false },
          { href: "/landing", text: "Landing Pages", last: false },
          { href: `/landing/edit/${landingId}`, text: "Edit", last: true },
        ]}
      />

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Landing Page</CardTitle>
          <CardDescription>
            Update your landing page information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Landing page name" {...field} />
                    </FormControl>
                    <FormDescription>Name for the landing page</FormDescription>
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
                      <Input
                        placeholder="Enter hero button text"
                        {...field}
                      />
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
                        <Input
                          placeholder="Enter offer title"
                          {...field}
                        />
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
                  onFileRemoved={(fileId) => handleFileRemoved("reviews", fileId)}
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
                  Update Landing Page
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
