/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import NavHeader from "@/components/nav-header";
import {
  useGetOrderStatusQuery,
  useGetSingleOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/redux/features/orders/orderApi";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Separator } from "@workspace/ui/components/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Clock, CreditCard, FileText, Package } from "lucide-react";
import { revalidateTag } from "next/cache";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

const SingleOrder = () => {
  const params = useParams<{ id: string }>();
  const { data, refetch } = useGetSingleOrdersQuery(params.id);
  const { refetch: orderStatusRefetch } = useGetOrderStatusQuery({});
  const [updateOrderStatus, { isSuccess, error }] =
    useUpdateOrderStatusMutation();

  const handleChange = async (value: string) => {
    await updateOrderStatus({
      id: params.id,
      data: { orderStatus: value },
    });
    await revalidateTag("getAllProducts");
    await refetch();
    await orderStatusRefetch();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Order Status Updated");
    } else if (error) {
      const errorData = error as any;
      toast.error(errorData?.data?.message);
    }
  }, [error, isSuccess]);

  const getStatusColor = (status: string) => {
    const colors = {
      Pending: "bg-yellow-500",
      Processing: "bg-blue-500",
      Shipped: "bg-purple-500",
      Delivered: "bg-green-500",
      Cancelled: "bg-red-500",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  const bread = [
    {
      href: "/",
      text: "Dashboard",
      last: false,
    },
    {
      href: "/order",
      text: "Order",
      last: false,
    },
    {
      href: `/order/${params.id}`,
      text: "Order Details",
      last: true,
    },
  ];

  return (
    <div>
      <NavHeader bread={bread} />
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Order Management
          </h1>
          <Select onValueChange={handleChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Update Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {/* Order Details Card */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold">{data?.order?.orderId}</p>
                  </div>
                  <Badge
                    className={`${getStatusColor(data?.order?.orderStatus)}`}
                  >
                    {data?.order?.orderStatus}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="font-medium">
                        {new Date(data?.order?.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CreditCard className="h-4 w-4 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-medium">{data?.order?.paymentType}</p>
                    </div>
                  </div>
                </div>

                {data?.order?.orderNotes && (
                  <>
                    <Separator />
                    <div className="space-y-1.5">
                      <p className="text-sm text-gray-500">Order Notes</p>
                      <p className="text-sm bg-gray-50 p-3 rounded-lg">
                        {data?.order?.orderNotes}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information Card */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-500" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium bg-gray-50 p-2 rounded">
                      {data?.order?.shippingInfo?.fullName}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium bg-gray-50 p-2 rounded">
                      {data?.order?.shippingInfo?.phone}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-sm text-gray-500">Delivery Address</p>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                    <p className="font-medium">
                      {data?.order?.shippingInfo?.address}
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
                  <Package className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-700">Shipping Status</p>
                    <p className="text-sm text-blue-600">
                      {data?.order?.orderStatus === "Delivered"
                        ? "Package has been delivered"
                        : data?.order?.orderStatus === "Shipped"
                          ? "Package is on the way"
                          : "Preparing for shipment"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Items Table Card */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Info</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.order?.orderItems?.map((item: any) => (
                  <TableRow key={item?.product}>
                    <TableCell className="font-medium">
                      {item?.productName}{" "}
                      <span className="text-sm">x {item?.quantity}</span>
                    </TableCell>
                    <TableCell>{item?.size}</TableCell>
                    <TableCell>{item?.colors}</TableCell>
                    <TableCell className="text-right">
                      ${(parseInt(item?.price) * item?.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="font-semibold">
                    Subtotal
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ${data?.order?.itemsPrice.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="font-semibold">
                    Shipping
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {data?.order?.shippingPrice <= 0
                      ? "Free"
                      : `$${data?.order?.shippingPrice.toFixed(2)}`}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="font-semibold">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ${data?.order?.totalAmount.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SingleOrder;
