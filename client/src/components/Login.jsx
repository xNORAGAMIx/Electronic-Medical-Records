/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import {
  FaUserInjured,
  FaUserMd,
  FaShieldAlt,
  FaLock,
  FaGlobe,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 left-20 w-80 h-80 bg-cyan-300 rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-300 rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-float-delay"></div>
      </div>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 max-w-3xl px-4"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0a0f2c] mb-4">
          Welcome Back to <span className="text-cyan-400">HealthChain</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          Securely access your blockchain-powered medical records as a{" "}
          <span className="text-cyan-400 font-semibold">Patient</span> or{" "}
          <span className="text-purple-400 font-semibold">
            Healthcare Provider
          </span>
        </p>
      </motion.div>

      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-6xl px-4">
        {[
          {
            icon: <FaLock className="text-2xl" />,
            text: "End-to-end encryption",
            color: "text-cyan-400",
          },
          {
            icon: <FaShieldAlt className="text-2xl" />,
            text: "Biometric authentication",
            color: "text-purple-400",
          },
          {
            icon: <FaGlobe className="text-2xl" />,
            text: "HIPAA compliant",
            color: "text-blue-400",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="flex items-center justify-center bg-white bg-opacity-50 backdrop-blur-sm p-4 rounded-xl shadow-sm"
          >
            <span className={`${item.color} mr-3`}>{item.icon}</span>
            <span className="text-gray-700 font-medium">{item.text}</span>
          </motion.div>
        ))}
      </div>

      {/* Login Cards */}
      <div className="grid gap-8 md:gap-12 md:grid-cols-2 max-w-5xl px-4">
        {/* Patient Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ y: -10 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-cyan-400 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <Link
            to="/patient-login"
            className="relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center border border-gray-100 overflow-hidden"
          >
            <div className="relative mb-6">
              <div className="absolute -inset-2 bg-cyan-400 rounded-full opacity-20 blur-md"></div>
              <FaUserInjured className="relative text-5xl text-cyan-400 z-10" />
            </div>
            <h2 className="text-2xl font-bold text-[#0a0f2c] mb-3">
              Patient Login
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Access your personal health records anytime, anywhere securely.
            </p>
            <div className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-400 text-[#0a0f2c] rounded-lg font-semibold shadow-md hover:shadow-lg transition-all group-hover:scale-105">
              Sign In
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-400"></div>
          </Link>
        </motion.div>

        {/* Doctor Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ y: -10 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-purple-400 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <Link
            to="/doctor-login"
            className="relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center border border-gray-100 overflow-hidden"
          >
            <div className="relative mb-6">
              <div className="absolute -inset-2 bg-purple-400 rounded-full opacity-20 blur-md"></div>
              <FaUserMd className="relative text-5xl text-purple-400 z-10" />
            </div>
            <h2 className="text-2xl font-bold text-[#0a0f2c] mb-3">
              Provider Login
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Securely access patient records with blockchain verification.
            </p>
            <div className="px-8 py-3 bg-gradient-to-r from-purple-400 to-indigo-400 text-[#0a0f2c] rounded-lg font-semibold shadow-md hover:shadow-lg transition-all group-hover:scale-105">
              Sign In
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-indigo-400"></div>
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-center"
      >
        <p className="text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-cyan-400 font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
