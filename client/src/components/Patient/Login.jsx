/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUserInjured,
  FaShieldAlt,
  FaLock,
  FaArrowRight,
} from "react-icons/fa";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-300 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-float"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-purple-300 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-float-delay"></div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-400"></div>
          <p className="text-lg font-medium ml-4 text-[#0a0f2c]">
            Connecting to blockchain...
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Image Section - Full Height */}
          <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-[#0a0f2c] to-[#1a1f3c] relative">
            <img
              src={reception}
              alt="Secure Medical Login"
              className="absolute inset-0 w-full h-full object-cover opacity-100"
            />
            {/* <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f2c] to-transparent"></div>
            <div className="relative z-10 p-12 h-full flex flex-col justify-end">
              <h2 className="text-4xl font-bold text-white mb-4">
                Welcome Back to{" "}
                <span className="text-cyan-300">LifeLedger</span>
              </h2>
              <p className="text-gray-300 text-lg">
                Access your secure medical records anytime, anywhere.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  {
                    icon: <FaShieldAlt className="text-cyan-300" />,
                    text: "Military-grade encryption",
                  },
                  {
                    icon: <FaLock className="text-purple-300" />,
                    text: "Patient-controlled access",
                  },
                  {
                    icon: <FaUserInjured className="text-blue-300" />,
                    text: "24/7 availability",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center">
                    <span className="mr-3">{item.icon}</span>
                    <span className="text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>
            </div> */}
          </div>

          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#0a0f2c]">
                Patient <span className="text-cyan-400">Login</span>
              </h1>
              <p className="text-gray-600 mt-2">
                Connected as:{" "}
                <span className="font-mono text-sm">
                  {account?.slice(0, 12)}...
                </span>
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Security Number Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaShieldAlt className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={hhNumber}
                  onChange={(e) => setHHNumber(e.target.value)}
                  placeholder="Security Number"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-300 focus:border-transparent"
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-300 focus:border-transparent"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0f2c] font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center"
              >
                Login <FaArrowRight className="ml-2" />
              </motion.button>

              <div className="text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/patient-register"
                    className="text-cyan-500 hover:underline font-medium"
                  >
                    Register here
                  </Link>
                </p>
                <Link
                  to="/forgot-password"
                  className="text-sm text-gray-500 hover:text-cyan-500 mt-2 inline-block"
                >
                  Forgot password?
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Login;
