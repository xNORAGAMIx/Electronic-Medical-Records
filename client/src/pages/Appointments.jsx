import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// Appointment Redux
import {
  connectToAppoint,
  clearAppointementState,
} from "../redux/contract/appointmentSlice";

// Doctor Redux
import {
  connectToDoctor,
  clearDoctorState,
} from "../redux/contract/doctorSlice";

// Upload Redux
import { connectToUpload } from "../redux/contract/uploadSlice";

// Contract Addresses
import {
  APPOINTMENT_CONTRACT_ADDRESS,
  DOCTOR_CONTRACT_ADDRESS,
  UPLOAD_CONTRACT_ADDRESS,
  PRIVATE_KEY,
} from "../constants/Values";

// Contracts JSON imports
import AppointmentBooking from "../constants/AppointmentBooking.json";
import DoctorRegistration from "../constants/DoctorRegistration.json";
import Upload from "../constants/Upload.json";

// setting up constants

const contractAbi = AppointmentBooking.abi;
const contractAddress = APPOINTMENT_CONTRACT_ADDRESS;

const doctorContractAbi = DoctorRegistration.abi;
const doctorContractAddress = DOCTOR_CONTRACT_ADDRESS;

const uploadContractAbi = Upload.abi;
const uploadContractAddress = UPLOAD_CONTRACT_ADDRESS;

const privateKey = PRIVATE_KEY;

const Appointments = () => {
  const dispatch = useDispatch();

  // appointment states
  const [appointments, setAppointments] = useState([]);

  // access states

  const hhNumber = useSelector((state) => state.user.hhNumber);

  // appointment contract
  const { contract } = useSelector((state) => state.appointment);

  // doctor contract
  const doctorContract = useSelector((state) => state.doctor.contract);

  // upload contract
  const uploadContract = useSelector((state) => state.upload.contract);

  // connect to network
  useEffect(() => {
    dispatch(connectToAppoint(privateKey, contractAddress, contractAbi));

    dispatch(
      connectToDoctor(privateKey, doctorContractAddress, doctorContractAbi)
    );

    dispatch(
      connectToUpload(privateKey, uploadContractAddress, uploadContractAbi)
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

        // proxy to json
        const parsedAppointments = tx
          .map((item) => ({
            patientId: item[0],
            doctorId: item[1],
            timestamp: Number(item[2]),
          }))
          .filter((appointment) => appointment.patientId === hhNumber);

        // doctors with appointments
        const dx = await doctorContract.getAllDoctors();
        const doctorList = dx.map((d) => ({
          walletAddress: d[0],
          name: d[1],
          specialization: d[2],
          hhNumber: d[3],
          email: d[4],
          hospital: d[5],
        }));

        const combined = parsedAppointments
          ?.map((appointment) => {
            const doctor = doctorList?.find(
              (doc) => String(doc.hhNumber) === appointment.doctorId
            );
            if (doctor) {
              return {
                ...appointment,
                doctor: doctor,
              };
            }
            return null;
          })
          .filter((item) => item !== null);

        setAppointments(combined);
        toast.success("Appointments fetched successfully!");
        console.log(combined);
      } catch (err) {
        console.log(err);
        toast.error("Error in fetching appointments.");
      }
    };
    if (contract && doctorContract) {
      fetchAppointments();
    }
  }, [contract, doctorContract, hhNumber]);

  // handle provide access
  const handleShare = async (address) => {
    try {
      const txn = await uploadContract.allow(address);
      await txn.wait();
      toast.success(`Shared access to ${address}`);
      console.log(`Shared access to ${address}`);
    } catch (err) {
      console.log(err);
      toast.error("Error in sharing access!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Appointment Records
      </h1>

      <div className="space-y-4">
        {appointments.map((record, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 relative"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Patient Name - {record.patientId}
                  </h2>
                  <p className="text-gray-600">
                    Timestamp:{" "}
                    {new Date(record.timestamp * 1000).toLocaleString()}
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Doctor ID: {record.doctor.walletAddress}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Doctor Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{record.doctor.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Specialization</p>
                    <p className="font-medium">
                      {record.doctor.specialization}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hospital</p>
                    <p className="font-medium">{record.doctor.hospital}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{record.doctor.email}</p>
                  </div>
                </div>
              </div>

              {/* Action buttons section */}
              <div className="border-t border-gray-200 pt-4 mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => handleShare(record.doctor.walletAddress)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Share Access
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Appointments;
