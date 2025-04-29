import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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

// constants setup
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

  const { contract } = useSelector((state) => state.appointment);
  const { licenseNumber } = useSelector((state) => state.user);
  const patientContract = useSelector((state) => state.blockchain.contract);

  // connect to network
  useEffect(() => {
    dispatch(connectToAppoint(privateKey, contractAddress, contractABI));
    dispatch(
      connectToBlockchain(
        privateKey,
        patientContractAddress,
        patientContractABI
      )
    );
  }, [dispatch]);

  // clear state on component unmount
  useEffect(() => {
    return () => {
      dispatch(clearAppointementState());
      dispatch(clearBlockchainState());
    };
  }, [dispatch]);

  // date function
  function getDateTimestamp(date) {
    const midnight = new Date(date);
    midnight.setHours(0, 0, 0, 0); // Set time to 00:00:00
    return Math.floor(midnight.getTime() / 1000); // Convert milliseconds to seconds
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

        // proxy to json
        const parsedAppointments = tx
          .map((item) => ({
            patientId: item[0],
            doctorId: item[1],
            timestamp: Number(item[2]),
          }))
          .filter((appointment) => appointment.doctorId === licenseNumber);

        // fetching patients
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
            if (patient) {
              return {
                ...appointment,
                ...patient,
              };
            }
            return null; // or keep only appointment if you want: { ...appointment }
          })
          .filter((entry) => entry !== null); // remove unmatched appointments

        setAppointments(mergedData);
        console.log(mergedData);
        toast.success("Appointed fetched successfully.");
      } catch (err) {
        console.log(err);
        toast.error("Error in fetching the appointments.");
      }
    };
    if (contract && patientContract) {
      fetchAppointments();
    }
  }, [contract, patientContract, licenseNumber]);

  // format the date from timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  // Calculate age from date of birth
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleViewPatient = (walletAddress) => {
    navigate(`/prescribe/${walletAddress}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header with count */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="mt-2 opacity-90">
            Total: <span className="font-semibold">{count}</span> appointment
            {appointments.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Appointments list */}
        <div className="divide-y divide-gray-200">
          {appointments.map((appointment, index) => (
            <div
              onClick={() => {
                handleViewPatient(appointment.walletAddress);
              }}
              key={index}
              className="p-6 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {appointment.name}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    <span className="font-medium">Wallet:</span>{" "}
                    {appointment.walletAddress}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Age:</span>{" "}
                    {calculateAge(appointment.dateOfBirth)} years
                  </p>
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {formatDate(appointment.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDoctor;
