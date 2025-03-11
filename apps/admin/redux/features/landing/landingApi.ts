import { apiSlice } from "../apiSlice/apiSlice";

export const landingApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getLandings: build.query({
      query: () => ({
        url: `/landings`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Landing"],
    }),

    getLandingById: build.query({
      query: (id) => ({
        url: `/landings/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Landing", id }],
    }),

    createLanding: build.mutation({
      query: (data) => ({
        url: "/landings",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Landing"],
    }),

    updateLanding: build.mutation({
      query: ({ id, body }) => ({
        url: `/landings/${id}`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Landing", id },
        "Landing",
      ],
    }),

    deleteLanding: build.mutation({
      query: (id) => ({
        url: `/landings/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Landing"],
    }),
  }),
});

export const {
  useGetLandingsQuery,
  useGetLandingByIdQuery,
  useCreateLandingMutation,
  useUpdateLandingMutation,
  useDeleteLandingMutation,
} = landingApi;
