import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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

  // access states
  const [address, setAddress] = useState("");
  const [addressList, setAddressList] = useState([]);

  // provide access
  const handleShare = async (e) => {
    e.preventDefault();
    try {
      const txn = await uploadContract.allow(address);
      await txn.wait();
      alert(`Shared access to ${address}`);
      console.log(`Shared access to ${address}`);
    } catch (err) {
      console.log(err);
    }
  };

  // fetch access list
  useEffect(() => {
    const accessList = async () => {
      const fetchedAddressList = await uploadContract.shareAccess();
      setAddressList(fetchedAddressList);
    };

    if (uploadContract) {
      accessList();
    }
  }, [uploadContract]);

  // for access permission
  const [isModalOpen, setIsModalOpen] = useState(false);
  // patient state
  const [patientDetails, setPatientDetails] = useState("");

  // access form
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // connect to blockchain
  useEffect(() => {
    dispatch(connectToBlockchain(privateKey, contractAddress, contractABI));
    dispatch(connectToUpload(privateKey, uploadAddress, uploadABI));
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
        setPatientDetails(patient);
      } catch (err) {
        console.log(err);
      }
    };

    getDetails();
  }, [contract, hhNumber]);

  const [getAcc, setGetAcc] = useState("");
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
        if (getAcc) {
          response = await uploadContract.display(getAcc);
        } else {
          response = await uploadContract.display(account);
        }
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
  }, [account, uploadContract, getAcc]);

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
      <div className="min-h-screen w-full p-6 bg-gray-200 flex flex-col">
        {/* Dashboard Main Container */}
        <div className="flex flex-col justify-center items-center space-y-8">
          {/* User Information Section */}
          <div className="bg-white shadow-lg rounded-2xl p-8 space-y-8 w-full max-w-7xl">
            {/* Profile Header */}
            <div className="flex flex-col items-center space-y-4">
              <img
                src={patientLogo}
                alt="User Profile"
                className="w-36 h-36 rounded-full shadow-lg border-4 border-gray-200"
              />
              <h2 className="text-3xl font-semibold text-gray-800 border-b-2 pb-2 mt-4">
                User Information
              </h2>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  label: "Wallet Address",
                  value: patientDetails.walletAddress,
                  icon: "💳",
                },
                { label: "Name", value: patientDetails.name, icon: "🧑" },
                {
                  label: "Date of Birth",
                  value: patientDetails.dateOfBirth,
                  icon: "🎂",
                },
                { label: "Gender", value: patientDetails.gender, icon: "🚻" },
                {
                  label: "Address",
                  value: patientDetails.homeAddress,
                  icon: "🏠",
                },
                {
                  label: "Blood Group",
                  value: patientDetails.bloodGroup,
                  icon: "🩸",
                },
                { label: "Email", value: patientDetails.email, icon: "📧" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition"
                >
                  <span className="text-2xl text-gray-600">{item.icon}</span>
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

          {/* Report Upload and Uploaded Reports Section */}
          <div className="bg-white shadow-lg rounded-xl p-8 space-y-8 w-full max-w-7xl">
            {/* Report Upload Section */}
            {uploadLoading ? (
              <div className="flex items-center justify-center space-x-2 text-lg font-semibold text-gray-700">
                <svg
                  className="animate-spin h-5 w-5 text-blue-500"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <span>Uploading report...</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitFile} className="space-y-6">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-4 flex items-center">
                  <span className="mr-2">📄</span> Upload Report
                </h2>

                {/* File Upload Box */}
                <label
                  htmlFor="file-upload"
                  className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                >
                  <svg
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16V12M12 16V8m5 8V4m-7 12l-2-2m0 0l-2 2m2-2v6m4-6l2-2m0 0l2 2m-2-2v6"
                    />
                  </svg>
                  <p className="text-gray-600 mt-2">
                    Click to upload or drag & drop
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    disabled={uploadLoading}
                    onChange={retrieveFile}
                    className="hidden"
                  />
                </label>

                {/* Selected File Preview */}
                {fileName && (
                  <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
                    <span className="text-gray-700 text-sm">{fileName}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setFileName("No file selected!");
                      }}
                      className="text-xl text-red-400 hover:text-red-700 transition cursor-pointer"
                    >
                      ❌
                    </button>
                  </div>
                )}

                {/* Upload Button */}
                <button
                  type="submit"
                  disabled={!file}
                  className={`px-6 py-3 text-white font-bold text-xl rounded-lg transition duration-300  ${
                    file
                      ? "bg-black hover:bg-gray-300 hover:text-black cursor-pointer"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Upload
                </button>
              </form>
            )}

            {/* Uploaded Reports Section */}
            <div>
              <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-4 flex items-center space-x-2">
                <span className="text-blue-500">📂</span>
                <span>Uploaded Reports</span>
              </h2>
              <div className="h-60 overflow-y-auto space-y-4 px-12">
                {reports.length > 0 ? (
                  <ul className="space-y-4">
                    {Array.isArray(reports) &&
                      reports.map((report, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-100 to-gray-300 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition transform duration-300"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-xl text-blue-600">📄</span>
                            <span className="text-lg font-bold text-black">
                              {report}
                            </span>
                          </div>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center animate-pulse">
                    No reports uploaded yet.
                  </p>
                )}
              </div>
            </div>

            {/* Grant Permission Button */}
            <button
              onClick={toggleModal}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition cursor-pointer duration-300"
            >
              Grant Permission
            </button>

            {/* Modal for Granting Permission */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 backdrop-blur-lg">
                <div className="bg-white p-8 rounded-xl w-full max-w-xl space-y-6 shadow-xl">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    Grant Permission
                  </h3>
                  <form onSubmit={handleShare}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium text-gray-600"
                          htmlFor="name"
                        >
                          Address
                        </label>
                        <input
                          value={address}
                          type="text"
                          id="name"
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium text-gray-600"
                          htmlFor="email"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <select
                        id="selectNumber"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option>People With Access</option>
                        {addressList.map((opt, index) => (
                          <option key={index} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>

                      <div className="flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={toggleModal}
                          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <input
        className="text-black"
        type="text"
        value={getAcc}
        placeholder="Enter here"
        onChange={(e) => setGetAcc(e.target.value)}
      />
    </>
  );
};

export default Dashboard;
