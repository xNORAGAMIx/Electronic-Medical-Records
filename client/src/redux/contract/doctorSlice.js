import { createSlice } from "@reduxjs/toolkit";
import { initializeContractCreationMetaMask } from "../../utils/RpcControllerMetaMask";

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

// export const connectToDoctor =
//   (privateKey, contractAddress, contractABI) => async (dispatch) => {
//     try {
//       const { provider, wallet, contract } = await initializeContractCreation(
//         privateKey,
//         contractAddress,
//         contractABI
//       );

//       dispatch(
//         setDoctorState({
//           contract,
//           account: wallet.address,
//           provider,
//         })
//       );
//     } catch (err) {
//       console.log(err);
//     }
//   };

export const connectToDoctor =
  (contractAddress, contractABI) => async (dispatch) => {
    try {
      const { provider, contract, account } =
        await initializeContractCreationMetaMask(contractAddress, contractABI);

      dispatch(
        setDoctorState({
          contract,
          account,
          provider,
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

export default doctorSlice.reducer;
