import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { connectToBlockchain } from "../../redux/contract/blockchainSlice";
import { connectToUpload } from "../../redux/contract/uploadSlice";
import PatientRegistration from "../../constants/PatientRegistration.json";
import Upload from "../../constants/Upload.json";

const contractABI = PatientRegistration.abi;
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const privateKey =
  "0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0";

const uploadABI = Upload.abi;
const uploadAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const Dashboard = () => {
  const dispatch = useDispatch();

  // upload
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("no file selected");

  const contract = useSelector((state) => state.blockchain.contract);
  const loading = useSelector((state) => state.blockchain.loading);
  const account = useSelector((state) => state.blockchain.account);

  const uploadContract = useSelector((state) => state.upload.contract);
  const uploadLoading = useSelector((state) => state.upload.loading);

  const { hhNumber } = useParams();

  const [reports, setReports] = useState([
    "Blood Test Report.pdf",
    "X-Ray Results.pdf",
    "Prescription_June.pdf",
    "Blood Test Report.pdf",
    "X-Ray Results.pdf",
    "Prescription_June.pdf",
    "Blood Test Report.pdf",
    "X-Ray Results.pdf",
    "Prescription_June.pdf",
    "Blood Test Report.pdf",
    "X-Ray Results.pdf",
    "Prescription_June.pdf",
    "Blood Test Report.pdf",
    "X-Ray Results.pdf",
    "Prescription_June.pdf",
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientDetails, setPatientDetails] = useState("");

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    dispatch(connectToBlockchain(privateKey, contractAddress, contractABI));
    dispatch(connectToUpload(privateKey, uploadAddress, uploadABI));
  }, [dispatch]);

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

  const retrieveFile = (e) => {
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
      <div className="h-screen w-full p-6 bg-gray-100 flex flex-col">
        {/* Dashboard Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Information Section */}
          <div className="bg-white shadow-lg rounded-lg p-8 space-y-6">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 border-b pb-4">
              User Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">
                  Wallet Address
                </p>
                <p className="text-lg text-gray-800 font-semibold break-words">
                  {patientDetails.walletAddress}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Name</p>
                <p className="text-lg text-gray-800 font-semibold">
                  {patientDetails.name}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">
                  Date of Birth
                </p>
                <p className="text-lg text-gray-800 font-semibold">
                  {patientDetails.dateOfBirth}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Gender</p>
                <p className="text-lg text-gray-800 font-semibold">
                  {patientDetails.gender}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Address</p>
                <p className="text-lg text-gray-800 font-semibold break-words">
                  {patientDetails.homeAddress}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Blood Group</p>
                <p className="text-lg text-gray-800 font-semibold">
                  {patientDetails.bloodGroup}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-lg text-gray-800 font-semibold">
                  {patientDetails.email}
                </p>
              </div>
            </div>
          </div>

          {/* Report Upload and Uploaded Reports Section */}
          <div className="bg-white shadow-lg rounded-lg p-8 space-y-8">
            {/* Report Upload Section */}
            {uploadLoading ? (
              <div>Upload contract is loading...</div>
            ) : (
              <form onSubmit={handleSubmitFile}>
                <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-4">
                  Upload Report
                </h2>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    disabled={uploadLoading}
                    onChange={retrieveFile}
                    className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <button
                    type="submit"
                    disabled={!file}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Upload
                  </button>
                </div>
              </form>
            )}

            {/* Uploaded Reports Section */}
            <div>
              <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-4">
                Uploaded Reports
              </h2>
              <div className="h-60 overflow-y-auto space-y-4">
                {reports.length > 0 ? (
                  <ul>
                    {reports.map((report, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition"
                      >
                        <span className="text-gray-700">{report}</span>
                        <button className="text-blue-500 hover:underline">
                          View
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No reports uploaded yet.</p>
                )}
              </div>
            </div>

            {/* Grant Permission Button */}
            <button
              onClick={toggleModal}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Grant Permission
            </button>

            {/* Modal for Granting Permission */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                <div className="bg-white p-8 rounded-lg w-full max-w-md space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    Grant Permission
                  </h3>
                  <form>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium text-gray-600"
                          htmlFor="name"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
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
    </>
  );
};

export default Dashboard;
