/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Blog {
  _id: string;
  title: string;
  content: string;
  summary: string;
  isPublished: boolean;
  views: number;
  createdAt: string;
  featuredImage: string;
  category?: {
    _id: string;
    name: string;
  };
  author?: {
    _id: string;
    fullName: string;
  };
}

export interface BlogsState {
  blogs: Blog[];
  blog: Blog | null;
  total: number;
}

const initialState: BlogsState = {
  blogs: [],
  blog: null,
  total: 0,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    allBlogs: (state, action: PayloadAction<any>) => {
      // Handle different API response structures
      if (Array.isArray(action.payload)) {
        // If payload is an array, assume it's the blogs array directly
        state.blogs = action.payload;
        state.total = action.payload.length;
      } else if (action.payload && action.payload.data) {
        if (Array.isArray(action.payload.data)) {
          // If payload.data is an array, use it as blogs array
          state.blogs = action.payload.data;
          state.total = action.payload.data.length;
        } else if (action.payload.data.blogs) {
          // Original expected structure with nested data.blogs
          state.blogs = action.payload.data.blogs;
          state.total =
            action.payload.data.total || action.payload.data.blogs.length;
        } else {
          // Fallback to empty array if none of the expected structures match
          state.blogs = [];
          state.total = 0;
          console.error("Unexpected response structure:", action.payload);
        }
      } else {
        // Fallback to empty array for any other structure
        state.blogs = [];
        state.total = 0;
        console.error("Unexpected response structure:", action.payload);
      }
    },
    singleBlog: (state, action: PayloadAction<Blog>) => {
      state.blog = action.payload;
    },
  },
});

export const { allBlogs, singleBlog } = blogSlice.actions;
export default blogSlice.reducer;
