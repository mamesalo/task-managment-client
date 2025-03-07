import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [], // fetch api from user
};

const tasksSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
  },
});

export const { setTasks } = tasksSlice.actions;

export default tasksSlice.reducer;
