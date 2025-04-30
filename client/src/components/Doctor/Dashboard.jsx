/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  FaUserMd,
  FaUser,
  FaStethoscope,
  FaWallet,
  FaHospital,
  FaEnvelope,
} from "react-icons/fa";

// Doctor - Redux
import { connectToDoctor } from "../../redux/contract/doctorSlice";

// contract address
import { DOCTOR_CONTRACT_ADDRESS, PRIVATE_KEY } from "../../constants/Values";

// Doctor contract JSON
import DoctorRegistration from "../../constants/DoctorRegistration.json";

// initial values
const contractABI = DoctorRegistration.abi;
const contractAddress = DOCTOR_CONTRACT_ADDRESS;
const privateKey = PRIVATE_KEY;

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { contract } = useSelector((state) => state.doctor);

  const authNumber = useSelector((state) => state.user.licenseNumber);
  const { licenseNumber } = useParams();

  // const {licenseNumber} = useParams();

  const [doctorDetails, setDoctorDetails] = useState({});

  // connect to network
  useEffect(() => {
    dispatch(connectToDoctor(privateKey, contractAddress, contractABI));
  }, [dispatch]);

  // deny unauthorized access
  useEffect(() => {
    if (authNumber !== licenseNumber) {
      navigate("/doctor/" + authNumber, { replace: true });
    }
  }, [licenseNumber, authNumber, navigate]);

  // fetch doctor details
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const txn = await contract.getDoctorDetails(licenseNumber);
        console.log(txn);
        setDoctorDetails(txn);
      } catch (err) {
        console.log(err);
      }
    };
    if (contract) {
      fetchDoctorDetails();
    }
  }, [contract, licenseNumber]);
  return (
    <div className="min-h-screen w-full p-6 bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50">
      {/* Doctor Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 p-8 w-full max-w-7xl mx-auto"
      >
        {/* Profile Header with Gradient Background */}
        <div className="bg-gradient-to-r from-[#0a0f2c] to-[#1a1f3c] py-8 px-10 text-center rounded-2xl shadow-lg">
          <div className="relative inline-block mb-4">
            <img
              src="/5053643.jpg"
              alt="Doctor Profile"
              className="w-36 h-36 rounded-full shadow-2xl border-4 border-cyan-300/30 object-cover"
            />
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-tr from-cyan-400 to-blue-500 text-white p-2 rounded-full shadow-lg">
              <FaUserMd className="text-xl" />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-white">
            Doctor <span className="text-cyan-300">Profile</span>
          </h2>
          <div className="mt-2 h-1 w-20 bg-cyan-400 mx-auto rounded-full"></div>
        </div>

        {/* Information Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              label: "Full Name",
              value: doctorDetails.name,
              icon: <FaUser className="text-purple-500 text-2xl" />,
              gradient: "from-purple-50 to-purple-100",
              border: "border-purple-200",
            },
            {
              label: "Specialization",
              value: doctorDetails.specialization,
              icon: <FaStethoscope className="text-green-500 text-2xl" />,
              gradient: "from-green-50 to-green-100",
              border: "border-green-200",
            },
            {
              label: "Wallet Address",
              value: doctorDetails.walletAddress,
              icon: <FaWallet className="text-cyan-500 text-2xl" />,
              gradient: "from-cyan-50 to-cyan-100",
              border: "border-cyan-200",
            },
            {
              label: "Hospital",
              value: doctorDetails.hospital,
              icon: <FaHospital className="text-blue-500 text-2xl" />,
              gradient: "from-blue-50 to-blue-100",
              border: "border-blue-200",
            },
            {
              label: "Email Address",
              value: doctorDetails.email,
              icon: <FaEnvelope className="text-yellow-500 text-2xl" />,
              gradient: "from-yellow-50 to-yellow-100",
              border: "border-yellow-200",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{
                y: -5,
                boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.1)",
              }}
              className={`bg-gradient-to-br ${item.gradient} rounded-xl p-6 border ${item.border} shadow-md transition-all duration-300`}
            >
              <div className="flex items-start space-x-5">
                <div
                  className={`p-4 bg-white rounded-lg shadow-md ${item.border}`}
                >
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {item.label}
                  </p>
                  <p
                    className={`text-lg font-semibold ${
                      item.label === "Wallet Address"
                        ? "text-cyan-700 font-mono text-sm"
                        : "text-gray-800"
                    } break-all`}
                  >
                    {item.value || (
                      <span className="text-gray-400">Not specified</span>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
