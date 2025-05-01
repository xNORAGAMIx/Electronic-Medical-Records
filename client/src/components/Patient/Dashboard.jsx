/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  FaShieldAlt,
  FaLock,
  FaWallet,
  FaUser,
  FaCalendarAlt,
  FaVenusMars,
  FaHome,
  FaTint,
  FaEnvelope,
  FaCloudUploadAlt,
  FaFileMedical,
  FaFilePdf,
  FaTimes,
  FaFolderOpen,
  FaFileAlt,
  FaChevronRight,
} from "react-icons/fa";
import axios from "axios";

// redux methods
import { connectToBlockchain } from "../../redux/contract/blockchainSlice";
import { connectToUpload } from "../../redux/contract/uploadSlice";

// contract data
import PatientRegistration from "../../constants/PatientRegistration.json";
import Upload from "../../constants/Upload.json";
import {
  PATIENT_CONTRACT_ADDRESS,
  UPLOAD_CONTRACT_ADDRESS,
  PRIVATE_KEY,
} from "../../constants/Values";

//image
import patientLogo from "../../../public/DJV MAR 1012-04.jpg";

// set up constants
const contractABI = PatientRegistration.abi;
const contractAddress = PATIENT_CONTRACT_ADDRESS;
const privateKey = PRIVATE_KEY;

const uploadABI = Upload.abi;
const uploadAddress = UPLOAD_CONTRACT_ADDRESS;

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // redux states
  const contract = useSelector((state) => state.blockchain.contract);
  const loading = useSelector((state) => state.blockchain.loading);
  const account = useSelector((state) => state.blockchain.account);
  const uploadContract = useSelector((state) => state.upload.contract);
  const uploadLoading = useSelector((state) => state.upload.loading);

  // get patient id from url and localStorage
  const { hhNumber } = useParams();
  const numberStorage = localStorage.getItem("hhNumber");

  // deny unauthorized access
  useEffect(() => {
    if (numberStorage !== hhNumber) {
      navigate("/patient/" + numberStorage, { replace: true });
    }
  }, [hhNumber, numberStorage, navigate]);

  // upload states
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("no file selected");
  const [reports, setReports] = useState([]);

  // patient state
  const [patientDetails, setPatientDetails] = useState("");

  // fetch access list
  // useEffect(() => {
  //   const accessList = async () => {
  //     const fetchedAddressList = await uploadContract.shareAccess();
  //     setAddressList(fetchedAddressList);
  //   };

  //   if (uploadContract) {
  //     accessList();
  //   }
  // }, [uploadContract]);

  // connect to blockchain
  useEffect(() => {
    dispatch(connectToBlockchain(contractAddress, contractABI));
    dispatch(connectToUpload(uploadAddress, uploadABI));
  }, [dispatch]);

  // get patient details
  useEffect(() => {
    const getDetails = async () => {
      if (!contract) {
        alert(
          "Blockchain contract is not available yet. Please try again later."
        );
        return;
      }
      try {
        const patient = await contract.getPatientDetails(hhNumber);
        console.log(patient);

        setPatientDetails(patient);
      } catch (err) {
        console.log(err);
      }
    };

    getDetails();
  }, [contract, hhNumber]);

  // get file data
  useEffect(() => {
    const getData = async () => {
      //check first if contract available yet
      if (!uploadContract || !account) {
        // console.log("Upload contract or account is not available yet.");
        return;
      }

      let response;
      try {
        response = await uploadContract.display(account);
      } catch (err) {
        console.log(err);
      }

      let isEmpty;
      if (response !== undefined) {
        isEmpty = Object.keys(response).length === 0;
      }

      if (!response || Object.keys(response).length === 0) {
        alert("No file to display");
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
                  alt="Content"
                  className="image-list"
                />
              )}
            </a>
          );
        });
        setReports(images);
      } else {
        alert("No file to display");
      }
    };
    getData();
  }, [account, uploadContract]);

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
        setFileName("no file selected");
        setFile(null);
      } catch (err) {
        alert("Unable to connect to pinata");
        console.log(err);
      }
    }
    alert("File uploaded successfully");
    setFileName("No file selected");
    setFile(null);
  };

  // get uploaded files
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

  if (loading) {
    return <div>Loading blockchain connection...</div>;
  }

  return (
    <>
      <div className="min-h-screen w-full p-6 bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* LEFT: Patient Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 p-6"
          >
            {/* Profile Header with Gradient Background */}
            <div className="bg-gradient-to-r from-[#0a0f2c] to-[#1a1f3c] py-8 px-10 text-center rounded-2xl shadow-lg">
              <div className="relative inline-block mb-4">
                <img
                  src={patientLogo}
                  alt="User Profile"
                  className="w-32 h-32 rounded-full shadow-2xl border-4 border-cyan-300/30 object-cover"
                />
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-tr from-cyan-400 to-blue-500 text-white p-2 rounded-full shadow-lg">
                  <FaShieldAlt className="text-xl" />
                </div>
              </div>
              <h2 className="mt-4 text-3xl font-bold text-white">
                Patient <span className="text-cyan-300">Profile</span>
              </h2>
              <div className="mt-2 h-1 w-20 bg-cyan-400 mx-auto rounded-full"></div>
            </div>

            {/* Information Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  label: "Wallet Address",
                  value: patientDetails.walletAddress,
                  icon: <FaWallet className="text-cyan-500 text-2xl" />,
                  gradient: "from-cyan-50 to-cyan-100",
                  border: "border-cyan-200",
                },
                {
                  label: "Full Name",
                  value: patientDetails.name,
                  icon: <FaUser className="text-purple-500 text-2xl" />,
                  gradient: "from-purple-50 to-purple-100",
                  border: "border-purple-200",
                },
                {
                  label: "Date of Birth",
                  value: patientDetails.dateOfBirth,
                  icon: <FaCalendarAlt className="text-blue-500 text-2xl" />,
                  gradient: "from-blue-50 to-blue-100",
                  border: "border-blue-200",
                },
                {
                  label: "Gender",
                  value: patientDetails.gender,
                  icon: <FaVenusMars className="text-pink-500 text-2xl" />,
                  gradient: "from-pink-50 to-pink-100",
                  border: "border-pink-200",
                },
                {
                  label: "Physical Address",
                  value: patientDetails.homeAddress,
                  icon: <FaHome className="text-green-500 text-2xl" />,
                  gradient: "from-green-50 to-green-100",
                  border: "border-green-200",
                },
                {
                  label: "Blood Group",
                  value: patientDetails.bloodGroup,
                  icon: <FaTint className="text-red-500 text-2xl" />,
                  gradient: "from-red-50 to-red-100",
                  border: "border-red-200",
                },
                {
                  label: "Email Address",
                  value: patientDetails.email,
                  icon: <FaEnvelope className="text-yellow-500 text-2xl" />,
                  gradient: "from-yellow-50 to-yellow-100",
                  border: "border-yellow-200",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.1)",
                  }}
                  className={`bg-gradient-to-br ${item.gradient} rounded-xl p-6 border ${item.border} shadow-md transition-all duration-300`}
                >
                  <div className="flex items-start space-x-5">
                    <div
                      className={`p-4 bg-white rounded-lg shadow-md ${item.border}`}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        {item.label}
                      </p>
                      <p
                        className={`text-lg font-semibold ${
                          item.label === "Wallet Address"
                            ? "text-cyan-700 font-mono text-sm"
                            : "text-gray-800"
                        } break-all`}
                      >
                        {item.value || (
                          <span className="text-gray-400">Not specified</span>
                        )}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Upload + Reports */}
          <div className="flex flex-col flex-1 gap-8">
            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 flex-1"
            >
              <h2 className="text-2xl font-bold text-[#0a0f2c] mb-6 pb-4 border-b border-gray-200 flex items-center">
                <FaCloudUploadAlt className="text-cyan-500 mr-3" />
                Upload Medical Report
              </h2>

              {/* File Upload Logic */}
              {uploadLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-400 mb-4"></div>
                  <p className="text-lg font-medium text-gray-700">
                    Encrypting and uploading your report...
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    This may take a few moments
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitFile} className="space-y-6">
                  <label
                    htmlFor="file-upload"
                    className="group relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-cyan-300 rounded-xl cursor-pointer hover:bg-cyan-50 transition"
                  >
                    <div className="p-4 mb-3 bg-cyan-100 rounded-full group-hover:bg-cyan-200 transition">
                      <FaFileMedical className="text-cyan-500 text-3xl" />
                    </div>
                    <p className="text-lg text-gray-700 mb-1">
                      Drag & drop files here
                    </p>
                    <p className="text-sm text-gray-500">
                      or click to browse (PDF, JPG, PNG)
                    </p>
                    <input
                      id="file-upload"
                      type="file"
                      disabled={uploadLoading}
                      onChange={retrieveFile}
                      className="hidden"
                    />
                  </label>

                  {fileName && (
                    <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <FaFilePdf className="text-red-500 text-xl" />
                        <span className="font-medium text-gray-800 truncate max-w-xs">
                          {fileName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setFileName("");
                        }}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!file}
                    className={`w-full py-4 text-lg font-bold rounded-xl transition-all ${
                      file
                        ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0f2c] shadow-md hover:shadow-lg"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <FaLock className="inline mr-2" />
                    Secure Upload
                  </motion.button>
                </form>
              )}
            </motion.div>

            {/* Uploaded Reports */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 flex-1"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-[#0a0f2c] flex items-center">
                  <FaFolderOpen className="text-purple-400 mr-3" />
                  Medical Reports
                </h2>
                <span className="bg-cyan-100 text-cyan-800 text-sm font-medium px-3 py-1 rounded-full">
                  {reports.length} files
                </span>
              </div>

              <div className="h-96 overflow-y-auto pr-2">
                {reports.length > 0 ? (
                  <ul className="space-y-3">
                    {reports.map((report, index) => (
                      <motion.li
                        key={index}
                        whileHover={{ x: 5 }}
                        className="group"
                      >
                        <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition cursor-pointer">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                              <FaFileAlt />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {report}
                              </p>
                              <p className="text-sm text-gray-500">
                                Uploaded on {new Date().toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <button className="text-gray-400 group-hover:text-cyan-500 transition">
                            <FaChevronRight />
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <FaFolderOpen className="text-gray-300 text-5xl mb-4" />
                    <h3 className="text-xl font-medium text-gray-500 mb-2">
                      No reports yet
                    </h3>
                    <p className="text-gray-400 max-w-md">
                      Upload your first medical report to get started. All files
                      are securely stored on the blockchain.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
