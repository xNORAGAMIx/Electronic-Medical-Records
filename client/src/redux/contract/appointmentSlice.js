import { createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";

const initialState = {
  contract: null,
  account: null,
  provider: null,
  loading: null,
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    setAppointmentState: (state, action) => {
      state.contract = action.payload.contract;
      state.account = action.payload.account;
      state.provider = action.payload.provider;
      state.loading = false;
    },
    clearAppointementState: (state) => {
      state.contract = null;
      state.account = null;
      state.provider = null;
      state.loading = true;
    },
  },
});

export const { setAppointmentState, clearAppointementState } =
  appointmentSlice.actions;

  export const connectToAppoint =
  (privateKey, contractAddress, contractABI) => async (dispatch) => {
    try {
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      const wallet = new ethers.Wallet(privateKey, provider);
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        wallet
      );

      dispatch(
        setAppointmentState({
          contract,
          account: wallet.address,
          provider,
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  export default appointmentSlice.reducer;
