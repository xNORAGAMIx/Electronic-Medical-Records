/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaUserInjured, FaCalendarAlt, FaChevronRight } from "react-icons/fa";

// Appointment Redux
import {
  connectToAppoint,
  clearAppointementState,
} from "../redux/contract/appointmentSlice";

// Patient Redux
import {
  connectToBlockchain,
  clearBlockchainState,
} from "../redux/contract/blockchainSlice";

// Contract Addresses
import {
  APPOINTMENT_CONTRACT_ADDRESS,
  PATIENT_CONTRACT_ADDRESS,
  PRIVATE_KEY,
} from "../constants/Values";

// Contracts JSON imports
import AppointmentBooking from "../constants/AppointmentBooking.json";
import PatientRegistration from "../constants/PatientRegistration.json";

const contractABI = AppointmentBooking.abi;
const contractAddress = APPOINTMENT_CONTRACT_ADDRESS;
const patientContractABI = PatientRegistration.abi;
const patientContractAddress = PATIENT_CONTRACT_ADDRESS;
const privateKey = PRIVATE_KEY;

const AppointmentDoctor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [count, setCount] = useState("");
  const [appointments, setAppointments] = useState([]);

  const { contract, loading: appointmentLoading } = useSelector((state) => state.appointment);
  const { licenseNumber } = useSelector((state) => state.user);
  const { contract: patientContract, loading: patientLoading } = useSelector((state) => state.blockchain);

  // connect to network
  useEffect(() => {
    dispatch(connectToAppoint(privateKey, contractAddress, contractABI));
    dispatch(connectToBlockchain(privateKey, patientContractAddress, patientContractABI));
  }, [dispatch]);

  // clear state on component unmount
  useEffect(() => {
    return () => {
      dispatch(clearAppointementState());
      dispatch(clearBlockchainState());
    };
  }, [dispatch]);

  function getDateTimestamp(date) {
    const midnight = new Date(date);
    midnight.setHours(0, 0, 0, 0);
    return Math.floor(midnight.getTime() / 1000);
  }

  // fetch the count of appointments for doctor
  useEffect(() => {
    const fetchCountAppointments = async () => {
      const selectedDate = new Date();
      const appointmentDate = getDateTimestamp(selectedDate);

      try {
        const tx = await contract.getDoctorAppointmentsCount(
          licenseNumber,
          appointmentDate
        );
        setCount(tx);
      } catch (err) {
        console.log(err);
      }
    };
    if (contract) {
      fetchCountAppointments();
    }
  }, [contract, licenseNumber]);

  // fetch the appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const tx = await contract.getAppointments();

        const parsedAppointments = tx
          .map((item) => ({
            patientId: item[0],
            doctorId: item[1],
            timestamp: Number(item[2]),
          }))
          .filter((appointment) => appointment.doctorId === licenseNumber);

        const dx = await patientContract.getAllPatients();
        const patients = dx.map((d) => ({
          walletAddress: d[0],
          name: d[1],
          dateOfBirth: d[2],
          hhNumber: d[7],
        }));

        const mergedData = parsedAppointments
          .map((appointment) => {
            const patient = patients.find(
              (p) => p.hhNumber === appointment.patientId
            );
            return patient ? { ...appointment, ...patient } : null;
          })
          .filter(Boolean);

        setAppointments(mergedData);
        toast.success("Appointments fetched successfully.");
      } catch (err) {
        console.log(err);
        toast.error("Error fetching appointments.");
      }
    };
    if (contract && patientContract) {
      fetchAppointments();
    }
  }, [contract, patientContract, licenseNumber]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleViewPatient = (walletAddress) => {
    navigate(`/prescribe/${walletAddress}`);
  };

  if (appointmentLoading || patientLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-400"></div>
        <p className="text-lg font-medium ml-4 text-[#0a0f2c]">
          Connecting to blockchain...
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0a0f2c] mb-3">
            Patient <span className="text-cyan-400">Appointments</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            View and manage your scheduled patient appointments
          </p>
        </div>

        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
          {/* Header with count */}
          <div className="p-6 bg-gradient-to-r from-[#0a0f2c] to-[#1a1f3c]">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Today's Appointments</h2>
              <div className="bg-cyan-500 text-white px-4 py-2 rounded-lg">
                {count} appointment{count !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          {/* Appointments list */}
          <div className="divide-y divide-gray-200">
            {appointments.length > 0 ? (
              appointments.map((appointment, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleViewPatient(appointment.walletAddress)}
                  className="p-5 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex items-start">
                    <div className="bg-cyan-100 p-3 rounded-lg mr-4">
                      <FaUserInjured className="text-cyan-500 text-xl" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-[#0a0f2c]">
                            {appointment.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            <span className="font-medium">Age:</span> {calculateAge(appointment.dateOfBirth)} years
                          </p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            <span className="font-medium">Wallet:</span> {appointment.walletAddress}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                            <FaCalendarAlt className="mr-1" />
                            {formatDate(appointment.timestamp)}
                          </div>
                          <FaChevronRight className="text-gray-400 ml-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaCalendarAlt className="text-gray-400 text-3xl" />
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No appointments scheduled
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  You don't have any appointments for today
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-80 p-4 rounded-xl border border-gray-200 text-center">
            <div className="text-2xl font-bold text-cyan-500">{count}</div>
            <div className="text-sm text-gray-600">Today's Appointments</div>
          </div>
          <div className="bg-white bg-opacity-80 p-4 rounded-xl border border-gray-200 text-center">
            <div className="text-2xl font-bold text-purple-500">
              6
            </div>
            <div className="text-sm text-gray-600">Avg. Weekly</div>
          </div>
          <div className="bg-white bg-opacity-80 p-4 rounded-xl border border-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-500">
              150
            </div>
            <div className="text-sm text-gray-600">Estimated Monthly</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AppointmentDoctor;