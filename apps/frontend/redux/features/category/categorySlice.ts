import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { categoryType } from "@workspace/shared/index";

const initialState = {
  category: {},
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    allCategory: (
      state,
      action: PayloadAction<{ category: categoryType.ICategorySubcategory[] }>
    ) => {
      state.category = action.payload.category;
    },
  },
});

export const { allCategory } = categorySlice.actions;
export default categorySlice.reducer;
