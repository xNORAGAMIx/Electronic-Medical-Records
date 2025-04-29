import { useEffect, useState } from "react";
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
    dispatch(connectToDoctor(privateKey, contractAddress, contractABI));

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
        privateKey,
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
      const isBooked = await appointmentContract.isAlreadyBooked(hhNumber, doctorNumber, appointmentDate);

      if(isBooked) {
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
      <div className="max-w-3xl mx-auto bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-blue-800">
              Find Your Healthcare Specialist
            </h2>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"
                />
              </svg>
            </div>
          </div>

          {/* Search Input */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                className="block w-full pl-5 pr-12 py-4 text-lg border-0 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-200 focus:ring-opacity-50 bg-white"
                placeholder="Search by name, specialization, or condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-5 flex items-center">
                <svg
                  className="h-6 w-6 text-blue-400"
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
                <li
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg"
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-5">
                      {/* Doctor Avatar */}
                      <div className="flex-shrink-0">
                        <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 text-2xl font-bold">
                          {doctor.name.charAt(0)}
                        </div>
                      </div>

                      {/* Doctor Info */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-baseline">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {doctor.name}
                          </h3>
                          <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {doctor.specialization}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <svg
                              className="h-4 w-4 mr-1 text-blue-400"
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
                              className="h-4 w-4 mr-1 text-blue-400"
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
                            className="h-4 w-4 mr-1 text-blue-400"
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
                          onClick={() => {
                            handleBooking(doctor.hhNumber);
                          }}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer"
                        >
                          Book Appointment
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No doctors found
              </h3>
              <p className="mt-2 text-gray-500">
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
