import { createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";

const initialState = {
  contract: null,
  account: null,
  provider: null,
  loading: true,
};

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    setUploadState: (state, action) => {
      state.contract = action.payload.contract;
      state.account = action.payload.account;
      state.provider = action.payload.provider;
      state.loading = false;
    },
    clearUploadState: (state) => {
      state.contract = null;
      state.account = null;
      state.provider = null;
      state.loading = true;
    },
  },
});

export const { setUploadState, clearUploadState } = uploadSlice.actions;

export const connectToUpload =
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
        setUploadState({
          contract,
          account: wallet.address,
          provider,
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

export default uploadSlice.reducer;
