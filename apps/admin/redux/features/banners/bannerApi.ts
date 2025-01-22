import { apiSlice } from "../apiSlice/apiSlice";

export const bannerApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // getTopBanner: build.query({
    //   query: () => ({
    //     url: "/banner/get-all-banners?bannerType=topBanner",
    //     method: "GET",
    //   }),

    //   async onQueryStarted(arg, { queryFulfilled, dispatch }) {
    //     try {
    //       const result = await queryFulfilled;
    //       dispatch(topBanner({ topBanner: [...result.data.banner] as [] }));
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   },
    // }),

    getBanners: build.query({
      query: () => ({
        url: `/banner/get-all-banners`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Banner"],
    }),
    createBanner: build.mutation({
      query: ({ data }) => ({
        url: "/banner/create-banner",
        method: "POST",
        body: data,

        credentials: "include",
      }),
      invalidatesTags: ["Banner"],
    }),
    deleteBanner: build.mutation({
      query: ({ id }) => ({
        url: `/banner/delete-banner/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Banner"],
    }),
    updateBanner: build.mutation({
      query: ({ id, body }) => {
        if (!(body instanceof FormData)) {
          throw new Error("Body must be FormData");
        }
        return {
          url: `/banner/update-banner/${id}`,
          method: "PUT",
          body,
          credentials: "include",
          formData: true,
          headers: {
            "Content-Type": undefined,
          },
        };
      },
      invalidatesTags: ["Banner"],
    }),
  }),
});

export const {
  useCreateBannerMutation,
  useDeleteBannerMutation,
  useGetBannersQuery,
  useUpdateBannerMutation,
} = bannerApi;
