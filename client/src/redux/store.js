import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./user/userSlice";
import blockchainReducer from "./contract/blockchainSlice";
import uploadReducer from "./contract/uploadSlice";
import doctorReducer from "./contract/doctorSlice";
const persistConfig = {
  key: "root",
  storage,
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);
//const persistedBlockchainReducer = persistReducer(persistConfig, blockchainReducer);
//const persistedUploadReducer = persistReducer(persistConfig, uploadReducer);

const store = configureStore({
  reducer: {
    blockchain: blockchainReducer,
    user: persistedUserReducer,
    upload: uploadReducer,
    doctor:doctorReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "blockchain/setBlockchainState",
          "upload/setUploadState",
          "doctor/setDoctorState",
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
        ignoredPaths: [
          "blockchain.contract",
          "blockchain.provider",
          "blockchain.account",
          "upload.contract",
          "upload.provider",
          "upload.account",
          "doctor.contract",
          "doctor.provider",
          "doctor.account",
        ],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
