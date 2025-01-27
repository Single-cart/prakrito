import { apiSlice } from "../apiSlice/apiSlice";

export const customerReviewApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAllCustomerReview: build.query({
      query: () => ({
        method: "GET",
        url: "/review/get-customer-review",
      }),
      providesTags: ["customerReview"],
    }),

    createReview: build.mutation({
      query: ({ data }) => ({
        url: "/review/create-customer-review",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    deleteReview: build.mutation({
      query: (id) => ({
        url: `/review/delete-customer-review/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["customerReview"],
    }),
  }),
});

export const {
  useGetAllCustomerReviewQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
} = customerReviewApi;
