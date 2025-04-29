import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Doctor - Redux
import { connectToDoctor } from "../../redux/contract/doctorSlice";

// contract address
import { DOCTOR_CONTRACT_ADDRESS, PRIVATE_KEY } from "../../constants/Values";

// Doctor contract JSON
import DoctorRegistration from "../../constants/DoctorRegistration.json";

// initial values
const contractABI = DoctorRegistration.abi;
const contractAddress = DOCTOR_CONTRACT_ADDRESS;
const privateKey = PRIVATE_KEY;

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { contract } = useSelector((state) => state.doctor);

  const authNumber = useSelector((state) => state.user.licenseNumber);
  const { licenseNumber } = useParams();

  // const {licenseNumber} = useParams();

  const [doctorDetails, setDoctorDetails] = useState({});

  // connect to network
  useEffect(() => {
    dispatch(connectToDoctor(privateKey, contractAddress, contractABI));
  }, [dispatch]);

  // deny unauthorized access
  useEffect(() => {
    if (authNumber !== licenseNumber) {
      navigate("/doctor/" + authNumber, { replace: true });
    }
  }, [licenseNumber, authNumber, navigate]);

  // fetch doctor details
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const txn = await contract.getDoctorDetails(licenseNumber);
        console.log(txn);
        setDoctorDetails(txn);
      } catch (err) {
        console.log(err);
      }
    };
    if (contract) {
      fetchDoctorDetails();
    }
  }, [contract, licenseNumber]);
  return (
    <div className="min-h-screen w-full p-6 bg-gray-200 flex flex-col space-y-8">
      {/* Doctor Profile */}
      <div className="bg-white shadow-lg rounded-2xl p-8 space-y-8 w-full max-w-7xl mx-auto">
        <div className="flex flex-col items-center space-y-4">
          <img
            src="/5053643.jpg"
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
            {
              label: "Specialization",
              value: doctorDetails.specialization,
              icon: "🩺",
            },
            {
              label: "Wallet Address",
              value: doctorDetails.walletAddress,
              icon: "💳",
            },
            { label: "Hospital", value: doctorDetails.hospital, icon: "🏥" },
            { label: "Email", value: doctorDetails.email, icon: "📧" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition"
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-md font-medium text-gray-500">
                  {item.label}
                </p>
                <p className="text-lg text-gray-800 font-semibold">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
