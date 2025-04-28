import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { connectToBlockchain, clearBlockchainState } from "../../redux/contract/blockchainSlice";

import DoctorRegistrationContract from "../../constants/DoctorRegistration.json";
import { useDispatch, useSelector } from "react-redux";

import { DOCTOR_CONTRACT_ADDRESS, PRIVATE_KEY } from "../../constants/Values";

import loginImage from "../../../public/5053643.jpg";

const contractABI = DoctorRegistrationContract.abi;
const contractAddress = DOCTOR_CONTRACT_ADDRESS;
const privateKey = PRIVATE_KEY;

const DoctorRegistration = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [email, setEmail] = useState("");
  const [hospital, setHospital] = useState("");

  const contract = useSelector((state) => state.blockchain.contract);
  const loading = useSelector((state) => state.blockchain.loading);
  const account = useSelector((state) => state.blockchain.account);

  useEffect(() => {
    dispatch(connectToBlockchain(privateKey, contractAddress, contractABI));
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearBlockchainState());
    };
  }, [dispatch]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!contract) {
      console.log("Contract not initialized");
      return;
    }

    if (!account || !name || !dob || !gender || !bloodGroup || !specialization || !licenseNumber || !email || !hospital) {
      alert("You have missing input fields. Please fill in all required fields.");
      return;
    }

    if (licenseNumber.length !== 6) {
      alert("License Number should be exactly 6 characters.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const isRegDoc = await contract.isRegisteredDoctor(licenseNumber);

      if (isRegDoc) {
        alert("Doctor already registered with this License Number.");
        return;
      }

      const tx = await contract.registerDoctor(
        account,
        name,
        dob,
        gender,
        bloodGroup,
        specialization,
        licenseNumber,
        email,
        hospital
      );
      await tx.wait();
      alert("Doctor registered successfully!");
    } catch (err) {
      console.error(err?.message);
      alert("An error occurred while registering the doctor.");
    }
  };

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
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-4xl -mt-20">
        {/* Left - Image */}
        <div className="hidden md:block w-1/2 bg-gray-200">
          <img
            src={loginImage}
            alt="Register Illustration"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right - Form */}
        <div className="w-full md:w-1/2 p-8 space-y-6">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Doctor Registration
          </h1>
          <h3 className="text-center text-sm text-gray-500">
            Connected as: {account}
          </h3>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
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
                <label className="block text-sm font-medium text-gray-600">Gender</label>
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
                <label className="block text-sm font-medium text-gray-600">Blood Group</label>
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
                <label className="block text-sm font-medium text-gray-600">Specialization</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">License Number</label>
                <input
                  type="text"
                  maxLength="6"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Hospital</label>
              <input
                type="text"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
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
              Already registered?{" "}
              <Link className="text-blue-400" to="/doctor-login">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegistration;
