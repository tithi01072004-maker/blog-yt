import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: true, // 👈 start with true on app load
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set loading explicitly (optional)
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set user and mark loading false automatically
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false; // 👈 stops the "checking auth" state
    },
  },
});

export const { setLoading, setUser } = authSlice.actions;
export default authSlice.reducer;
