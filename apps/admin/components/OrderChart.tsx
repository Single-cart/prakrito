"use client";

import { useGetOrderStatusQuery } from "@/redux/features/orders/orderApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

const chartConfig = {
  value: {
    label: "Orders",
  },
  cancelled: {
    label: "Cancelled",
    color: "hsl(0 84.2% 60.2%)", // Red
  },
  pending: {
    label: "Pending",
    color: "hsl(217.2 91.2% 59.8%)", // Blue
  },
  delivered: {
    label: "Delivered",
    color: "hsl(47.9 95.8% 53.1%)", // Yellow
  },
  shipped: {
    label: "Shipped",
    color: "hsl(187 27.1% 63.9%)", // Light blue
  },
  processing: {
    label: "Processing",
    color: "hsl(44.8 41.9% 72.2%)", // Beige
  },
} satisfies ChartConfig;

const OrderChart = () => {
  const { data, isLoading } = useGetOrderStatusQuery({});

  if (isLoading) {
    return (
      <Card className="flex flex-col">
        <CardContent className="flex items-center justify-center h-[250px]">
          Loading chart data...
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    {
      status: "cancelled",
      value: data?.orderSummary?.totalCancelledOrder || 0,
      fill: chartConfig.cancelled.color,
    },
    {
      status: "pending",
      value: data?.orderSummary?.totalPandingOrder || 0,
      fill: chartConfig.pending.color,
    },
    {
      status: "delivered",
      value: data?.orderSummary?.totalDeliveredOrder || 0,
      fill: chartConfig.delivered.color,
    },
    {
      status: "shipped",
      value: data?.orderSummary?.totalShippedOrder || 0,
      fill: chartConfig.shipped.color,
    },
    {
      status: "processing",
      value: data?.orderSummary?.totalProcessingOrder || 0,
      fill: chartConfig.processing.color,
    },
  ].filter((item) => item.value > 0);

  // Calculate total orders and percentage change
  const totalOrders = chartData.reduce((sum, item) => sum + item.value, 0);
  const deliveredPercentage = (
    ((data?.orderSummary?.totalDeliveredOrder || 0) / totalOrders) *
    100
  ).toFixed(1);
  const isPositiveTrend = Number(deliveredPercentage) > 50;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Order Distribution</CardTitle>
        <CardDescription>Order Status Overview</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="status"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {isPositiveTrend ? (
            <>
              Delivery rate up at {deliveredPercentage}%
              <TrendingUp className="h-4 w-4 text-green-500" />
            </>
          ) : (
            <>
              Delivery rate at {deliveredPercentage}%
              <TrendingDown className="h-4 w-4 text-red-500" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Total of {totalOrders} orders processed
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrderChart;
