"use client";
import { useGetDalySalesReportQuery } from "@/redux/features/orders/orderApi";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const DalySalesChart = () => {
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(
      new Date().setFullYear(new Date().getFullYear() - 1)
    ).toISOString(),
    end: new Date().toISOString(),
  });

  const { data, isSuccess } = useGetDalySalesReportQuery({
    startDate: dateRange.start,
    endDate: dateRange.end,
  });

  const [chartState, setChartState] = useState({
    series: [{ data: [] as [number, number][] }],
    options: {
      chart: {
        id: "sales-chart",
        type: "area" as const,
        height: 350,
        zoom: {
          autoScaleYaxis: true,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
        style: "hollow",
      },
      xaxis: {
        type: "datetime" as const,
        labels: {
          datetimeUTC: false,
        },
      },
      yaxis: {
        title: {
          text: "Sales Amount",
          style: {
            fontSize: "14px",
            fontWeight: "bold",
          },
        },
        labels: {
          formatter: (value: number) => `$${value.toFixed(2)}`,
        },
      },
      tooltip: {
        x: {
          format: "MMM yyyy",
        },
        y: {
          formatter: (value: number) => `$${value.toFixed(2)}`,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100],
        },
      },
      colors: ["#00E396"],
    },
    selection: "one_year",
  });

  const updateData = (timeline: string) => {
    const now = new Date();
    let startDate = new Date();

    switch (timeline) {
      case "one_month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "six_months":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "one_year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "ytd":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case "all":
        startDate = new Date(2020, 0, 1);
        break;
      default:
        startDate.setFullYear(now.getFullYear() - 1);
    }

    setDateRange({
      start: startDate.toISOString(),
      end: now.toISOString(),
    });
    setChartState((prev) => ({ ...prev, selection: timeline }));
  };

  useEffect(() => {
    if (data && isSuccess) {
      setChartState((prev) => ({
        ...prev,
        series: [
          {
            data: data.chartData || [],
          },
        ],
        options: {
          ...prev.options,
          xaxis: {
            ...prev.options.xaxis,
            min: data.chartData[0]?.[0],
            max: data.chartData[data.chartData.length - 1]?.[0],
          },
        },
      }));
    }
  }, [data, isSuccess]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="mb-4 flex gap-2 flex-wrap">
        <button
          onClick={() => updateData("one_month")}
          className={`px-4 py-2 rounded-md ${
            chartState.selection === "one_month"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          1M
        </button>
        <button
          onClick={() => updateData("six_months")}
          className={`px-4 py-2 rounded-md ${
            chartState.selection === "six_months"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          6M
        </button>
        <button
          onClick={() => updateData("one_year")}
          className={`px-4 py-2 rounded-md ${
            chartState.selection === "one_year"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          1Y
        </button>
        <button
          onClick={() => updateData("ytd")}
          className={`px-4 py-2 rounded-md ${
            chartState.selection === "ytd"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          YTD
        </button>
        <button
          onClick={() => updateData("all")}
          className={`px-4 py-2 rounded-md ${
            chartState.selection === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          ALL
        </button>
      </div>

      {chartState.series[0] &&
      chartState.series[0].data &&
      chartState.series[0].data.length > 0 ? (
        <ReactApexChart
          options={chartState.options}
          series={chartState.series}
          type="area"
          height={350}
        />
      ) : (
        <div className="h-96 flex items-center justify-center text-gray-500">
          Loading sales data...
        </div>
      )}
    </div>
  );
};

export default DalySalesChart;
