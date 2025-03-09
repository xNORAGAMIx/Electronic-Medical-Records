import { createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";

const initialState = {
  contract: null,
  account: null,
  provider: null,
  loading: true,
};

const blockchainSlice = createSlice({
  name: "blockchain",
  initialState,
  reducers: {
    setBlockchainState: (state, action) => {
      state.contract = action.payload.contract;
      state.account = action.payload.account;
      state.provider = action.payload.provider;
      state.loading = false;
    },
    clearBlockchainState: (state) => {
      state.contract = null;
      state.account = null;
      state.provider = null;
      state.loading = true;
    },
  },
});

export const { setBlockchainState, clearBlockchainState } =
  blockchainSlice.actions;

export const connectToBlockchain =
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
        setBlockchainState({
          contract,
          account: wallet.address,
          provider,
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

export default blockchainSlice.reducer;
