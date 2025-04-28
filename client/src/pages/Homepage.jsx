/* eslint-disable no-unused-vars */
import React from "react";
import { FaShieldAlt, FaLock, FaUserMd, FaFileMedical } from "react-icons/fa";
import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-100 text-black py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Blockchain-Powered EMR
          </h1>
          <p className="text-lg md:text-2xl mt-4 mb-8">
            Secure, Transparent, and Accessible Medical Records Anytime, Anywhere
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg cursor-pointer font-semibold transition shadow-lg">
            Get Started
          </button>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 px-6 md:px-12 bg-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: <FaShieldAlt className="text-5xl text-teal-500" />,
              title: "Immutable Security",
              desc: "Your records are tamper-proof and securely stored using blockchain.",
              img: "https://img.freepik.com/premium-vector/blockchain-cybersecurity-isolated-cartoon-vector-illustrations_107173-21524.jpg?w=740"
            },
            {
              icon: <FaLock className="text-5xl text-orange-500" />,
              title: "Privacy First",
              desc: "Only authorized users can access the medical data.",
              img: "https://img.freepik.com/free-vector/protected-personal-data-laptop-isometric-illustration-with-colorful-elements-white_1284-63284.jpg?t=st=1743154971~exp=1743158571~hmac=5da452a4c7a1a06cdbcc3113104723b42bddea006c9dbfa26031a3ba0a617cf1&w=740"
            },
            {
              icon: <FaUserMd className="text-5xl text-purple-500" />,
              title: "Seamless Accessibility",
              desc: "Patients and doctors can access records globally.",
              img: "https://img.freepik.com/free-vector/electronic-accessibility-concept-illustration_114360-20320.jpg?t=st=1743155020~exp=1743158620~hmac=50351c4dc4db6b3250fc9f52418fecf1177a4bf798e3ea60a8e5123486ef5d60&w=740"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white shadow-lg rounded-2xl overflow-hidden transition duration-300 hover:shadow-2xl"
            >
              <img src={item.img} alt={item.title} className="w-full h-48 object-contain" />
              <div className="p-6 text-center">
                {item.icon}
                <h2 className="text-2xl font-bold mt-4">{item.title}</h2>
                <p className="text-gray-600 mt-2">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: <FaFileMedical className="text-5xl text-teal-600" />,
                title: "Record Creation",
                desc: "Doctors create medical records securely stored on the blockchain.",
                img: "https://source.unsplash.com/400x300/?medical,records"
              },
              {
                icon: <FaLock className="text-5xl text-orange-600" />,
                title: "Encrypted Storage",
                desc: "Records are encrypted and only accessible to authorized users.",
                img: "https://source.unsplash.com/400x300/?encryption,security"
              },
              {
                icon: <FaUserMd className="text-5xl text-purple-600" />,
                title: "Global Access",
                desc: "Patients and providers access records using private keys.",
                img: "https://source.unsplash.com/400x300/?global,healthcare"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-100 rounded-2xl shadow-lg overflow-hidden transition duration-300 hover:shadow-xl"
              >
                <img src={item.img} alt={item.title} className="w-full h-48 object-cover" />
                <div className="p-6 text-center">
                  {item.icon}
                  <h3 className="text-2xl font-bold mt-4">{item.title}</h3>
                  <p className="text-gray-600 mt-2">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              {
                name: "Dr. Aisha Khan",
                role: "Cardiologist",
                quote: "The blockchain-powered EMR ensures complete data integrity and easy accessibility.",
                img: "https://source.unsplash.com/150x150/?doctor"
              },
              {
                name: "Rohan Sharma",
                role: "Patient",
                quote: "I feel secure knowing my medical data is private and protected.",
                img: "https://source.unsplash.com/150x150/?patient"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl shadow-lg p-8 transition duration-300 hover:shadow-2xl"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4"
                />
                <p className="text-gray-600 italic mb-4">"{item.quote}"</p>
                <h4 className="font-bold">{item.name}</h4>
                <span className="text-gray-500">{item.role}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p className="text-gray-400">
              Empowering healthcare with blockchain-secured medical records.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Links</h3>
            <ul className="text-gray-400 space-y-2">
              <li><a href="#" className="hover:text-orange-500">Home</a></li>
              <li><a href="#" className="hover:text-orange-500">Features</a></li>
              <li><a href="#" className="hover:text-orange-500">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="text-gray-400">Email: support@emrapp.com</p>
            <p className="text-gray-400">Phone: +1 (123) 456-7890</p>
          </div>
        </div>
        <div className="text-center text-gray-500 mt-8">
          &copy; {new Date().getFullYear()} EMR App. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
