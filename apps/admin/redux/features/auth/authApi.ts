import { LoginRequest, LoginResponse } from "@/types/auth";
import type { IUser } from "@/types/user";
import { apiSlice } from "../apiSlice/apiSlice";
import { userLogin, userLogout } from "./authSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.accessToken) {
            dispatch(
              userLogin({
                accessToken: data.accessToken,
                user: data.user,
              })
            );
          }
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),

    logout: build.mutation<void, void>({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(userLogout());
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),

    getMe: build.query<{ data: IUser }, void>({
      query: () => "/user/me",
      providesTags: ["Users"],
      transformResponse: (response: { data: IUser }) => response,
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useGetMeQuery } = authApi;
