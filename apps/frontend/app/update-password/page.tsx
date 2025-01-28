"use client";

import { LoadingButton } from "@/components/LoaderButton";
import { useUpdateUserPasswordMutation } from "@/redux/features/users/usersApi";
import { zodResolver } from "@hookform/resolvers/zod";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const changePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(1, "Old Password required")
    .min(6, "Password should be at least 6 characters"),
  newPassword: z
    .string()
    .min(1, "New Password Required")
    .min(6, "Password should be at least 6 characters"),
});

const UpdatePassword = () => {
  const router = useRouter();

  const [updateUserPassword, { isSuccess, error, isLoading }] =
    useUpdateUserPasswordMutation();

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const onSubmitPassword = async (
    data: z.infer<typeof changePasswordSchema>
  ) => {
    await updateUserPassword({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("password update successfull");
      form.reset();
      router.push("/profile");
    }
    if (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorData = error as any;
      toast.error(errorData.data.message);
    }
  }, [error, form, isSuccess, router]);

  return (
    <div>
      <Card className="max-w-[500px] mx-auto mt-[140px]">
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Change your password here. After saving, you&apos;ll be logged out.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitPassword)}>
              <div className="mb-3">
                <FormField
                  name="oldPassword"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">
                        Old Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your old password"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                name="newPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">New Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter New Password"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-7">
                {isLoading ? (
                  <LoadingButton className="w-auto" btnText="saving" />
                ) : (
                  <Button type="submit">Save Password</Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePassword;
