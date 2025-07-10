/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import NavHeader from "@/components/nav-header";
import { getImgUrl } from "@/lib/getImgPath";
import {
  useGetOrderStatusQuery,
  useGetSingleOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/redux/features/orders/orderApi";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
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
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  Package,
  Shield,
  XCircle,
} from "lucide-react";
import { revalidateTag } from "next/cache";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

const SingleOrder = () => {
  const params = useParams<{ id: string }>();
  const { data, refetch } = useGetSingleOrdersQuery(params.id);
  const { refetch: orderStatusRefetch } = useGetOrderStatusQuery({});
  const [updateOrderStatus, { isSuccess, error }] =
    useUpdateOrderStatusMutation();

  // Get risk assessment data from the order API response
  const riskAssessment = data?.riskAssessment;
  const riskHistory = riskAssessment?.history;

  // Refresh order data to get updated risk assessment
  const handleRefreshRiskAssessment = async () => {
    await refetch();
    toast.success("Risk assessment refreshed");
  };

  const handleChange = async (value: string) => {
    await updateOrderStatus({
      id: params.id,
      data: { orderStatus: value },
    });

    // Refresh data to get updated risk assessment
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

  const getRiskLevelColor = (level: string) => {
    const colors = {
      LOW: "bg-green-500",
      MEDIUM: "bg-yellow-500",
      HIGH: "bg-red-500",
      CRITICAL: "bg-red-700",
    };
    return colors[level as keyof typeof colors] || "bg-gray-500";
  };

  const getRiskLevelIcon = (level: string) => {
    const icons = {
      LOW: CheckCircle,
      MEDIUM: AlertTriangle,
      HIGH: XCircle,
      CRITICAL: XCircle,
    };
    return icons[level as keyof typeof icons] || Shield;
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

        {/* Top Row - Order and Shipping Info */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mb-6">
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

                {data?.order?.orderNots && (
                  <div className="space-y-1.5">
                    <p className="text-sm text-gray-500">Order Notes</p>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg">
                      {data?.order?.orderNots}
                    </p>
                  </div>
                )}

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

        {/* Risk Assessment Section - Full Width Horizontal Layout */}
        <Card className="shadow-md mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                Risk Assessment
              </CardTitle>
              <Button
                onClick={handleRefreshRiskAssessment}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600"
              >
                Refresh Assessment
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!data?.order?.shippingInfo && (
              <div className="p-3 bg-yellow-50 rounded-lg mb-4">
                <p className="text-sm text-yellow-700">
                  Order shipping information is required for risk assessment.
                </p>
              </div>
            )}

            {!riskAssessment && data?.order && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Risk assessment not available. Click Refresh Assessment to generate.
                </p>
              </div>
            )}

            {riskAssessment && (
              <div className="space-y-6">
                {/* Risk Overview - Horizontal Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Risk Level */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      {(() => {
                        const RiskIcon = getRiskLevelIcon(riskAssessment.riskLevel);
                        return <RiskIcon className="h-6 w-6" />;
                      })()}
                      <div>
                        <p className="text-sm text-gray-500">Risk Level</p>
                        <p className="text-lg font-semibold">{riskAssessment.riskLevel}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getRiskLevelColor(riskAssessment.riskLevel)}`}>
                        {riskAssessment.riskScore}/100
                      </Badge>
                      {riskAssessment.confidence && (
                        <Badge variant="outline">
                          {riskAssessment.confidence}% confidence
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Order History Stats */}
                  {riskHistory && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Order History</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500">Total Orders</p>
                          <p className="font-semibold">{riskHistory.totalOrders}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Success Rate</p>
                          <p className="font-semibold text-green-600">
                            {riskHistory.totalOrders > 0 
                              ? Math.round((riskHistory.successfulOrders / riskHistory.totalOrders) * 100)
                              : 0}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Cancelled</p>
                          <p className="font-semibold text-red-600">{riskHistory.cancelledOrders}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Last Status</p>
                          <p className="font-semibold">{riskHistory.lastOrderStatus || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-700 mb-3">Quick Actions</h4>
                    <div className="space-y-2">
                      {riskAssessment.riskLevel === 'CRITICAL' && (
                        <div className="p-2 bg-red-100 border border-red-200 rounded text-xs text-red-700">
                          🚨 Manual review required
                        </div>
                      )}
                      {riskAssessment.riskLevel === 'HIGH' && (
                        <div className="p-2 bg-orange-100 border border-orange-200 rounded text-xs text-orange-700">
                          ⚠️ Additional verification needed
                        </div>
                      )}
                      {riskAssessment.riskLevel === 'MEDIUM' && (
                        <div className="p-2 bg-yellow-100 border border-yellow-200 rounded text-xs text-yellow-700">
                          📋 Review order details
                        </div>
                      )}
                      {riskAssessment.riskLevel === 'LOW' && (
                        <div className="p-2 bg-green-100 border border-green-200 rounded text-xs text-green-700">
                          ✅ Process normally
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Risk Details - Horizontal Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Risk Factors */}
                  {riskAssessment.riskFactors && riskAssessment.riskFactors.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Risk Factors</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {riskAssessment.riskFactors.map((factor: any, index: number) => (
                          <div
                            key={index}
                            className={`p-3 rounded border-l-4 ${
                              factor.severity === 'CRITICAL'
                                ? 'border-red-700 bg-red-50'
                                : factor.severity === 'HIGH'
                                ? 'border-red-500 bg-red-50'
                                : factor.severity === 'MEDIUM'
                                ? 'border-yellow-500 bg-yellow-50'
                                : 'border-gray-500 bg-gray-50'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {factor.category}: {factor.factor}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  {factor.description}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={`text-xs ml-2 ${
                                  factor.severity === 'CRITICAL'
                                    ? 'border-red-700 text-red-700'
                                    : factor.severity === 'HIGH'
                                    ? 'border-red-500 text-red-500'
                                    : factor.severity === 'MEDIUM'
                                    ? 'border-yellow-500 text-yellow-500'
                                    : 'border-gray-500 text-gray-500'
                                }`}
                              >
                                {factor.severity}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {riskAssessment.recommendations && riskAssessment.recommendations.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-blue-700 mb-3">Recommendations</h4>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <ul className="text-sm text-blue-600 space-y-2">
                          {riskAssessment.recommendations.map(
                            (recommendation: string, index: number) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1 flex-shrink-0">→</span>
                                <span>{recommendation}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Risk Information */}
                {riskAssessment.reasons && riskAssessment.reasons.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Additional Risk Factors</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {riskAssessment.reasons.map((reason: string, index: number) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start gap-2">
                            <span className="text-red-500 mt-1 flex-shrink-0">•</span>
                            <span className="text-sm text-gray-600">{reason}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Model Version */}
                {riskAssessment.modelVersion && (
                  <div className="text-xs text-gray-500 pt-4 border-t">
                    Risk Model Version: {riskAssessment.modelVersion} | Last Updated: {new Date().toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Items Table Card */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Variation</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.order?.orderItems?.map((item: any) => {
                  // Get the product information
                  const product = item?.product;
                  // Get the selected price variation
                  const priceVariation =
                    product?.priceVariation?.[item.priceVariationIndex - 1];

                  return (
                    <TableRow key={item?._id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {product?.images?.[0] && (
                            <div className="relative h-12 w-12 overflow-hidden rounded border bg-gray-50">
                              <Image
                                src={getImgUrl(product.images[0])}
                                alt={product?.name || "Product"}
                                width={48}
                                height={48}
                                style={{ objectFit: "cover" }}
                                className="rounded"
                              />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {product?.name || "Unnamed Product"}
                            </span>
                            <span className="text-xs text-gray-500">
                              Qty: {item?.quantity}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {priceVariation?.quantity ? (
                          <Badge className="bg-blue-100 text-blue-800">
                            {priceVariation.quantity}
                          </Badge>
                        ) : (
                          <span className="text-sm text-gray-500">
                            Standard
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        ${(item?.price * item?.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell colSpan={2} className="font-semibold">
                    Subtotal
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ${data?.order?.itemsPrice.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} className="font-semibold">
                    Shipping
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {data?.order?.shippingPrice <= 0
                      ? "Free"
                      : `$${data?.order?.shippingPrice.toFixed(2)}`}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} className="font-semibold">
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
