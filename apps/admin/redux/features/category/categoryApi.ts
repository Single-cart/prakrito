import { apiSlice } from "../apiSlice/apiSlice";
import { allCategory } from "./categorySlice";

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAllCategory: build.query({
      query: () => ({
        url: "/category/category-subcategory",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Category"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const result = await queryFulfilled;
        dispatch(allCategory(result.data?.data));
      },
    }),

    createCategory: build.mutation({
      query: ({ data }) => ({
        url: "/category/create-category",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Category"],
    }),

    createSubcategory: build.mutation({
      query: ({ data }) => ({
        url: "/subcategory/create-subcategory",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategory: build.mutation({
      query: ({ id }) => ({
        url: `/category/delete-category/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Category"],
    }),

    deleteSubcategory: build.mutation({
      query: ({ id }) => ({
        url: `/subcategory/delete-subcategory/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetAllCategoryQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useCreateSubcategoryMutation,
  useDeleteSubcategoryMutation,
} = categoryApi;
