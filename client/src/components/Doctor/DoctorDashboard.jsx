import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setDoctorState } from "../../redux/contract/doctorSlice";
import { connectToBlockchain } from "../../redux/contract/blockchainSlice";

import DoctorRegistration from "../../constants/DoctorRegistration.json";
import PatientRegistration from "../../constants/PatientRegistration.json";
import { DOCTOR_CONTRACT_ADDRESS, PATIENT_CONTRACT_ADDRESS, PRIVATE_KEY } from "../../constants/Values";

//image
import doctorLogo from "../../../public/5053643.jpg";

// initial values
const doctorABI = DoctorRegistration.abi;
const doctorAddress = DOCTOR_CONTRACT_ADDRESS;

const patientABI = PatientRegistration.abi;
const patientAddress = PATIENT_CONTRACT_ADDRESS;
const privateKey = PRIVATE_KEY;

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {licenceNumber} = useParams();

  console.log(licenceNumber)

  const doctorContract = useSelector((state) => state.doctor?.contract);
  const patientContract = useSelector((state) => state.patient?.contract);

  const [doctorDetails, setDoctorDetails] = useState({});
  const [patientList, setPatientList] = useState([]);

  // Connect to blockchain
  useEffect(() => {
    dispatch(setDoctorState(privateKey, doctorAddress, doctorABI));
    dispatch(connectToBlockchain(privateKey, patientAddress, patientABI));
  }, [dispatch]);

  // Fetch doctor details
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const doctor = await doctorContract.getDoctorDetails(licenceNumber);
        setDoctorDetails(doctor);
      } catch (err) {
        console.error(err);
      }
    };

    if (doctorContract) {
      fetchDoctorDetails();
    }
  }, [doctorContract]);

  // Fetch list of patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patients = await patientContract.getAllPatients();
        setPatientList(patients);
      } catch (err) {
        console.error(err);
      }
    };

    if (patientContract) {
      fetchPatients();
    }
  }, [patientContract]);

  return (
    <div className="min-h-screen w-full p-6 bg-gray-200 flex flex-col space-y-8">
      
      {/* Doctor Profile */}
      <div className="bg-white shadow-lg rounded-2xl p-8 space-y-8 w-full max-w-7xl mx-auto">
        <div className="flex flex-col items-center space-y-4">
          <img
            src={doctorLogo}
            alt="Doctor Profile"
            className="w-36 h-36 rounded-full shadow-lg border-4 border-gray-200"
          />
          <h2 className="text-3xl font-semibold text-gray-800 border-b-2 pb-2 mt-4">
            Doctor Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { label: "Name", value: doctorDetails.name, icon: "👨‍⚕️" },
            { label: "Specialization", value: doctorDetails.specialization, icon: "🩺" },
            { label: "Wallet Address", value: doctorDetails.walletAddress, icon: "💳" },
            { label: "Hospital", value: doctorDetails.hospital, icon: "🏥" },
            { label: "Email", value: doctorDetails.email, icon: "📧" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition"
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-md font-medium text-gray-500">{item.label}</p>
                <p className="text-lg text-gray-800 font-semibold">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white shadow-lg rounded-2xl p-8 space-y-8 w-full max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 border-b-2 pb-2">
          Patient List
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {patientList.map((patient, idx) => (
            <div
              key={idx}
              className="bg-gray-100 rounded-lg p-4 flex flex-col space-y-2 hover:shadow-lg transition"
            >
              <p className="font-semibold text-lg">{patient.name}</p>
              <p className="text-sm text-gray-600">Wallet: {patient.walletAddress}</p>
              <p className="text-sm text-gray-600">DOB: {patient.dateOfBirth}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
