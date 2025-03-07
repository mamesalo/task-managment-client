import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dashboard: {
    totalTasks: 0,
    last10Task: [],
    users: [],
    tasks: {
      todo: 0,
      "in progress": 0,
      completed: 0,
    },
    graphData: [],
  },
  chartData: [],
  // fetch api from user
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboard: (state, action) => {
      state.dashboard = action.payload;
      state.chartData = action.payload.graphData;
    },
  },
});

export const { setDashboard } = dashboardSlice.actions;

export default dashboardSlice.reducer;
