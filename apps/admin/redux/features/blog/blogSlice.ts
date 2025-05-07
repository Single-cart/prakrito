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
    allBlogs: (
      state,
      action: PayloadAction<{ data: { blogs: Blog[]; total: number } }>
    ) => {
      state.blogs = action.payload.data.blogs;
      state.total = action.payload.data.total;
    },
    singleBlog: (state, action: PayloadAction<Blog>) => {
      state.blog = action.payload;
    },
  },
});

export const { allBlogs, singleBlog } = blogSlice.actions;
export default blogSlice.reducer;
