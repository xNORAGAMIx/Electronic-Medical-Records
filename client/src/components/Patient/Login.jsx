import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { connectToBlockchain } from "../../redux/contract/blockchainSlice";
import { setUser } from "../../redux/user/userSlice";
import PatientRegistration from "../../constants/PatientRegistration.json";

const contractABI = PatientRegistration.abi;
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const privateKey =
  "0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0";

const Login = () => {
  const dispatch = useDispatch();
  const contract = useSelector((state) => state.blockchain.contract);
  const loading = useSelector((state) => state.blockchain.loading);
  const account = useSelector((state) => state.blockchain.account);

  const [hhNumber, setHHNumber] = useState("");
  const [password, setPassword] = useState("");
  const [patientDetails, setPatientDetails] = useState("");

  useEffect(() => {
    dispatch(connectToBlockchain(privateKey, contractAddress, contractABI));
  }, [dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!contract) {
      alert(
        "Blockchain contract is not available yet. Please try again later."
      );
      return;
    }
    try {
      const isRegPat = await contract.isRegisteredPatient(hhNumber);

      if (isRegPat) {
        const isValidPass = await contract.validatePassword(hhNumber, password);

        if (!isValidPass) {
          alert("Incorrect password!");
        } else {
          const patient = await contract.getPatientDetails(hhNumber);
          setPatientDetails(patient);
          dispatch(setUser({ account, hhNumber }));
          localStorage.setItem("walletAddress", account);
          localStorage.setItem("hhNumber", hhNumber);
          alert("Login successfull!");
          console.log(patientDetails);
        }
      } else {
        alert("You need to register first!");
        return;
      }
    } catch (err) {
      console.log(err);
      alert("Login error!");
    }
  };

  if (loading) {
    return <div>Loading blockchain connection...</div>;
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Patient Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="securityNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Security Number
            </label>
            <input
              type="text"
              value={hhNumber}
              onChange={(e) => setHHNumber(e.target.value)}
              className="w-full p-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
              placeholder="Enter your security number"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
