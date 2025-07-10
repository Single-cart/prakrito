import { apiSlice } from "../apiSlice/apiSlice";
import { getUserOrders } from "./orderSlice";

const orderApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getOrder: build.query({
      query: ({ userId }) => ({
        url: "/order/user-orders",
        method: "GET",
        params: {
          userId,
        },
        credentials: "include",
      }),
      providesTags: ["Orders"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(getUserOrders(result.data));
        } catch (error) {
          console.log(error);
        }
      },
    }),

    createOrder: build.mutation({
      query: (data) => ({
        url: "/order/create-order",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Orders"],
    }),

    getSalesReport: build.query({
      query: () => ({
        url: "/order/monthly-sales",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Orders"],
    }),
    getDalySalesReport: build.query({
      query: ({ startDate, endDate }) => ({
        url: `/order/daly-sales`,
        params: {
          startDate,
          endDate,
        },
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Orders"],
    }),
    getOrderStatus: build.query({
      query: () => ({
        url: "/order/order-status",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Orders"],
    }),
    getAllOrders: build.query({
      query: ({ orderStatus, page, search }) => ({
        url: "/order/all-orders",
        params: {
          orderStatus,
          page,
          search,
          limit: 20, // Default limit for pagination
        },
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Orders"],
    }),

    getSingleOrders: build.query({
      query: (id) => ({
        url: `/order/single-order/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Orders"],
    }),
    updateOrderStatus: build.mutation({
      query: ({ id, data }) => ({
        url: `/order/update-order-status/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Orders"],
    }),
    deleteOrder: build.mutation({
      query: ({ id }) => ({
        url: `/order/delete-order/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Orders"],
    }),

    getDailyOrderStats: build.query({
      query: () => ({
        url: "/order/analytics/daily",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Orders"],
    }),

    getOrderStatusDistribution: build.query({
      query: () => ({
        url: "/order/analytics/status-distribution",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Orders"],
    }),

    getPopularProducts: build.query({
      query: () => ({
        url: "/order/analytics/popular-products",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Orders"],
    }),

    getPaymentMethodStats: build.query({
      query: () => ({
        url: "/order/analytics/payment-methods",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Orders"],
    }),

    getProcessingTimeStats: build.query({
      query: () => ({
        url: "/order/analytics/processing-times",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Orders"],
    }),

    getHourlyDistribution: build.query({
      query: () => ({
        url: "/order/analytics/hourly-distribution",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetOrderQuery,
  useCreateOrderMutation,
  useGetSalesReportQuery,
  useGetOrderStatusQuery,
  useGetAllOrdersQuery,
  useGetSingleOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  useGetDailyOrderStatsQuery,
  useGetOrderStatusDistributionQuery,
  useGetPopularProductsQuery,
  useGetPaymentMethodStatsQuery,
  useGetProcessingTimeStatsQuery,
  useGetHourlyDistributionQuery,
  useGetDalySalesReportQuery,
} = orderApi;
