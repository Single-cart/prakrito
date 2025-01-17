import { RootState } from "@/redux/store";
import { AuthState } from "@/types/store";
import type { IUser } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
  token: "",
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLogin: (
      state,
      action: PayloadAction<{ accessToken?: string; user: IUser }>
    ) => {
      state.token = action.payload.accessToken!;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    userLogout: (state) => {
      state.token = "";
      state.user = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action: PayloadAction<{ user: IUser }>) => {
      state.user = action.payload.user;
    },
  },
});

export const { userLogin, userLogout, updateUser } = authSlice.actions;
export const authReducer = authSlice.reducer;

// Add selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
