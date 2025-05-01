import { createSlice } from "@reduxjs/toolkit";
import { initializeContractCreationMetaMask } from "../../utils/RpcControllerMetaMask";

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

// export const connectToBlockchain =
//   (privateKey, contractAddress, contractABI) => async (dispatch) => {
//     try {
//       const { provider, wallet, contract } = await initializeContractCreation(
//         privateKey,
//         contractAddress,
//         contractABI
//       );

//       dispatch(
//         setBlockchainState({
//           contract,
//           account: wallet.address,
//           provider,
//         })
//       );
//     } catch (err) {
//       console.log(err);
//     }
//   };

export const connectToBlockchain =
  (contractAddress, contractABI) => async (dispatch) => {
    try {
      const { provider, contract, account } =
        await initializeContractCreationMetaMask(contractAddress, contractABI);

      dispatch(
        setBlockchainState({
          contract,
          account,
          provider,
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

export default blockchainSlice.reducer;
