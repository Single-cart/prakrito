import { apiSlice } from "../apiSlice/apiSlice";
import { allBlogs, singleBlog } from "./blogSlice";

export const blogApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAllBlogs: build.query({
      query: () => ({
        url: "/blog/all-blogs",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Blog"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          console.log("Blog API response structure:", result);

          if (result.data && result.data.success) {
            dispatch(allBlogs(result.data));
          } else {
            console.error("Unexpected API response structure:", result);
          }
        } catch (error) {
          console.error("Error fetching blogs:", error);
        }
      },
    }),

    getBlogById: build.query({
      query: ({ id, updateViews }) => ({
        url: `/blog/single-blog/${id}`,
        params: updateViews ? { updateViews } : undefined,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Blog"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          if (result.data && result.data.success && result.data.data) {
            dispatch(singleBlog(result.data.data));
          } else {
            console.error(
              "Unexpected API response structure for single blog:",
              result
            );
          }
        } catch (error) {
          console.error("Error fetching blog:", error);
        }
      },
    }),

    createBlog: build.mutation({
      query: ({ data }) => {
        console.log("Creating blog with data keys:", [...data.keys()]);
        return {
          url: "/blog/create-blog",
          method: "POST",
          body: data,
          credentials: "include",
          formData: true,
        };
      },
      invalidatesTags: ["Blog"],
    }),

    updateBlog: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/blog/update-blog/${id}`,
          method: "PUT",
          body: data,
          credentials: "include",
          formData: true,
        };
      },
      invalidatesTags: ["Blog"],
    }),

    deleteBlog: build.mutation({
      query: (id) => ({
        url: `/blog/delete-blog/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

export const {
  useGetAllBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
