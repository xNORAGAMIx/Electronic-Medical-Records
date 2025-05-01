import { createSlice } from "@reduxjs/toolkit";
import { initializeContractCreationMetaMask } from "../../utils/RpcControllerMetaMask";

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

// export const connectToAppoint =
//   (privateKey, contractAddress, contractABI) => async (dispatch) => {
//     try {
//       const { provider, wallet, contract } = await initializeContractCreation(
//         privateKey,
//         contractAddress,
//         contractABI
//       );

//       dispatch(
//         setAppointmentState({
//           contract,
//           account: wallet.address,
//           provider,
//         })
//       );
//     } catch (err) {
//       console.log(err);
//     }
//   };

export const connectToAppoint =
  (contractAddress, contractABI) => async (dispatch) => {
    try {
      const { provider, contract, account } =
        await initializeContractCreationMetaMask(contractAddress, contractABI);

      dispatch(
        setAppointmentState({
          contract,
          account,
          provider,
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

export default appointmentSlice.reducer;
