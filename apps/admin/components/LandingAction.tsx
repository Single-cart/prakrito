"use client";

import { env } from "@/lib/env";
import {
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

import { customRevalidate } from "@/lib/fetch/customRevalidate";
import {
  useDeleteLandingMutation,
  useUpdateLandingMutation,
} from "@/redux/features/landing/landingApi";
import toast from "react-hot-toast";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LandingAction = ({ landing }: { landing: any }) => {
  const router = useRouter();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const [deleteLanding, { isLoading: isDeleting }] = useDeleteLandingMutation();
  const [updateLanding, { isLoading: isUpdating }] = useUpdateLandingMutation();

  const handleDelete = async () => {
    try {
      await deleteLanding(landing._id).unwrap();
      toast.success("The landing page has been deleted successfully");
      await customRevalidate("Landing");
      setShowDeleteAlert(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.success("Failed to delete landing page");
    }
  };

  const toggleActive = async () => {
    try {
      await updateLanding({
        id: landing._id,
        body: { isActive: !landing.isActive },
      }).unwrap();
      await customRevalidate("Landing");
      toast.success(
        `The landing page has been ${landing.isActive ? "deactivated" : "activated"} successfully`
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.success("Failed to update landing page status");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              window.open(
                `${env.NEXT_PUBLIC_CLIENT_URL}/landing/${landing._id}`,
                "_blank"
              )
            }
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Landing Page
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/landing/edit/${landing._id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleActive} disabled={isUpdating}>
            {landing.isActive ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Activate
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteAlert(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              landing page and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LandingAction;
