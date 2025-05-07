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
          dispatch(allBlogs(result.data.data));
        } catch (error) {
          console.error("Error fetching blogs:", error);
        }
      },
    }),

    getBlogById: build.query({
      query: (id) => ({
        url: `/blog/single-blog/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Blog"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(singleBlog(result.data.data));
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
