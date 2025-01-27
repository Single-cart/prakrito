/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface CartType {
  allCartProducts: {
    success: string;
    message: string;
    cartItem: any[];
    selectAll: boolean;
  };
  totalPrice: object;
  buyNowItem: object;
}

const initialState: CartType = {
  allCartProducts: {
    success: "",
    message: "",
    cartItem: [],
    selectAll: true,
  },
  totalPrice: {},
  buyNowItem: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    deleteCartItem: (state, action: PayloadAction<{ cartItemId: string }>) => {
      state.allCartProducts.cartItem = state.allCartProducts?.cartItem?.filter(
        (item: any) => item._id !== action.payload.cartItemId
      );
    },
    clearCart: (state) => {
      state.allCartProducts = {
        message: "",
        cartItem: [],
        success: "",
        selectAll: true,
      };
    },

    allCartItems: (state, action) => {
      state.allCartProducts = action.payload;
    },
    totalPrice: (state, action) => {
      state.totalPrice = action.payload;
    },

    byNowItem: (state, action) => {
      state.buyNowItem = action.payload;
    },
    clearBuyNow: (state) => {
      state.buyNowItem = {};
    },
  },
});

export const {
  deleteCartItem,
  allCartItems,
  byNowItem,
  totalPrice,
  clearCart,
  clearBuyNow,
} = cartSlice.actions;
export default cartSlice.reducer;
