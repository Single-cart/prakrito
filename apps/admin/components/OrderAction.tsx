"use client";

import { AlertPopup } from "@/components/AlertPopup";
import {
  useDeleteOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderStatusQuery,
} from "@/redux/features/orders/orderApi";
import { Button } from "@workspace/ui/components/button";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { FC, useCallback } from "react";
import toast from "react-hot-toast";

type Props = {
  id: string;
};

const OrderAction: FC<Props> = ({ id }) => {
  const [deleteOrder, { isLoading }] = useDeleteOrderMutation();
  const { refetch: refetchAllOrders } = useGetAllOrdersQuery({});
  const { refetch: refetchOrderStatus } = useGetOrderStatusQuery({});

  const handleDeleteOrder = useCallback(async () => {
    try {
      await deleteOrder({ id }).unwrap();
      toast.success("Order deleted successfully");
      await refetchAllOrders();
      await refetchOrderStatus();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error?.data?.message || "Failed to delete order");
    }
  }, [deleteOrder, id, refetchAllOrders, refetchOrderStatus]);

  return (
    <div className="flex items-center gap-6">
      <Link href={`/order/${id}`}>
        <Button size="icon" variant="outline">
          <Edit size={20} />
        </Button>
      </Link>
      <AlertPopup actionFunc={handleDeleteOrder}>
        <Button disabled={isLoading} size="icon" variant="outline">
          <Trash2 className="text-red-500" size={20} />
        </Button>
      </AlertPopup>
    </div>
  );
};

export default OrderAction;
