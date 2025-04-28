import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import { connectToBlockchain } from "../../redux/contract/doctorSlice";
import { setUser } from "../../redux/user/userSlice";

import DoctorRegistration from "../../constants/DoctorRegistration.json";
import { DOCTOR_CONTRACT_ADDRESS, PRIVATE_KEY } from "../../constants/Values";

import loginImage from "../../../public/5053643.jpg";

const contractABI = DoctorRegistration.abi;
const contractAddress = DOCTOR_CONTRACT_ADDRESS;
const privateKey = PRIVATE_KEY;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [hhNumber, setHHNumber] = useState("");
  const [password, setPassword] = useState("");

  const { contract, loading, account } = useSelector((state) => state.doctor);

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
      toast.error(
        "Blockchain contract is not available yet. Please try again later."
      );
      return;
    }

    if (!hhNumber.trim() || !password.trim()) {
      toast.error("Please fill out all fields");
      return;
    }

    if (!/^\d+$/.test(hhNumber)) {
      toast.error("Security Number must be numeric");
      return;
    }
    try {
      //check if patient is registered
      const isRegDoc = await contract.isDoctorRegistered(hhNumber);

      if (isRegDoc) {
        const isValidPass = await contract.validatePassword(hhNumber, password);

        //validate address
        const isValidAddress = await contract.validateAddress(
          account,
          hhNumber
        );

        if (!isValidAddress) {
          toast.error("Unauthorized access");
          return;
        }

        //validate password
        if (!isValidPass) {
          toast.error("Incorrect password!");
        } else {
          // setup user login state
          dispatch(setUser({ account, hhNumber }));

          //save user data to local storage
          localStorage.setItem("walletAddress", account);
          localStorage.setItem("hhNumber", hhNumber);
          // alert("Login successfull!");
          toast.success("Doctor registered successfully!");

          // redirect to user profile
          navigate("/doctor/" + hhNumber);
        }
      } else {
        toast.error("You need to register first!");
        return;
      }
    } catch (err) {
      console.log(err);
      toast.error("Login error!");
    }
  };

  //contract loading
  if (loading) {
    return <div>Loading blockchain connection...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-4xl -mt-20">
        {/* Left Side - Image */}
        <div className="hidden md:block w-1/2 bg-gray-200">
          <img
            src={loginImage}
            alt="Login Illustration"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 space-y-6">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Doctor Login
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

export default Login;
