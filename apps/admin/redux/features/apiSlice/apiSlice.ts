import { env } from "@/lib/env";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLogin } from "../auth/authSlice";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: env.NEXT_PUBLIC_API_URL,
  }),
  tagTypes: ["Orders", "Products", "Reviews", "Cart", "Users"],
  endpoints: (builder) => ({
    refreshToken: builder.query({
      query: () => ({
        url: "/user/refresh",
        method: "POST",
        credentials: "include" as const,
      }),
    }),
    userInfo: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
        credentials: "include",
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLogin({
              accessToken: result.data?.accessToken,
              user: result.data.user,
            })
          );
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.log(error.message);
          }
        }
      },
    }),
    loadUser: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
        credentials: "include" as const,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLogin({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error) {
          if (error instanceof Error) {
            console.log(error.message);
          }
        }
      },
    }),
  }),
});

export const { useLoadUserQuery } = apiSlice;
