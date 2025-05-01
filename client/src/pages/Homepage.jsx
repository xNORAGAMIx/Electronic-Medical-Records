/* eslint-disable no-unused-vars */
import React from "react";
import {
  FaShieldAlt,
  FaLock,
  FaUserMd,
  FaFileMedical,
  FaGlobe,
  FaChartLine,
  FaUserShield,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#0a0f2c] to-[#1a1f3c] text-white pt-32 pb-24 px-6 md:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold leading-tight mb-6"
          >
            <span className="text-cyan-300">Secure</span> Medical Records on
            Blockchain
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Immutable, decentralized electronic health records with
            military-grade security
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              to="/login"
              className="inline-flex items-center bg-cyan-400 hover:bg-cyan-500 text-[#0a0f2c] px-8 py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Sign in <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-300 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-300 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a0f2c] mb-4">
              Why Choose LifeLedger?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Revolutionizing healthcare with blockchain technology for secure,
              transparent medical records
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaShieldAlt className="text-4xl text-cyan-400" />,
                title: "Immutable Records",
                desc: "Tamper-proof medical history stored on decentralized blockchain",
                bg: "bg-gradient-to-br from-cyan-50 to-blue-50",
              },
              {
                icon: <FaUserShield className="text-4xl text-purple-400" />,
                title: "Patient Control",
                desc: "You decide who accesses your health information",
                bg: "bg-gradient-to-br from-purple-50 to-indigo-50",
              },
              {
                icon: <FaGlobe className="text-4xl text-blue-400" />,
                title: "Global Access",
                desc: "Access your records anywhere, anytime",
                bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`${item.bg} p-8 rounded-2xl shadow-md hover:shadow-lg transition-all`}
              >
                <div className="flex justify-center mb-6">{item.icon}</div>
                <h3 className="text-xl font-bold text-[#0a0f2c] mb-3 text-center">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-center">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a0f2c] mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple, secure process for managing your health records
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaFileMedical className="text-4xl text-cyan-400" />,
                title: "1. Record Creation",
                desc: "Healthcare providers create encrypted records stored on blockchain",
                border: "border-cyan-200",
              },
              {
                icon: <FaLock className="text-4xl text-purple-400" />,
                title: "2. Secure Storage",
                desc: "Data is cryptographically secured with private key access",
                border: "border-purple-200",
              },
              {
                icon: <FaUserMd className="text-4xl text-blue-400" />,
                title: "3. Controlled Access",
                desc: "Patients grant permission to doctors and institutions",
                border: "border-blue-200",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className={`border-t-4 ${item.border} bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all`}
              >
                <div className="flex justify-center mb-6">{item.icon}</div>
                <h3 className="text-xl font-bold text-[#0a0f2c] mb-3 text-center">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-center">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-br from-[#0a0f2c] to-[#1a1f3c]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              What doctors and patients say about our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Dr. Aisha Khan",
                role: "Cardiologist, Metro Hospital",
                quote:
                  "LifeLedger has transformed how we manage patient records with its unparalleled security and accessibility.",
                img: "https://randomuser.me/api/portraits/women/44.jpg",
              },
              {
                name: "Rohan Sharma",
                role: "Patient",
                quote:
                  "Finally, a medical records system that puts patients in control of their own health data.",
                img: "https://randomuser.me/api/portraits/men/32.jpg",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-cyan-400 transition-all"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-16 h-16 rounded-full border-2 border-cyan-400"
                  />
                  <div className="ml-4">
                    <h4 className="text-xl font-semibold text-white">
                      {item.name}
                    </h4>
                    <p className="text-cyan-300">{item.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{item.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {/* CTA Section */}

      <section className="py-20 px-6 md:px-12 bg-gradient-to-r from-[#0a0f2c] to-[#1a2350]">
        <div className="max-w-4xl mx-auto text-center  ">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            <span className="text-cyan-300">Ready</span> to Transform Your
            Medical Records?
          </h2>
          <p className="text-gray-300 text-xl mb-8">
            Join healthcare's secure blockchain revolution today
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-cyan-400 hover:bg-cyan-500 text-[#0a0f2c] px-8 py-4 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Get Started <FiArrowRight />
            </Link>
            <Link
              to="/contact"
              className="bg-transparent border-2 border-cyan-400 text-cyan-400 px-8 py-4 rounded-lg font-bold transition-all hover:bg-cyan-400 hover:text-[#0a0f2c] hover:border-transparent"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
        {/* Subtle blockchain pattern overlay
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwMDAwIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2U9IiNmZmYiPjwvcGF0aD4KPC9zdmc+')]"></div> */}
      </section>
    </div>
  );
};

export default HomePage;
