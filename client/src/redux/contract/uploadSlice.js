import { createSlice } from "@reduxjs/toolkit";
import { initializeContractCreationMetaMask } from "../../utils/RpcControllerMetaMask";

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

// export const connectToUpload =
//   (privateKey, contractAddress, contractABI) => async (dispatch) => {
//     try {
//       const { provider, wallet, contract } = await initializeContractCreation(
//         privateKey,
//         contractAddress,
//         contractABI
//       );

//       dispatch(
//         setUploadState({
//           contract,
//           account: wallet.address,
//           provider,
//         })
//       );
//     } catch (err) {
//       console.log(err);
//     }
//   };

export const connectToUpload =
  (contractAddress, contractABI) => async (dispatch) => {
    try {
      const { provider, contract, account } =
        await initializeContractCreationMetaMask(contractAddress, contractABI);

      dispatch(
        setUploadState({
          contract,
          account,
          provider,
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

export default uploadSlice.reducer;
