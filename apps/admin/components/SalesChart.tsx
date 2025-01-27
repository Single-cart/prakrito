/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetSalesReportQuery } from "@/redux/features/orders/orderApi";
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
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  total: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const SalesChart = () => {
  const { isLoading, data } = useGetSalesReportQuery({});
  console.log(data);
  if (isLoading) {
    return (
      <Card className="w-full h-[400px]">
        <CardContent className="flex items-center justify-center h-full">
          Loading sales data...
        </CardContent>
      </Card>
    );
  }

  const salesData = data?.monthSales || [];
  const currentMonth = salesData[salesData.length - 1]?.total || 0;
  const previousMonth = salesData[salesData.length - 2]?.total || 0;
  const trendPercentage = previousMonth
    ? (((currentMonth - previousMonth) / previousMonth) * 100).toFixed(1)
    : 0;
  const isPositiveTrend = Number(trendPercentage) > 0;
  const totalSales = salesData.reduce(
    (sum: any, month: any) => sum + month.total,
    0
  );

  return (
    <Card className="w-full h-[450px]">
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Monthly Sales Report</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="w-full h-[280px]">
          <BarChart
            data={data?.monthSales}
            accessibilityLayer
            margin={{
              top: 5,
              right: 30,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="total"
              fill="var(--color-total)"
              radius={8}
              barSize={25}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {isPositiveTrend ? (
            <>
              Sales trending up by {Math.abs(Number(trendPercentage))}% this
              month
              <TrendingUp className="h-4 w-4 text-green-500" />
            </>
          ) : (
            <>
              Sales trending down by {Math.abs(Number(trendPercentage))}% this
              month
              <TrendingDown className="h-4 w-4 text-red-500" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Total sales: ${totalSales.toLocaleString()}
        </div>
      </CardFooter>
    </Card>
  );
};

export default SalesChart;
