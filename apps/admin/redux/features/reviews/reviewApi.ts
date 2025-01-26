import { apiSlice } from "../apiSlice/apiSlice";
import { getProductReviews } from "./reviewSlice";

const reviewApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    createProductReview: build.mutation({
      query: ({ data }) => ({
        url: "/product/create-review",
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Reviews"],
    }),

    getReviews: build.query({
      query: ({ productId, userId }) => ({
        url: "/product/all-reviews",
        method: "GET",
        params: {
          productId,
          userId,
        },
        credentials: "include",
      }),
      providesTags: ["Reviews"],
    }),

    getAllProductReviews: build.query({
      query: () => ({
        url: "/product/all-product-reviews",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Reviews"],
    }),

    updateReviewStatus: build.mutation({
      query: ({ data }) => ({
        url: "/product/update-review-status",
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Reviews"],
    }),
    deleteReview: build.mutation({
      query: ({ reviewId, productId }) => ({
        url: `/product/delete-review`,
        method: "DELETE",
        body: {
          productId,
          reviewId,
        },
        credentials: "include",
      }),
      invalidatesTags: ["Reviews"],
    }),
  }),
});

export const {
  useCreateProductReviewMutation,
  useGetReviewsQuery,
  useUpdateReviewStatusMutation,
  useGetAllProductReviewsQuery,
  useDeleteReviewMutation,
} = reviewApi;
