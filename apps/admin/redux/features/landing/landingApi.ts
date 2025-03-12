import { apiSlice } from "../apiSlice/apiSlice";

export const landingApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getLandings: build.query({
      query: () => ({
        url: `/landing`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Landing"],
    }),

    getLandingById: build.query({
      query: (id) => ({
        url: `/landing/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Landing", id }],
    }),

    createLanding: build.mutation({
      query: (data) => ({
        url: "/landing",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Landing"],
    }),

    updateLanding: build.mutation({
      query: ({ id, body }) => ({
        url: `/landing/${id}`,
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
        url: `/landing/${id}`,
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
