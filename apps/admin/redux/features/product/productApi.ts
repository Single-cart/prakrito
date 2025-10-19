import { apiSlice } from "../apiSlice/apiSlice";

interface QueryProps {
  page?: string;
  limit?: string;
  category?: string;
  subcategory?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  ratings?: string;
}

const productApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAllProducts: build.query({
      query: (params: QueryProps) => {
        const queryString = Object.entries(params)
          .filter(([, value]) => value !== "")
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join("&");

        return {
          url: `/product/all-products?${queryString}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["Products"] as never,
    }),

    getAllProductsAdmin: build.query({
      query: (params: QueryProps) => {
        const queryString = Object.entries(params)
          .filter(([, value]) => value !== "")
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join("&");

        return {
          url: `/product/all-products-admin?${queryString}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["Products"] as never,
    }),

    getStockStatus: build.query({
      query: () => ({
        url: "/product/stock-status",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Products"] as never,
    }),

    createProduct: build.mutation({
      query: ({ data }) => ({
        url: "/product/create-product",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Products"] as never,
    }),

    deleteProduct: build.mutation({
      query: ({ productId }) => ({
        url: `/product/delete-product/${productId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Products"] as never,
    }),

    updateProduct: build.mutation({
      query: ({ data }) => ({
        url: `product/update-product`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Products"] as never,
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetAllProductsAdminQuery,
  useGetStockStatusQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} = productApi;
