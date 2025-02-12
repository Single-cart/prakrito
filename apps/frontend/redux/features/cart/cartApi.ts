import { apiSlice } from "../apiSlice/apiSlice";
import { allCartItems, totalPrice } from "./cartSlice";

const cartApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    syncCart: build.mutation({
      query: ({
        isSelect,
        cartItemId,
        isSelectAll,
        cartQuantity,
        deleteCartItem,
        colors,
        size,
      }) => ({
        url: `/cart/cart-sync`,
        method: "POST",
        params: {
          isSelect,
          cartItemId,
          isSelectAll,
          cartQuantity,
          deleteCartItem,
          colors,
          size,
        },
        credentials: "include",
      }),
    }),

    addToCart: build.mutation({
      query: ({ productId, colors, size }) => ({
        url: "/cart/add-to-cart",
        method: "POST",
        body: { productId, colors, size },
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
    }),

    getCartItem: build.query({
      query: () => ({
        url: "/cart/get-cart",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Cart"],
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          dispatch(allCartItems(result?.data?.data));
        } catch (error) {
          console.log(error);
        }
      },
    }),

    totalPrice: build.query({
      query: () => ({
        url: "/cart/updated-price",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Cart"],
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          dispatch(totalPrice(result.data?.data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useTotalPriceQuery,
  useSyncCartMutation,
  useGetCartItemQuery,
  useAddToCartMutation,
} = cartApi;
