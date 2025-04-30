/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaGlobe } from 'react-icons/fa';

const developers = [
  {
    name: 'Manas Das',
    role: 'Full Stack & Blockchain Developer',
    img: '/dev-manas.jpeg', // Replace with real image URL
    bio: 'Specialized in building decentralized applications with React, Node.js, and Solidity.',
    links: [
      { icon: <FaGithub />, url: 'https://github.com/xNORAGAMIx' },
      { icon: <FaLinkedin />, url: 'https://www.linkedin.com/in/manas-d-552168146/' },
      { icon: <FaGlobe />, url: 'https://das-manas.vercel.app/' }
    ]
  },
  {
    name: 'Preeti Gautam',
    role: 'UI/UX, MERN Stack Developer',
    img: '/dev-preeti.jpeg', // Replace with real image URL
    bio: 'Passionate about creating intuitive user experiences and secure smart contracts.',
    links: [
      { icon: <FaGithub />, url: 'https://github.com/preeti0411gautam' },
      { icon: <FaLinkedin />, url: 'https://www.linkedin.com/in/preeti-gautam-704179137/' },
      { icon: <FaGlobe />, url: 'https://gautam-preeti-411.vercel.app/' }
    ]
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const About = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Life Ledger */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-cyan-400">Life Ledger</span>
          </h2>
          <div className="w-24 h-1 bg-cyan-400 mx-auto mb-8 rounded-full"></div>
          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            <strong className="font-semibold text-gray-800">Life Ledger</strong> is a revolutionary decentralized healthcare platform that leverages <span className="text-blue-500">Blockchain</span> and <span className="text-green-500">IPFS</span> to securely store and manage medical records. Patients have full control over their health data and can share access with doctors using public-key cryptography.
          </p>
        </motion.div>

        {/* Platform Features */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          {[
            {
              title: "Patient Control",
              desc: "Full ownership of medical records"
            },
            {
              title: "Secure Sharing",
              desc: "Public-key cryptography for data access"
            },
            {
              title: "Tamper-Proof",
              desc: "Immutable records on blockchain"
            }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-blue-500">
              <h4 className="font-bold text-lg text-gray-800 mb-2">{feature.title}</h4>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Meet the Developers */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Meet the Team</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            The talented developers behind Life Ledger
          </p>
        </motion.div>

        {/* Developer Cards */}
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {developers.map((dev, idx) => (
            <motion.div
              key={idx}
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + idx * 0.2 }}
              className="group"
            >
              <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden h-full hover:shadow-xl transition-all duration-300">
                <div className="md:w-1/3 p-6 flex justify-center">
                  <div className="relative">
                    <img
                      src={dev.img}
                      alt={dev.name}
                      className="w-40 h-40 object-cover rounded-full border-4 border-white shadow-md"
                    />
                    <div className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  </div>
                </div>
                <div className="md:w-2/3 p-6 md:p-8 flex flex-col justify-center">
                  <h4 className="text-2xl font-bold text-gray-800 mb-1">{dev.name}</h4>
                  <p className="text-blue-600 font-medium mb-3">{dev.role}</p>
                  <p className="text-gray-600 mb-5">{dev.bio}</p>
                  
                  <div className="flex space-x-4">
                    {dev.links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-blue-600 transition-colors duration-200 text-xl"
                        aria-label={`${dev.name}'s profile`}
                      >
                        {link.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
 
        </motion.div>
      </div>
    </section>
  );
};

export default About;