/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaBirthdayCake,
  FaTint,
  FaVenusMars,
  FaHome,
  FaIdCard,
  FaShieldAlt,
  FaGlobe,
} from "react-icons/fa";
import { toast } from "react-toastify";

import {
  connectToBlockchain,
  clearBlockchainState,
} from "../../redux/contract/blockchainSlice";

import PatientRegistration from "../../constants/PatientRegistration.json";
import { useDispatch, useSelector } from "react-redux";

import { PATIENT_CONTRACT_ADDRESS, PRIVATE_KEY } from "../../constants/Values";

import loginImage from "../../../public/photu.jpg";

const contractABI = PatientRegistration.abi;
const contractAddress = PATIENT_CONTRACT_ADDRESS;
const privateKey = PRIVATE_KEY;

const Registration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // register input states
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [hhNumber, setHHNumber] = useState("");

  const contract = useSelector((state) => state.blockchain.contract);
  const loading = useSelector((state) => state.blockchain.loading);
  const account = useSelector((state) => state.blockchain.account);

  //register loader
  const [waiter, setWaiter] = useState(false);

  // connect to network
  useEffect(() => {
    dispatch(connectToBlockchain(contractAddress, contractABI));
  }, [dispatch]);

  // clear state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearBlockchainState());
    };
  }, [dispatch]);

  // handle register
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!contract) {
      console.log("Contract not initialized");
      return;
    }

    if (
      !account ||
      !name ||
      !dob ||
      !bloodGroup ||
      !gender ||
      !address ||
      !password ||
      !email ||
      !hhNumber ||
      !confirmPassword
    ) {
      toast.error("Please fill in all the required fields.");
      // alert(
      //   "You have missing input fields. Please fill in all the required fields."
      // );
      return;
    }

    if (hhNumber.length != 6) {
      toast.error(
        "You have entered a wrong HH Number. Please enter a 6-digit HH Number."
      );
      return;
    }

    if (password.length < 8) {
      toast.error(
        "You have entered a weak password. Please enter a password with at least 8 characters"
      );
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(dob)) {
      toast.error("Please enter Date of Birth in the format dd/mm/yyyy");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setWaiter(true);
      const isRegPat = await contract.isRegisteredPatient(hhNumber);
      // await isRegPat.wait();

      if (isRegPat) {
        toast.error("Patient already exists");
        return;
      }

      const tx = await contract.registerPatient(
        account,
        name,
        dob,
        gender,
        bloodGroup,
        address,
        email,
        hhNumber,
        password
      );
      await tx.wait();
      navigate("/patient-login");
      toast.success("Patient registered successfully!");
    } catch (err) {
      console.log(err?.message);
      toast.error("An error occurred while registering the patient.");
    } finally {
      setWaiter(false);
    }
  };

  // contract loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        <p className="text-lg font-medium ml-4">
          Connecting to the blockchain...
        </p>
      </div>
    );
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
              src={loginImage}
              alt="Secure Medical Records"
              className="absolute inset-0 w-full h-full object-cover opacity-100"
            />
          </div>

          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            {waiter ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-400 mb-4"></div>
                <h3 className="text-xl font-semibold text-[#0a0f2c]">
                  Processing your registration
                </h3>
                <p className="text-gray-600 mt-2">
                  This may take a few moments...
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-[#0a0f2c]">
                    Patient <span className="text-cyan-400">Registration</span>
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Connected as:{" "}
                    <span className="font-mono text-sm">
                      {account?.slice(0, 12)}...
                    </span>
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-300 focus:border-transparent"
                      />
                    </div>

                    {/* Date of Birth */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaBirthdayCake className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-300 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Gender */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaVenusMars className="text-gray-400" />
                      </div>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-300 focus:border-transparent appearance-none"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Blood Group */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaTint className="text-gray-400" />
                      </div>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-300 focus:border-transparent appearance-none"
                      >
                        <option value="">Select Blood Group</option>
                        <option value="O+">O+</option>
                        <option value="A+">A+</option>
                        <option value="B+">B+</option>
                        <option value="AB+">AB+</option>
                      </select>
                    </div>
                  </div>

                  {/* HH Number */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaIdCard className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      maxLength="6"
                      value={hhNumber}
                      onChange={(e) => setHHNumber(e.target.value)}
                      placeholder="Security Number (6 digits)"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-300 focus:border-transparent"
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-300 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Password */}
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

                    {/* Confirm Password */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-300 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaHome className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Physical Address"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-300 focus:border-transparent"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0f2c] font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    Register Patient
                  </motion.button>

                  <p className="text-center text-gray-600 mt-4">
                    Already have an account?{" "}
                    <Link
                      to="/patient-login"
                      className="text-cyan-500 hover:underline font-medium"
                    >
                      Login here
                    </Link>
                  </p>
                </form>
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Registration;
