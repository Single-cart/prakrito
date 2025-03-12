"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  order: z.coerce.number().int().nonnegative(),
  isActive: z.boolean().default(true),
});

export default function EditLanding() {
  const router = useRouter();
  const params = useParams();
  // Convert params.id to string if it's not already
  const landingId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : "";
  const [formKey, setFormKey] = useState(0); // Add a key to force re-render when needed

  const {
    data: landingData,
    isLoading: fetchLoading,
    isError,
  } = useGetLandingByIdQuery(landingId, {
    skip: !landingId,
  });

  const [updateLanding, { isLoading }] = useUpdateLandingMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      heading: "",
      name: "",
      phone: "",
      order: 0,
      isActive: true,
    },
  });

  // Update form when data is fetched
  useEffect(() => {
    if (landingData?.data) {
      form.reset({
        heading: landingData.data.heading || "",
        name: landingData.data.name || "",
        phone: landingData.data.phone || "",
        order: landingData.data.order || 0,
        isActive:
          landingData.data.isActive !== undefined
            ? landingData.data.isActive
            : true,
      });
      // Force re-render after form reset
      setFormKey((prev) => prev + 1);
    }
  }, [landingData, form]);

  // Form submission handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!landingId) return;

    try {
      const result = await updateLanding({
        id: landingId,
        body: values,
      }).unwrap();
      await customRevalidate("Landing");
      if (result.success) {
        router.push("/landing");
      }
    } catch (error) {
      console.error("Failed to update landing page:", error);
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
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Landing Page</CardTitle>
          <CardDescription>
            Update your landing page information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form} key={formKey}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
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
