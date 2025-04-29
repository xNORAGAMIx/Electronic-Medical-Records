import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  connectToDoctor,
  clearDoctorState,
} from "../../redux/contract/doctorSlice";

import DoctorRegistration from "../../constants/DoctorRegistration.json";
import { useDispatch, useSelector } from "react-redux";

import { DOCTOR_CONTRACT_ADDRESS, PRIVATE_KEY } from "../../constants/Values";

import loginImage from "../../../public/5053643.jpg";

const contractABI = DoctorRegistration.abi;
const contractAddress = DOCTOR_CONTRACT_ADDRESS;
const privateKey = PRIVATE_KEY;

const Registration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [hospital, setHospital] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hhNumber, setHHNumber] = useState("");

  const { account, contract, loading } = useSelector((state) => state.doctor);

  // register loader
  const [waiter, setWaiter] = useState(false);

  // connect to network
  useEffect(() => {
    dispatch(connectToDoctor(privateKey, contractAddress, contractABI));
  }, [dispatch]);

  // clear state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearDoctorState());
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
      !hospital | !name ||
      !specialization ||
      !password ||
      !email ||
      !hhNumber ||
      !confirmPassword
    ) {
      toast.error("Please fill in all the required fields.");
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setWaiter(true);
      const isRegDoc = await contract.isDoctorRegistered(hhNumber);

      if (isRegDoc) {
        toast.error("Doctor already exists");
        return;
      }

      const tx = await contract.registerDoctor(
        account,
        name,
        specialization,
        hhNumber,
        email,
        hospital,
        password
      );
      await tx.wait();
      navigate("/doctor-login");
      toast.success("Doctor registered successfully!");
    } catch (err) {
      console.log(err?.message);
      toast.error("An error occurred while registering the doctor.");
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
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
        {waiter ? (
          <div className="mt-4 flex items-center">
            <svg
              className="animate-spin h-5 w-5 text-gray-600 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <span>Processing transaction...</span>
          </div>
        ) : (
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
                Register Doctor
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
                      Hospital
                    </label>
                    <input
                      type="text"
                      value={hospital}
                      onChange={(e) => setHospital(e.target.value)}
                      className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Specialization
                    </label>
                    <select
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-black"
                    >
                      <option value="">Select Specialization</option>
                      <option value="Cardio">Cardio</option>
                      <option value="Neuro">Neuro</option>
                      <option value="Other">Other</option>
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

                <button
                  type="submit"
                  className="w-full py-3 mt-4 text-lg font-bold text-white bg-black rounded-xl hover:bg-gray-300 hover:text-black cursor-pointer transition duration-300 focus:ring-2 focus:ring-gray-400"
                >
                  Register
                </button>
                <p className="px-2 text-gray-500">
                  Already have an account?{" "}
                  <Link className="text-blue-400" to="/doctor-login">
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Registration;
