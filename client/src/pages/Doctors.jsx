/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUserInjured } from "react-icons/fa";
import { toast } from "react-toastify";

import {
  clearDoctorState,
  connectToDoctor,
} from "../redux/contract/doctorSlice";

import {
  connectToAppoint,
  clearAppointementState,
} from "../redux/contract/appointmentSlice";

// import {
//   connectToBlockchain,
//   clearBlockchainState,
// } from "../redux/contract/blockchainSlice";

import DoctorRegistration from "../constants/DoctorRegistration.json";
import AppointmentBooking from "../constants/AppointmentBooking.json";
// import PatientRegistration from "../constants/PatientRegistration.json";
import { useDispatch, useSelector } from "react-redux";

import {
  DOCTOR_CONTRACT_ADDRESS,
  PRIVATE_KEY,
  APPOINTMENT_CONTRACT_ADDRESS,
  // PATIENT_CONTRACT_ADDRESS,
} from "../constants/Values";
import { useParams } from "react-router-dom";

const contractABI = DoctorRegistration.abi;
const appointmentContractABI = AppointmentBooking.abi;
//const patientContractABI = PatientRegistration.abi;

const appointmentContractAddress = APPOINTMENT_CONTRACT_ADDRESS;
const contractAddress = DOCTOR_CONTRACT_ADDRESS;
//const patientContractAddress = PATIENT_CONTRACT_ADDRESS;

const privateKey = PRIVATE_KEY;

const Doctors = () => {
  // doctor slice
  const { contract, loading } = useSelector((state) => state.doctor);
  // user slice
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const hhNumber = useSelector((state) => state.user.hhNumber);

  // // patient slice
  // const patientContract = useSelector((state) => state.blockchain.contract);
  // const patientLoading = useSelector((state) => state.blockchain.loading);
  // const patientAccount = useSelector((state) => state.blockchain.account);
  // appointment slice
  const appointmentContract = useSelector(
    (state) => state.appointment.contract
  );
  // const appointmentLoading = useSelector((state) => state.appointment.loading);
  // const appointmentAccount = useSelector((state) => state.appointment.account);

  const { hospitalName } = useParams();

  const dispatch = useDispatch();

  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // filtering array for searching
  const filteredDoctors = doctors.filter((doctor) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(searchLower) ||
      doctor.specialization.toLowerCase().includes(searchLower)
    );
  });

  // connect to network
  useEffect(() => {
    // doctor dispatch
    dispatch(connectToDoctor(contractAddress, contractABI));

    // patient dispatch
    // dispatch(
    //   connectToBlockchain(
    //     privateKey,
    //     patientContractAddress,
    //     patientContractABI
    //   )
    // );

    // appointment dispatch
    dispatch(
      connectToAppoint(
        appointmentContractAddress,
        appointmentContractABI
      )
    );
  }, [dispatch]);

  // clear state when component unmounts
  useEffect(() => {
    return () => {
      // doctor
      dispatch(clearDoctorState());
      // patient
      //dispatch(clearBlockchainState());
      // appointment
      dispatch(clearAppointementState());
    };
  }, [dispatch]);

  // fetch the doctors list
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const tx = await contract.getAllDoctors();
        const allDoctors = tx.map((d) => ({
          walletAddress: d[0],
          name: d[1],
          specialization: d[2],
          hhNumber: d[3],
          email: d[4],
          hospital: d[5],
          password: d[6],
        }));

        console.log(allDoctors);

        const filterDoc = allDoctors.filter(
          (doc) => doc.hospital === hospitalName
        );
        setDoctors(filterDoc);
      } catch (err) {
        console.log(err);
      }
    };
    if (contract) {
      fetchHospitals();
    }
  }, [contract, hospitalName]);

  // date conversion
  function getDateTimestamp(date) {
    const midnight = new Date(date);
    midnight.setHours(0, 0, 0, 0); // Set time to 00:00:00
    return Math.floor(midnight.getTime() / 1000); // Convert milliseconds to seconds
  }

  const handleBooking = async (doctorNumber) => {
    if (!isLoggedIn) {
      toast.error("You need to login first!");
      return;
    }
    if (!appointmentContract) {
      toast.error("Contract unavailable please wait.");
      return;
    }

    const selectedDate = new Date();
    const appointmentDate = getDateTimestamp(selectedDate);
    try {
      const isBooked = await appointmentContract.isAlreadyBooked(
        hhNumber,
        doctorNumber,
        appointmentDate
      );

      if (isBooked) {
        toast.error("You have already booked an appointment!");
        return;
      }

      const tx = await appointmentContract.bookAppointment(
        hhNumber,
        doctorNumber,
        appointmentDate
      );
      await tx.wait();
      toast.success("Appointment booked!");
    } catch (err) {
      console.log(err);
      toast.error("Error making an appointment.");
    }
  };

  //contract loading
  if (loading) {
    return <div>Loading blockchain connection...</div>;
  }

  return (
    <>
      <div className="text-center mb-12 mt-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0a0f2c] mb-3">
          Doctors <span className="text-cyan-400">Available</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          View and book appointment with doctors for your medical needs
        </p>
      </div>
      <div className="max-w-4xl mx-auto bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-[#0a0f2c] to-[#1a1f3c]">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">
              Find Your Healthcare Specialist
            </h2>
            <div className="bg-cyan-500 text-white p-3 rounded-lg">
              <FaUserInjured className="text-xl" />
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Search Input */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                className="block w-full pl-5 pr-12 py-4 text-lg border-0 rounded-xl shadow-sm focus:ring-4 focus:ring-cyan-200 focus:ring-opacity-50 bg-gray-50"
                placeholder="Search by name, specialization, or condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-5 flex items-center">
                <svg
                  className="h-6 w-6 text-cyan-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Doctors List */}
          {filteredDoctors.length > 0 ? (
            <ul className="space-y-6">
              {filteredDoctors.map((doctor, index) => (
                <motion.li
                  key={index}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg"
                >
                  <div className="p-5">
                    <div className="flex items-start space-x-5">
                      {/* Doctor Avatar */}
                      <div className="flex-shrink-0">
                        <div className="h-16 w-16 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-800 text-2xl font-bold">
                          {doctor.name.charAt(0)}
                        </div>
                      </div>

                      {/* Doctor Info */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-baseline">
                          <h3 className="text-lg font-semibold text-[#0a0f2c]">
                            {doctor.name}
                          </h3>
                          <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {doctor.specialization}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <svg
                              className="h-4 w-4 mr-1 text-cyan-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            {doctor.email}
                          </div>

                          <div className="flex items-center text-gray-600">
                            <svg
                              className="h-4 w-4 mr-1 text-cyan-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {doctor.hospital || "City Hospital"}
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-gray-500">
                          <svg
                            className="h-4 w-4 mr-1 text-cyan-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="truncate">
                            Wallet: {doctor.walletAddress}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex flex-col items-end space-y-3">
                        <button
                          onClick={() => handleBooking(doctor.hhNumber)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200 cursor-pointer"
                        >
                          Book Appointment
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaUserInjured className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No doctors found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm
                  ? `No doctors match "${searchTerm}". Try a different search term.`
                  : "Currently no doctors available. Please check back later."}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Doctors;
