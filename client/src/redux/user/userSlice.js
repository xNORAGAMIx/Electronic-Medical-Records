import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  account: null,
  hhNumber: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.account = action.payload.account;
      state.hhNumber = action.payload.hhNumber;
      state.isLoggedIn = true;
    },
    clearUser: (state) => {
      state.account = null;
      state.hhNumber = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer; // export the reducer
