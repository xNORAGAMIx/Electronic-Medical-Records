import { ethers } from "ethers";

export const initializeContractCreationMetaMask = async (
  contractAddress,
  contractABI
) => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed.");
    }

    // Request access to MetaMask account
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(); // Get the connected account
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    return {
      provider,
      signer,
      contract,
      account: await signer.getAddress(),
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
