import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import blockchainReducer from "./contract/blockchainSlice";
import uploadReducer from "./contract/uploadSlice";

const store = configureStore({
  reducer: {
    blockchain: blockchainReducer,
    user: userReducer,
    upload: uploadReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "blockchain/setBlockchainState",
          "upload/setUploadState",
        ],
        ignoredPaths: [
          "blockchain.contract",
          "blockchain.provider",
          "blockchain.account",
          "upload.contract",
          "upload.provider",
          "upload.account",
        ],
      },
    }),
});

export default store;
