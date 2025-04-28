import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  connectToBlockchain,
  clearBlockchainState,
} from "../../redux/contract/blockchainSlice";

import PatientRegistration from "../../constants/PatientRegistration.json";
import { useDispatch, useSelector } from "react-redux";

import { PATIENT_CONTRACT_ADDRESS, PRIVATE_KEY } from "../../constants/Values";

import loginImage from "../../../public/5053643.jpg";

const contractABI = PatientRegistration.abi;
const contractAddress = PATIENT_CONTRACT_ADDRESS;
const privateKey = PRIVATE_KEY;

const Registration = () => {
  const dispatch = useDispatch();

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

  // connect to network
  useEffect(() => {
    dispatch(connectToBlockchain(privateKey, contractAddress, contractABI));
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
      alert(
        "You have missing input fields. Please fill in all the required fields."
      );
      return;
    }

    if (hhNumber.length != 6) {
      alert(
        "You have entered a wrong HH Number. Please enter a 6-digit HH Number."
      );
      return;
    }

    if (password.length < 8) {
      alert(
        "You have entered a weak password. Please enter a password with at least 8 characters"
      );
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(dob)) {
      alert("Please enter Date of Birth in the format dd/mm/yyyy");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const isRegPat = await contract.isRegisteredPatient(hhNumber);
      // await isRegPat.wait();

      if (isRegPat) {
        alert("Patient already exists");
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
      alert("Patient registered successfully!");
    } catch (err) {
      console.log(err?.message);
      alert("An error occurred while registering the patient.");
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
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
        <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-4xl -mt-20">
          {/* Left Side - Image */}
          <div className="hidden md:block w-1/2 bg-gray-200">
            <img
              src={loginImage}
              alt="Register Illustration"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-8 space-y-6">
            <h1 className="text-2xl font-bold text-center text-gray-800">
              Register Patient
            </h1>
            <h3 className="text-center text-sm text-gray-500">
              Connected as: {account}
            </h3>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-black"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-black"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Security Number
                  </label>
                  <input
                    type="text"
                    maxLength="6"
                    value={hhNumber}
                    onChange={(e) => setHHNumber(e.target.value)}
                    className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-black"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-4 text-lg font-bold text-white bg-black rounded-xl hover:bg-gray-300 hover:text-black cursor-pointer transition duration-300 focus:ring-2 focus:ring-gray-400"
              >
                Register
              </button>
              <p className="px-2 text-gray-500">
                Already have an account?{" "}
                <Link className="text-blue-400" to="/patient-login">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registration;
