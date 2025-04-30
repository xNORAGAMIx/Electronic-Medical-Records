/* eslint-disable no-unused-vars */
import React from "react";
import {
  FaUserMd,
  FaNotesMedical,
  FaLock,
  FaCloudUploadAlt,
  FaCalendarCheck,
  FaKey,
} from "react-icons/fa";
import { motion } from "framer-motion";

const services = [
  {
    title: "Secure Login & Registration",
    description:
      "Patients and doctors can securely register and login using blockchain authentication.",
    icon: <FaLock className="text-4xl" />,
    color: "from-blue-500 to-blue-400",
  },
  {
    title: "Upload Medical Reports",
    description:
      "Patients can upload their medical reports, which are stored securely using IPFS technology.",
    icon: <FaCloudUploadAlt className="text-4xl" />,
    color: "from-green-500 to-green-400",
  },
  {
    title: "Grant Access via Public Key",
    description:
      "Patients grant doctors access to reports using the doctor's public key for enhanced security.",
    icon: <FaKey className="text-4xl" />,
    color: "from-yellow-500 to-yellow-400",
  },
  {
    title: "Book Appointments",
    description:
      "Patients can book appointments with doctors directly through our seamless platform.",
    icon: <FaCalendarCheck className="text-4xl" />,
    color: "from-purple-500 to-purple-400",
  },
  {
    title: "View Prescriptions",
    description:
      "Patients can view doctor's prescriptions issued after appointments in one centralized location.",
    icon: <FaNotesMedical className="text-4xl" />,
    color: "from-red-500 to-red-400",
  },
  {
    title: "Upload Prescriptions",
    description:
      "Doctors can securely upload prescriptions after consultations, stored via decentralized IPFS.",
    icon: <FaCloudUploadAlt className="text-4xl" />,
    color: "from-teal-500 to-teal-400",
  },
  {
    title: "View Appointed Patients",
    description:
      "Doctors can easily manage and view the list of patients who have booked appointments.",
    icon: <FaUserMd className="text-4xl" />,
    color: "from-indigo-500 to-indigo-400",
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Services = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 20 },
          }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our <span className="text-blue-600">Services</span>
          </h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering patients and doctors with secure blockchain and
            IPFS-based healthcare solutions that prioritize privacy and
            accessibility.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col transform group-hover:-translate-y-2">
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center text-white mb-6 mx-auto`}
                >
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-center flex-grow">
                  {service.description}
                </p>
                <div className="mt-6 flex justify-center">
                  <span className="w-8 h-1 bg-blue-500 rounded-full transition-all duration-300 group-hover:w-16"></span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-6">
            Ready to experience the future of healthcare?
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
            Get Started Today
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
