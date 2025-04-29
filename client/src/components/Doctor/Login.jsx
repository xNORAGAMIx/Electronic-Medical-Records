import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectDoctorContract, clearDoctorState } from "../../redux/contract/doctorSlice";
import { useNavigate, Link } from "react-router-dom";

import DoctorRegistrationContract from "../../constants/DoctorRegistration.json";
import { DOCTOR_CONTRACT_ADDRESS, PRIVATE_KEY } from "../../constants/Values";

import loginImage from "../../../public/5053643.jpg"; // Adjust path if needed

const contractABI = DoctorRegistrationContract.abi;
const contractAddress = DOCTOR_CONTRACT_ADDRESS;
const privateKey = PRIVATE_KEY;

const DoctorLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { account ,contract, loading } = useSelector((state) => state.doctor);

  const [licenseNumber, setLicenseNumber] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    dispatch(connectDoctorContract(privateKey, contractAddress, contractABI));

    return () => {
      dispatch(clearDoctorState());
    };
  }, [dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!licenseNumber || !password) {
      alert("Please fill in all fields.");
      return;
    }

    if (!contract) {
      console.log("Contract not initialized");
      return;
    }

    try {
      const isRegDoc = await contract.isRegisteredDoctor(licenseNumber);

      if (!isRegDoc) {
        alert("Doctor not found. Please register first.");
        return;
      }
      const isValidAddress = await contract.validateAddress(account, licenseNumber)
      const isValidPass = contract.validatePassword(licenseNumber, password);

      if (!isValidPass) {
        alert("Incorrect Password. Try Again.");
        return;
      }

      if(!isValidAddress) {
        alert("Incorrect address. Try Again.");
        return;
      }

      //Fetch doctor details 
      // const doctorDetails = await contract.getDoctorDetails(licenseNumber);
      // console.log("dd", doctorDetails);


      // Successful login
      alert("Login Successful!");
      navigate("/doctor/"+licenseNumber); // Redirect to dashboard page
    } catch (err) {
      console.error(err);
      alert("An error occurred during login.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        <p className="text-lg font-medium ml-4">
          Connecting to blockchain...
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
            alt="Login Illustration"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right - Form */}
        <div className="w-full md:w-1/2 p-8 space-y-6">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Doctor Login
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">License Number</label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-black"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-4 text-lg font-bold text-white bg-black rounded-xl hover:bg-gray-300 hover:text-black cursor-pointer transition duration-300 focus:ring-2 focus:ring-gray-400"
            >
              Login
            </button>

            <p className="px-2 text-gray-500">
              Don't have an account?{" "}
              <Link className="text-blue-400" to="/doctor-register">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
