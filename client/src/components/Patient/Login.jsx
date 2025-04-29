import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

//redux
import { connectToBlockchain } from "../../redux/contract/blockchainSlice";
import { setUser } from "../../redux/user/userSlice";

// contract
import PatientRegistration from "../../constants/PatientRegistration.json";
import { PATIENT_CONTRACT_ADDRESS, PRIVATE_KEY } from "../../constants/Values";

import reception from "../../../public/reception.jpg";

// setting up constants
const contractABI = PatientRegistration.abi;
const contractAddress = PATIENT_CONTRACT_ADDRESS;
const privateKey = PRIVATE_KEY;

// 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
// 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //login credential states
  const [hhNumber, setHHNumber] = useState("");
  const [password, setPassword] = useState("");

  // redux store
  const contract = useSelector((state) => state.blockchain.contract);
  const loading = useSelector((state) => state.blockchain.loading);
  const account = useSelector((state) => state.blockchain.account);

  //coonect to network
  useEffect(() => {
    if (!account) {
      dispatch(connectToBlockchain(privateKey, contractAddress, contractABI));
    }
  }, [dispatch, account]);

  // handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    // contract not loaded yet
    if (!contract) {
      alert(
        "Blockchain contract is not available yet. Please try again later."
      );
      return;
    }

    if (!hhNumber.trim() || !password.trim()) {
      alert("Please fill out all fields");
      return;
    }

    if (!/^\d+$/.test(hhNumber)) {
      alert("Security Number must be numeric");
      return;
    }
    try {
      //check if patient is registered
      const isRegPat = await contract.isRegisteredPatient(hhNumber);

      if (isRegPat) {
        const isValidPass = await contract.validatePassword(hhNumber, password);

        //validate address
        const isValidAddress = await contract.validateAddress(
          account,
          hhNumber
        );

        if (!isValidAddress) {
          alert("Unauthorized access");
          return;
        }

        //validate password
        if (!isValidPass) {
          alert("Incorrect password!");
        } else {
          // setup user login state
          dispatch(setUser({ account, hhNumber }));

          //save user data to local storage
          localStorage.setItem("walletAddress", account);
          localStorage.setItem("hhNumber", hhNumber);
          alert("Login successfull!");

          // redirect to user profile
          navigate("/patient/" + hhNumber);
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

  //contract loading
  if (loading) {
    return <div>Loading blockchain connection...</div>;
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#ebf0f6] to-[#e6f0ff] p-4">
      <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-4xl -mt-20">
        {/* Left Side - Image */}
        <div className="hidden md:block w-1/2 bg-gray-200">
          <img
            src={reception}
            alt="Login Illustration"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 space-y-6 bg-gradient-to-b from-[#f5f6f7] to-[#e6f0ff]">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Patient Login
          </h1>
          <h3 className="text-center text-sm text-gray-500">
            Connected as: {account}
          </h3>

          <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
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
                className="w-full p-2 mt-1 border rounded-md shadow-sm focus:ring-black focus:border-black border-gray-300 outline-none focus:ring-2"
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
                className="w-full p-2 mt-1 border rounded-md shadow-sm focus:ring-black focus:border-black border-gray-300 outline-none focus:ring-2"
                placeholder="Enter your password"
              />
            </div>
            <button
              disabled={loading}
              type="submit"
              className="w-full p-3 mt-4 text-white text-lg font-bold bg-black rounded-xl hover:bg-gray-300 hover:text-black transition duration-300 focus:ring-2 focus:ring-gray-400 cursor-pointer"
            >
              {loading ? "Loading..." : "Login"}
            </button>
            <p className="px-2 text-gray-500">
              Don't have an account?{" "}
              <Link className="text-blue-400" to="/patient-register">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
