import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { apiSlice } from "./features/apiSlice/apiSlice";
import { authReducer } from "./features/auth/authSlice";
import bannerSlice from "./features/banners/bannerSlice";
import blogSlice from "./features/blog/blogSlice";
import cartSlice from "./features/cart/cartSlice";
import categorySlice from "./features/category/categorySlice";
import orderSlice from "./features/orders/orderSlice";
import porductSlice from "./features/product/productSlice";
import reviewSlice from "./features/reviews/reviewSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    banner: bannerSlice,
    category: categorySlice,
    blog: blogSlice,
    cart: cartSlice,
    porductReviews: reviewSlice,
    order: orderSlice,
    product: porductSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }).concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Initialize app with proper error handling
// const initialize = async () => {
//   try {
//     await store.dispatch(apiSlice.endpoints.userInfo.initiate(undefined));
//   } catch (error) {
//     console.error("Failed to initialize app:", error);
//   }
// };

// initialize();
