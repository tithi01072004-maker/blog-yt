import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    loading: false,
    blog: [] // fix: use empty array
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setBlog: (state, action) => {
      state.blog = action.payload;
    },
    addBlog: (state, action) => {
      state.blog.push(action.payload); // optional: for creating new blog
    }
  }
});

export const { setLoading, setBlog, addBlog } = blogSlice.actions;
export default blogSlice.reducer;
