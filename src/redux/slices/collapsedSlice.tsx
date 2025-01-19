import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  collapsed: JSON.parse(localStorage.getItem("collapsed") ?? "false"),
};

const collapsedSlice = createSlice({
  name: "collapsed",
  initialState,
  reducers: {
    toggleCollapse: (state) => {
      state.collapsed = !state.collapsed;
      localStorage.setItem("collapsed", JSON.stringify(state.collapsed));
    },
  },
});

export const { toggleCollapse } = collapsedSlice.actions;
export default collapsedSlice.reducer;
