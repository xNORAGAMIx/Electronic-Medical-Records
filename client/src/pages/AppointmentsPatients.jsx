import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiSearch,
  FiCalendar,
  FiFilter,
  FiShare2,
  FiFileText,
} from "react-icons/fi";

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

// constants setup
const contractAbi = AppointmentBooking.abi;
const contractAddress = APPOINTMENT_CONTRACT_ADDRESS;
const doctorContractAbi = DoctorRegistration.abi;
const doctorContractAddress = DOCTOR_CONTRACT_ADDRESS;
const uploadContractAbi = Upload.abi;
const uploadContractAddress = UPLOAD_CONTRACT_ADDRESS;

const Appointments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // appointment states
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

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
    dispatch(connectToAppoint(contractAddress, contractAbi));
    dispatch(connectToDoctor(doctorContractAddress, doctorContractAbi));
    dispatch(connectToUpload(uploadContractAddress, uploadContractAbi));
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
          licenseNumber: d[3],
          email: d[4],
          hospital: d[5],
        }));

        const combined = parsedAppointments
          ?.map((appointment) => {
            const doctor = doctorList?.find(
              (doc) => String(doc.licenseNumber) === appointment.doctorId
            );
            if (doctor) {
              return {
                ...appointment,
                doctor: doctor,
                date: new Date(appointment.timestamp * 1000),
              };
            }
            return null;
          })
          .filter((item) => item !== null);

        setAppointments(combined);
        setFilteredAppointments(combined);
        toast.success("Appointments fetched successfully!");
      } catch (err) {
        console.log(err);
        toast.error("Error in fetching appointments.");
      }
    };
    if (contract && doctorContract) {
      fetchAppointments();
    }
  }, [contract, doctorContract, hhNumber]);

  // Filter and sort appointments
  useEffect(() => {
    let results = appointments;

    // Apply search filter
    if (searchTerm) {
      results = results.filter((appointment) =>
        appointment.doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    results = [...results].sort((a, b) => {
      if (sortOrder === "newest") {
        return b.timestamp - a.timestamp;
      } else {
        return a.timestamp - b.timestamp;
      }
    });

    setFilteredAppointments(results);
  }, [searchTerm, sortOrder, appointments]);

  // handle provide access
  const handleShare = async (address) => {
    try {
      const txn = await uploadContract.allow(address);
      await txn.wait();
      toast.success(`Shared access to ${address}`);
    } catch (err) {
      console.log(err);
      toast.error("Error in sharing access!");
    }
  };

  // navigate to prescription based on appointment
  const handlePresriptionNavigate = (doctorWallet) => {
    navigate(`/prescription/${doctorWallet}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-gradient-to-r from-[#0a0f2c] to-[#1a1f3c] p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-100">
          Your Appointment Records
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-900" />
            </div>
            <input
              type="text"
              placeholder="Search by doctor name..."
              className="pl-10 pr-4 py-2 w-full bg-white text-gray-900 rounded-lg border border-gray-300 focus:ring-2 shadow-md transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              className="appearance-none pl-3 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 shadow-md transition-all bg-white"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-500 text-lg">
            {appointments.length === 0
              ? "You don't have any appointments yet."
              : "No appointments match your search."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAppointments.map((record, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FiCalendar className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Appointment Date</p>
                      <p className="font-medium text-gray-800">
                        {record.date.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {record.date.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                    Wallet: {record.doctor.walletAddress}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Doctor Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-gray-200 p-4 rounded-md">
                      <p className="text-sm text-gray-500 font-medium">Name</p>
                      <p className="font-medium text-gray-800">
                        {record.doctor.name}
                      </p>
                    </div>
                    <div className="bg-gray-200 p-4 rounded-md">
                      <p className="text-sm text-gray-500 font-medium">
                        Specialization
                      </p>
                      <p className="font-medium text-gray-800">
                        {record.doctor.specialization}
                      </p>
                    </div>
                    <div className="bg-gray-200 p-4 rounded-md">
                      <p className="text-sm text-gray-500 font-medium">
                        Hospital
                      </p>
                      <p className="font-medium text-gray-800">
                        {record.doctor.hospital}
                      </p>
                    </div>
                    <div className="bg-gray-200 p-4 rounded-md">
                      <p className="text-sm text-gray-500 font-medium">Email</p>
                      <p className="font-medium text-gray-800 break-all">
                        {record.doctor.email}
                      </p>
                    </div>
                    <div className="bg-gray-200 p-4 rounded-md">
                      <p className="text-sm text-gray-500 font-medium">
                        Wallet Address
                      </p>
                      <p className="font-medium text-gray-800 break-all">
                        {record.doctor.walletAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action buttons section */}
                <div className="border-t border-gray-100 pt-6 mt-6 flex flex-wrap justify-end gap-3">
                  <button
                    onClick={() => handleShare(record.doctor.walletAddress)}
                    className="flex items-center gap-2 px-4 py-2  text-white rounded-md shadow-sm bg-blue-950 hover:bg-blue-900 cursor-pointer transition-all duration-200"
                  >
                    <FiShare2 size={16} />
                    Share Access
                  </button>
                  <button
                    onClick={() =>
                      handlePresriptionNavigate(record.doctor.walletAddress)
                    }
                    className="flex items-center gap-2 px-4 py-2  text-white rounded-md shadow-sm bg-zinc-900 hover:bg-zinc-700 transition-all duration-200 cursor-pointer"
                  >
                    <FiFileText size={16} />
                    View Prescriptions
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;
