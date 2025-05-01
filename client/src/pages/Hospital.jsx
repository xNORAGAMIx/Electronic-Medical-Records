/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaHospital, FaSearch, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";
//import { toast } from "react-toastify";

import {
  connectToDoctor,
  clearDoctorState,
} from "../redux/contract/doctorSlice";

import DoctorRegistration from "../constants/DoctorRegistration.json";

import { DOCTOR_CONTRACT_ADDRESS, PRIVATE_KEY } from "../constants/Values";

const contractABI = DoctorRegistration.abi;
const contractAddress = DOCTOR_CONTRACT_ADDRESS;
const privateKey = PRIVATE_KEY;

const Hospital = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [hospitals, setHospitals] = useState([]);

  const { contract, loading } = useSelector((state) => state.doctor);

  const [searchTerm, setSearchTerm] = useState("");
  const filteredHospitals = hospitals.filter((hospital) =>
    hospital.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // connect to network
  useEffect(() => {
    dispatch(connectToDoctor(contractAddress, contractABI));
  }, [dispatch]);

  // clear state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearDoctorState());
    };
  }, [dispatch]);

  // fetch the hospital list
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const tx = await contract.getAllDoctors();
        const hospitalsList = tx.map((d) => d.hospital);
        setHospitals(hospitalsList);
        console.log(hospitalsList);
      } catch (err) {
        console.log(err);
      }
    };
    if (contract) {
      fetchHospitals();
    }
  }, [contract]);

  const handleClick = (hospitalName) => {
    navigate(`/doctor-list/${encodeURIComponent(hospitalName)}`);
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden -z-10 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-300 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-float"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-purple-300 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-float-delay"></div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-400"></div>
          <p className="text-lg font-medium ml-4 text-[#0a0f2c]">
            Connecting to blockchain...
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0a0f2c] mb-3">
              Healthcare <span className="text-cyan-400">Network</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse hospitals and their medical professionals
            </p>
          </div>

          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
            {/* Search Header */}
            <div className="p-6 bg-gradient-to-r from-[#0a0f2c] to-[#1a1f3c]">
              <div className="relative max-w-xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search hospitals..."
                  className="w-full pl-12 pr-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Hospital List */}
            <div className="p-6">
              {filteredHospitals.length > 0 ? (
                <motion.ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredHospitals.map((hospital, index) => (
                    <motion.li
                      key={index}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleClick(hospital)}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="p-5 flex items-center">
                        <div className="bg-cyan-100 p-3 rounded-lg mr-4">
                          <FaHospital className="text-cyan-500 text-xl" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-[#0a0f2c]">
                            {hospital}
                          </h3>
                          <p className="text-sm text-gray-500">
                            View medical professionals
                          </p>
                        </div>
                        <FaChevronRight className="text-gray-400" />
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FaHospital className="text-gray-400 text-3xl" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    No hospitals found
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {searchTerm
                      ? "No hospitals match your search criteria"
                      : "No hospitals are currently registered in the network"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-80 p-4 rounded-xl border border-gray-200 text-center">
              <div className="text-2xl font-bold text-cyan-500">
                {hospitals.length}
              </div>
              <div className="text-sm text-gray-600">Hospitals</div>
            </div>
            <div className="bg-white bg-opacity-80 p-4 rounded-xl border border-gray-200 text-center">
              <div className="text-2xl font-bold text-purple-500">
                {hospitals.length * 5}+
              </div>
              <div className="text-sm text-gray-600">Departments</div>
            </div>
            <div className="bg-white bg-opacity-80 p-4 rounded-xl border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-500">
                {hospitals.length * 12}+
              </div>
              <div className="text-sm text-gray-600">Medical Professionals</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Hospital;
