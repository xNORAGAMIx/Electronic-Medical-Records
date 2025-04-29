import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  connectToAppoint,
  clearAppointementState,
} from "../redux/contract/appointmentSlice";

import {
  connectToDoctor,
  clearDoctorState,
} from "../redux/contract/doctorSlice";

import {
  APPOINTMENT_CONTRACT_ADDRESS,
  DOCTOR_CONTRACT_ADDRESS,
  PRIVATE_KEY,
} from "../constants/Values";
import { useDispatch, useSelector } from "react-redux";

import AppointmentBooking from "../constants/AppointmentBooking.json";
import DoctorRegistration from "../constants/DoctorRegistration.json";

const contractAbi = AppointmentBooking.abi;
const contractAddress = APPOINTMENT_CONTRACT_ADDRESS;

const doctorContractAbi = DoctorRegistration.abi;
const doctorContractAddress = DOCTOR_CONTRACT_ADDRESS;

const privateKey = PRIVATE_KEY;

const Appointments = () => {
  const dispatch = useDispatch();

  const [appointments, setAppointments] = useState([]);

  const hhNumber = useSelector((state) => state.user.hhNumber);
  const { contract } = useSelector((state) => state.appointment);

  const doctorContract = useSelector((state) => state.doctor.contract);

  // connect to network
  useEffect(() => {
    dispatch(connectToAppoint(privateKey, contractAddress, contractAbi));

    dispatch(
      connectToDoctor(privateKey, doctorContractAddress, doctorContractAbi)
    );
  }, [dispatch]);

  // clear state on component unmount
  useEffect(() => {
    return () => {
      dispatch(clearAppointementState());
      dispatch(clearDoctorState());
    };
  }, [dispatch]);

  // fetching appointments
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
          .filter((appointment) => appointment.patientId === hhNumber);

        setAppointments(parsedAppointments);
        console.log(parsedAppointments);

        toast.success("Appointments fetched successfully!");
      } catch (err) {
        console.log(err);
        toast.error("Error in fetching appointments.");
      }
    };
    if (contract) {
      fetchAppointments();
    }
  }, [contract, hhNumber]);

  // fetching doctors list
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const tx = await doctorContract.getAllDoctors();
        console.log(tx);
      } catch (err) {
        console.log(err);
      }
    };
    if (doctorContract) {
      fetchDoctors();
    }
  }, [doctorContract]);
  return <div></div>;
};

export default Appointments;
