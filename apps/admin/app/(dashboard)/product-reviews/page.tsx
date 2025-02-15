"use client";

import Ratings from "@/components/Ratings";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Separator } from "@workspace/ui/components/separator";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Tooltip, TooltipTrigger } from "@workspace/ui/components/tooltip";

import {
  useDeleteReviewMutation,
  useGetAllProductReviewsQuery,
  useUpdateReviewStatusMutation,
} from "@/redux/features/reviews/reviewApi";
import { CheckCircle2, MoreVertical, Trash2, XCircle } from "lucide-react";
import Image from "next/image";

import NavHeader from "@/components/nav-header";
import { customRevalidate } from "@/lib/fetch/customRevalidate";
import { getImgUrl } from "@/lib/getImgPath";
import { reviews } from "@workspace/shared/index";
import { useEffect } from "react";
import toast from "react-hot-toast";

const ProductReviews = () => {
  const { data, isLoading } = useGetAllProductReviewsQuery({});
  const [updateReviewStatus, { isSuccess, error }] =
    useUpdateReviewStatusMutation();
  const [deleteReview, { isSuccess: deleteIsSuccess, error: deleteError }] =
    useDeleteReviewMutation();
  const productReviews = data?.data?.productsReviews as reviews.IManageReview[];

  const handleStatusChange = async (
    approved: boolean,
    reviewId: string,
    productId: string
  ) => {
    try {
      await updateReviewStatus({
        data: { productId, reviewId, approved },
      });
      await customRevalidate("getSingleProduct");
      await customRevalidate("getAllProducts");
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const handleDelete = async (reviewId: string, productId: string) => {
    try {
      await deleteReview({ reviewId, productId });
      await customRevalidate("getSingleProduct");
      await customRevalidate("getAllProducts");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Review status successfull");
    } else if (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorData = error as any;
      toast.error(errorData?.data?.message);
    }
  }, [error, isSuccess]);

  useEffect(() => {
    if (deleteIsSuccess) {
      toast.success("Review delete successfull");
    } else if (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorData = deleteError as any;

      toast.error(errorData?.data?.message);
    }
  }, [deleteError, deleteIsSuccess, error]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[100px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  const bread = [
    {
      href: "/",
      text: "Dashboard",
      last: false,
    },
    {
      href: "/product-reviews",
      text: "Product Reviews",
      last: true,
    },
  ];

  return (
    <div className="">
      <NavHeader bread={bread} />
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Product Reviews Management</h1>
        </div>

        <Separator />

        <div className="space-y-6">
          {productReviews?.map((product) => (
            <Card key={product._id}>
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center justify-between">
                  <span>{product.productName}</span>
                  <Badge variant="outline" className="text-sm">
                    Product ID: {product.productId}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">User</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product.reviews.map((review) => (
                      <TableRow key={review._id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <Image
                              className="rounded-full"
                              src={
                                review.avatar
                                  ? getImgUrl(review.avatar)
                                  : "/default-avatar.jpg"
                              }
                              alt={review.fullName}
                              width={40}
                              height={40}
                            />
                            <div>
                              <p className="font-medium">{review.fullName}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(
                                  review.createdOn
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Ratings
                            numOfRating={review.rating}
                            size="16px"
                            space="2px"
                          />
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {review.comment}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              review.approved ? "default" : "destructive"
                            }
                            className="gap-1"
                          >
                            {review.approved ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            {review.approved ? "Approved" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <DropdownMenu>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                </TooltipTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(
                                        true,
                                        review._id,
                                        product.productId
                                      )
                                    }
                                  >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(
                                        false,
                                        review._id,
                                        product.productId
                                      )
                                    }
                                  >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </Tooltip>
                            </DropdownMenu>

                            <AlertDialog>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </AlertDialogTrigger>
                                </TooltipTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Confirm Deletion
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this
                                      review? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDelete(
                                          review._id,
                                          product.productId
                                        )
                                      }
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </Tooltip>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
