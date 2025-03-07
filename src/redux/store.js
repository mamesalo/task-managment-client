import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import teamsReducer from "./slices/teamSlice";
import tasksReducer from "./slices/taskSlice";
import dashboardReducer from "./slices/dashboardSlice";
import { apiSlice } from "./slices/apiSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    teams: teamsReducer,
    tasks: tasksReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
