"use client";

import { customRevalidate } from "@/lib/fetch/customRevalidate";
import { useDeleteReviewMutation } from "@/redux/features/customerReview/customerReviewApi";
import { Button } from "@workspace/ui/components/button";
import { Trash2 } from "lucide-react";
import { FC, useEffect } from "react";
import toast from "react-hot-toast";
import { AlertPopup } from "./AlertPopup";

type Props = {
  id: string;
};

const ReviewDeleteBtn: FC<Props> = ({ id }) => {
  const [deleteReview, { isSuccess, isError }] = useDeleteReviewMutation();

  const handleCustomerReviewDelete = async (reviewId: string) => {
    await deleteReview(reviewId);
    await customRevalidate("customerReview");
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Customer review deleted successfully");
    } else if (isError) {
      toast.error("Failed to delete customer review");
      console.error(isError);
    }
  }, [isSuccess, isError]);

  return (
    <AlertPopup actionFunc={() => handleCustomerReviewDelete(id)}>
      <Button size={"icon"} className="bg-red-400">
        <Trash2 />
      </Button>
    </AlertPopup>
  );
};

export default ReviewDeleteBtn;
