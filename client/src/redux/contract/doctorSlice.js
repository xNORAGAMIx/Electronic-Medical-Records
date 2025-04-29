import { createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";

const initialState = {
  contract: null,
  account: null,
  provider: null,
  loading: true,
};

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    setDoctorState: (state, action) => {
      state.contract = action.payload.contract;
      state.account = action.payload.account;
      state.provider = action.payload.provider;
      state.loading = false;
    },
    clearDoctorState: (state) => {
      state.contract = null;
      state.account = null;
      state.provider = null;
      state.loading = true;
    },
  },
});

export const { setDoctorState, clearDoctorState } = doctorSlice.actions;

// Thunk function for connecting to blockchain for Doctor
export const connectDoctorContract = (privateKey, contractAddress, contractABI) => async (dispatch) => {
  try {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    dispatch(
      setDoctorState({
        contract,
        account: wallet.address,
        provider,
      })
    );
  } catch (error) {
    console.error("Failed to connect doctor contract:", error);
  }
};


export default doctorSlice.reducer;
