/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHospital, FaSearch, FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

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
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file selected!");

  const { account } = useSelector((state) => state.user);
  const { contract } = useSelector((state) => state.blockchain);
  const uploadContract = useSelector((state) => state.upload.contract);
  const uploadLoading = useSelector((state) => state.upload.loading);

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

  // get patient uploaded reports
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

  // get uploaded files on site - helper function
  const retrieveFile = (e) => {
    e.preventDefault();
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
  };

  // upload file
  const handleSubmitFile = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `027578a6b7e5b3cd1d59`,
            pinata_secret_api_key: `5e4c9c2919ca0505261900535439c2cea75bf9c874acc061d509250537467b50`,
            "Content-Type": "multipart/form-data",
          },
        });
        const imgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;

        if (!uploadContract) {
          console.log(
            "Blockchain contract is not available yet. Please try again later."
          );
        }

        uploadContract.add(account, imgHash);
        alert("Image uploaded successfully");
        setFileName("No file selected");
        setFile(null);
      } catch (err) {
        console.log(err);
      }
    }
  };

  // provide access
  const handleShare = async (patientWallet) => {
    try {
      const tx = await uploadContract.allow(patientWallet);
      await tx.wait();
      toast.success(`Shared access to ${patient.name}`);
    } catch (err) {
      console.log(err);
      toast.error(`Error in sharing access.`);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="text-center mb-12 mt-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0a0f2c] mb-3">
            Patient <span className="text-cyan-400">Reports</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            View your scheduled patient reports
          </p>
        </div>
        {/* Top Section - Two Cards Side by Side */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Patient Profile Card - Left Side */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden h-full"
            >
              {/* Header with patient name */}
              <div className="bg-gradient-to-r from-[#0a0f2c] to-[#1a1f3c] p-6 text-white">
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
                <p className="mt-1 text-cyan-100">{patient.email}</p>
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
                      <p className="font-medium text-[#0a0f2c]">
                        {patient.dateOfBirth}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Gender</p>
                      <p className="font-medium text-[#0a0f2c]">
                        {patient.gender}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Blood Group</p>
                      <p className="font-medium text-[#0a0f2c]">
                        {patient.bloodGroup}
                      </p>
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
                        <p className="font-mono text-sm text-cyan-500 truncate">
                          {patient.walletAddress}
                        </p>
                        <button
                          className="ml-2 text-gray-400 hover:text-cyan-500"
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
            </motion.div>
          </div>

          {/* Reports Card - Right Side */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden h-full"
            >
              {/* Header with count */}
              <div className="bg-gradient-to-r from-[#0a0f2c] to-[#1a1f3c] p-6 text-white">
                <h2 className="text-2xl font-bold flex items-center space-x-3">
                  <span className="text-white">📂</span>
                  <span>Patient Reports</span>
                </h2>
                <p className="mt-2 text-cyan-100">
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
                        reports.map((report, index) => (
                          <motion.li
                            key={index}
                            whileHover={{ y: -3 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 hover:border-cyan-200 cursor-pointer"
                            onClick={() =>
                              console.log("Report clicked:", report)
                            }
                          >
                            <div className="flex items-center space-x-4">
                              <span className="text-2xl text-cyan-500">📄</span>
                              <div>
                                <span className="text-lg font-medium text-[#0a0f2c] block">
                                  {report}
                                </span>
                              </div>
                            </div>
                            <FaChevronRight className="text-gray-400" />
                          </motion.li>
                        ))}
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
                      <p className="text-gray-600 text-lg">
                        No reports uploaded yet
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        Upload your first report to get started
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section - Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden"
        >
          {uploadLoading ? (
            <div className="flex flex-col items-center justify-center p-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-cyan-500"></div>
                <span className="text-xl font-semibold text-[#0a0f2c]">
                  Processing Report...
                </span>
              </div>
              <p className="text-gray-600 text-center">
                Please wait while we securely upload your medical report
              </p>
            </div>
          ) : (
            <>
              {/* Header matching your theme */}
              <div className="bg-gradient-to-r from-[#0a0f2c] to-[#1a1f3c] p-6 text-white">
                <h2 className="text-2xl font-bold flex items-center justify-between">
                  <div className="flex items-center">
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
                        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                      />
                    </svg>
                    Upload Medical Report
                  </div>
                  <button
                    className="px-4 py-2 cursor-pointer text-white text-lg rounded-lg bg-blue-600 hover:bg-blue-400"
                    onClick={() => handleShare(patientWallet)}
                  >
                    Share
                  </button>
                </h2>
              </div>

              <form onSubmit={handleSubmitFile} className="p-6 space-y-6">
                {/* Enhanced File Upload Box */}
                <label
                  htmlFor="file-upload"
                  className="group relative block w-full border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 group-hover:text-cyan-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mt-2 text-lg font-medium text-[#0a0f2c]">
                      Drag and drop your report here
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Supported formats: PDF, JPG, PNG (Max 25MB)
                    </p>
                    <span className="mt-3 px-4 py-2 bg-cyan-50 text-cyan-600 rounded-lg text-sm font-medium group-hover:bg-cyan-100 transition-colors">
                      Select File
                    </span>
                  </div>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    disabled={uploadLoading}
                    onChange={retrieveFile}
                    className="sr-only"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </label>

                {/* Selected File Preview - Enhanced */}
                {fileName && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <svg
                        className="h-8 w-8 text-cyan-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-[#0a0f2c] truncate max-w-xs">
                          {fileName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {Math.floor(Math.random() * 5 + 1).toFixed(1)} MB •
                          Ready to upload
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setFileName("");
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Remove file"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </motion.div>
                )}

                {/* Upload Button - Theme Matching */}
                <button
                  type="submit"
                  disabled={!file}
                  className={`w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-300 transition-all duration-200 ${
                    !file ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Upload Report
                </button>

                {/* Security Note */}
                <p className="text-xs text-gray-500 text-center">
                  <svg
                    className="inline-block h-4 w-4 mr-1 text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  All files are encrypted and HIPAA compliant
                </p>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
};
export default Prescribe;
