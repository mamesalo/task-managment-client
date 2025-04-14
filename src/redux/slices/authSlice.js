import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null, // fetch api from user
  isSidebarOpen: false,
  token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    updateuser: (state, action) => {
      const updateduser = { ...state.user, name: action.payload.name };

      localStorage.setItem("userInfo", JSON.stringify(updateduser));
      state.user.name = action.payload.name;
    },
    logout: (state, action) => {
      state.user = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
    },
    setOpenSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
  },
});

export const { setCredentials, logout, setOpenSidebar, updateuser } =
  authSlice.actions;

export default authSlice.reducer;
