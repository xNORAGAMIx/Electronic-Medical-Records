import { ethers } from "ethers";
import { ENVIRONMENT } from "../constants/Values";

const localRPC = "http://127.0.0.1:8545";
const remoteRPC =
  "https://eth-sepolia.g.alchemy.com/v2/dUG8xuououiPS-vFLTTSCP9E-JhYNJuX";

export const initializeContractCreation = async (
  privateKey,
  contractAddress,
  contractABI
) => {
  try {
    const provider = new ethers.JsonRpcProvider(
      ENVIRONMENT === "development" ? localRPC : remoteRPC
    );
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);
    return {
      provider,
      wallet,
      contract,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
