"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { KeySquare, LogOut, UserCog, WalletCards } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [logout, { isSuccess }] = useLogoutMutation();

  const handleLogout = async () => {
    if (isAuthenticated) {
      await logout();
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Logout successfull");
      router.replace("/");
    }
  }, [isSuccess, router]);

  return (
    <ProtectedRoute allowedRoles={["user", "admin"]}>
      <Card className="max-w-[500px] mx-auto mt-[140px]">
        <CardHeader>
          <CardTitle>Manage Your Profile</CardTitle>

          <CardDescription>
            Update Your profile picture and change your name, phone number and
            address{" "}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between border border-purple-200 px-2 py-3 rounded-md">
            <h1 className="font-semibold">Your Account Info</h1>
            <Link href={"/profile/accountInfo"}>
              <Button>
                <UserCog />{" "}
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between border border-purple-200 px-2 py-3 rounded-md">
            <h1 className="font-semibold">Your All Orders</h1>
            <Link href={"/profile/order-history"}>
              <Button>
                <WalletCards />{" "}
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between border border-purple-200 px-2 py-3 rounded-md">
            <h1 className="font-semibold">Update Your Password</h1>
            <Link href={"/update-password"}>
              <Button>
                <KeySquare />
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-between border border-purple-200 px-2 py-3 rounded-md">
            <h1 className="font-semibold">Logout account</h1>
            <Button variant={"destructive"} onClick={handleLogout}>
              <LogOut />
            </Button>
          </div>
        </CardContent>
      </Card>
    </ProtectedRoute>
  );
}
