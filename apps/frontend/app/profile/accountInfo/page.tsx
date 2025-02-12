"use client";

import ComponentLoader from "@/components/ComponentLoader";
import { LoadingButton } from "@/components/LoaderButton";
import { useAuth } from "@/hooks/useAuth";
import { env } from "@/lib/env";
import {
  useUpdateProfileMutation,
  useUpdateUserInfoMutation,
} from "@/redux/features/users/usersApi";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";
import { Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AccountInfo = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const [updateProfile, { isSuccess, error, isLoading, data }] =
    useUpdateProfileMutation();
  const [
    updateUserInfo,
    { isSuccess: nameIsSuccess, isLoading: nameIsLoading, data: nameData },
  ] = useUpdateUserInfoMutation();

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const avatar = e.target.files?.[0];
    if (!avatar) return;

    const formData = new FormData();
    formData.append("avatar", avatar);
    updateProfile(formData);
  };

  const handleName = async () => {
    if (!fullName && !phone && !address) return;
    await updateUserInfo({
      fullName: fullName || undefined,
      phone: phone || undefined,
      address: address || undefined,
    });
  };

  useEffect(() => {
    if (nameIsSuccess) {
      toast.success(nameData?.message);
    }
  }, [nameData, nameIsSuccess]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message);
    }
    if (error) {
      const errorData = error as { data: { message: string } };
      toast.error(errorData.data?.message);
    }
  }, [data, error, isSuccess]);

  useEffect(() => {
    setIsMounted(true);

    setFullName(user?.fullName || "");
    setPhone(user?.phone || "");
    setAddress(user?.address || "");
  }, [user?.fullName, user?.phone, user?.address]);

  if (!isMounted) {
    return <ComponentLoader />;
  }

  const avatar = user?.avatar?.includes("googleusercontent")
    ? user?.avatar
    : user?.avatar
      ? `${env.NEXT_PUBLIC_SERVER_URL}/${user.avatar}`
      : "/default-avater.jpg";

  return (
    <div>
      <Card className="max-w-[500px] mx-auto mt-[140px]">
        <CardHeader className="w-full flex justify-center">
          <div className="relative">
            <Image
              className={cn(
                "rounded-full m-auto w-[110px] h-[110px] object-cover",
                isLoading ? "blur-md" : ""
              )}
              src={avatar}
              alt="profile avatar"
              height={110}
              width={110}
            />
            <Loader2
              className={cn(
                `absolute inset-0 m-auto h-10 w-10 animate-spin`,
                isLoading ? "block" : "hidden"
              )}
            />
            <Input
              className="hidden"
              name="avatar"
              id="avatar"
              onChange={handleImage}
              type="file"
              disabled={isLoading}
              accept="image/jpeg,image/jpg,image/png,image/webp"
            />
            <Label
              htmlFor="avatar"
              className="absolute bottom-0 left-[50%] bg-secondary rounded-full p-1 mx-auto cursor-pointer"
            >
              <Camera className="z-20 h-[30px] w-[30px] rounded-full" />
            </Label>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              disabled={nameIsLoading}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input value={user?.email || ""} readOnly disabled />
          </div>
          <div className="space-y-1">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={phone}
              disabled={nameIsLoading}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              disabled={nameIsLoading}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          {nameIsLoading ? (
            <LoadingButton className="w-auto" />
          ) : (
            <Button onClick={handleName}>Save changes</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AccountInfo;
