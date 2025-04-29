import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Patient Redux
import {
  connectToBlockchain,
  clearBlockchainState,
} from "../redux/contract/blockchainSlice";

// Upload Redux
import { connectToUpload } from "../redux/contract/uploadSlice";

// Contract Addresses
import {
  PATIENT_CONTRACT_ADDRESS,
  UPLOAD_CONTRACT_ADDRESS,
  PRIVATE_KEY,
} from "../constants/Values";

// Contracts JSON imports
import PatientRegistration from "../constants/PatientRegistration.json";
import Upload from "../constants/Upload.json";

// constants setup
const contractABI = PatientRegistration.abi;
const contractAddress = PATIENT_CONTRACT_ADDRESS;

const uploadContractABI = Upload.abi;
const uploadContractAddress = UPLOAD_CONTRACT_ADDRESS;

const privateKey = PRIVATE_KEY;

const Prescribe = () => {
  const { patientWallet } = useParams();
  const dispatch = useDispatch();

  const [patient, setPatient] = useState({});
  const [reports, setReports] = useState([]);

  const { contract } = useSelector((state) => state.blockchain);
  const uploadContract = useSelector((state) => state.upload.contract);

  // connect to network
  useEffect(() => {
    dispatch(connectToBlockchain(privateKey, contractAddress, contractABI));
    dispatch(
      connectToUpload(privateKey, uploadContractAddress, uploadContractABI)
    );
  }, [dispatch]);

  // clear state on component unmount
  useEffect(() => {
    return () => {
      dispatch(clearBlockchainState());
    };
  }, [dispatch]);

  // fetch patient details
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const tx = await contract.getAllPatients();
        const patients = tx.map((d) => ({
          walletAddress: d[0],
          name: d[1],
          dateOfBirth: d[2],
          gender: d[3],
          bloodGroup: d[4],
          email: d[6],
          // hhNumber: d[7],
        }));

        const matchedPatients = patients.filter(
          (patient) =>
            patient.walletAddress.toLowerCase() === patientWallet.toLowerCase()
        );
        setPatient(matchedPatients[0]);
      } catch (err) {
        console.log(err);
        toast.error("Error getting patient details.");
      }
    };
    if (contract) {
      fetchPatients();
    }
  }, [contract, patientWallet]);

  useEffect(() => {
    const getData = async () => {
      let response;
      try {
        response = await uploadContract.display(patientWallet);
      } catch (err) {
        console.log(err);
      }

      let isEmpty;
      if (response !== undefined) {
        isEmpty = Object.keys(response).length === 0;
      }

      if (!response || Object.keys(response).length === 0) {
        toast.error("No files to dislay (inner).");
        return;
      }

      if (!isEmpty) {
        const str = response.toString();
        const str_array = str.split(",");

        const images = str_array.map((item, i) => {
          return (
            <a href={item} key={i} target="_blank">
              {item.endsWith(".pdf") ? (
                <object
                  key={i}
                  data={`https://gateway.pinata.cloud/ipfs/${item.substring(
                    6
                  )}`}
                  type="application/pdf"
                  width="100%"
                  height="500px"
                >
                  <p>Your browser does not support PDFs.</p>
                </object>
              ) : (
                <img
                  key={i}
                  src={`https://gateway.pinata.cloud/ipfs/${item.substring(6)}`}
                  alt="Report"
                  className="image-list"
                />
              )}
            </a>
          );
        });
        setReports(images);
      } else {
        toast.error("No file to display.");
      }
    };

    if (uploadContract) {
      getData();
    }
  }, [uploadContract, patientWallet]);
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-7xl mx-auto">
        {/* Patient Profile Card - Left Side */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
            {/* Header with patient name */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
              <h2 className="text-2xl font-bold flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {patient.name}
              </h2>
              <p className="mt-1 text-blue-100">{patient.email}</p>
            </div>

            {/* Patient details */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Personal Information */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Personal
                  </h3>
                  <div>
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    <p className="font-medium">{patient.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Gender</p>
                    <p className="font-medium">{patient.gender}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Blood Group</p>
                    <p className="font-medium">{patient.bloodGroup}</p>
                  </div>
                </div>

                {/* Wallet Information */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Wallet
                  </h3>
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <div className="flex items-center">
                      <p className="font-mono text-sm text-indigo-600 truncate">
                        {patient.walletAddress}
                      </p>
                      <button
                        className="ml-2 text-gray-400 hover:text-indigo-600"
                        onClick={() =>
                          navigator.clipboard.writeText(patient.walletAddress)
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Card - Right Side */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
            {/* Header with count */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
              <h2 className="text-2xl font-bold flex items-center space-x-3">
                <span className="text-white">📂</span>
                <span>Uploaded Reports</span>
              </h2>
              <p className="mt-2 opacity-90">
                Total: <span className="font-semibold">{reports.length}</span>{" "}
                report{reports.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Reports list */}
            <div className="p-6 h-[calc(100%-80px)]">
              <div className="h-full overflow-y-auto space-y-4 pr-2">
                {reports.length > 0 ? (
                  <ul className="space-y-3">
                    {Array.isArray(reports) &&
                      reports.map((report, index) => {
                        return (
                          <li
                            key={index}
                            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 cursor-pointer"
                            onClick={() =>
                              console.log("Report clicked:", report)
                            }
                          >
                            <div className="flex items-center space-x-4">
                              <span className="text-2xl text-blue-500">📄</span>
                              <div>
                                <span className="text-lg font-medium text-gray-800 block">
                                  {report}
                                </span>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-12">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-gray-400 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                      />
                    </svg>
                    <p className="text-gray-500 text-lg">
                      No reports uploaded yet
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Upload your first report to get started
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Prescribe;
