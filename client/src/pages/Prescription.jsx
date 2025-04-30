import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Upload Redux
import { connectToUpload } from "../redux/contract/uploadSlice";

// Contract Addresses
import { UPLOAD_CONTRACT_ADDRESS, PRIVATE_KEY } from "../constants/Values";

// Contracts JSON imports
import Upload from "../constants/Upload.json";

// constants setup
const contractABI = Upload.abi;
const contractAddress = UPLOAD_CONTRACT_ADDRESS;

const privateKey = PRIVATE_KEY;

const Prescription = () => {
  const { doctorWallet } = useParams();
  const dispatch = useDispatch();

  const [reports, setReports] = useState([]);

  const { contract } = useSelector((state) => state.upload);

  // connect to network
  useEffect(() => {
    dispatch(connectToUpload(privateKey, contractAddress, contractABI));
  }, [dispatch]);

  // get doctor uploaded prespcription
  useEffect(() => {
    const getData = async () => {
      let response;
      try {
        response = await contract.display(doctorWallet);
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
    if (contract) {
      getData();
    }
  }, [contract, doctorWallet]);

  return (
    <>
      <div className="flex-1 min-w-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main card container */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 transition-all duration-200 hover:shadow-md">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-[#0a0f2c] to-[#1a1f3c] p-6 rounded-t-xl sm:px-8 sm:py-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Patient Reports
                </h2>
                <p className="mt-1 opacity-90 text-blue-100 text-sm sm:text-base">
                  Total:{" "}
                  <span className="font-semibold text-white">
                    {reports.length} report{reports.length !== 1 ? "s" : ""}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Reports list container */}
          <div className="p-4 sm:p-6">
            {reports.length > 0 ? (
              <div className="space-y-3">
                {reports.map((report, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-sm"
                    onClick={() => console.log("Report clicked:", report)}
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                      <div className="p-2.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200 flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-medium text-gray-800 truncate">
                          {report}
                        </h3>
                      </div>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="p-4 bg-blue-50 rounded-full mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No prescription available
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Prescription;
