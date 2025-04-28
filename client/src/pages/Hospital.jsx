import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  connectToBlockchain,
  clearDoctorState,
} from "../redux/contract/doctorSlice";

import DoctorRegistration from "../constants/DoctorRegistration.json";
import { useDispatch, useSelector } from "react-redux";

import { DOCTOR_CONTRACT_ADDRESS, PRIVATE_KEY } from "../constants/Values";
import { useNavigate } from "react-router-dom";

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
    dispatch(connectToBlockchain(privateKey, contractAddress, contractABI));
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
        // console.log(tx);
        // const doctors = tx.map((d) => ({
        //   walletAddress: d.walletAddress,
        //   name: d.name,
        //   specialization: d.specialization,
        //   hhNumber: d.hhNumber,
        //   email: d.email,
        //   hospital: d.hospital,
        //   password: d.password,
        // }));
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
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Find Hospitals
        </h2>

        {/* Search Input */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search hospitals..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Hospital List */}
        {filteredHospitals.length > 0 ? (
          <ul className="space-y-3">
            {filteredHospitals.map((hospital, index) => (
              <li
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-700">{hospital}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-4">
            No hospitals found matching your search
          </p>
        )}
      </div>
    </>
  );
};

export default Hospital;
