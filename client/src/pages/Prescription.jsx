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
      <div className="flex-1 min-w-0 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full border border-gray-100">
          {/* Header with count */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <span className="text-2xl">📂</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Patient Reports</h2>
                <p className="mt-1 opacity-90 text-blue-100">
                  Total:{" "}
                  <span className="font-semibold text-white">
                    {reports.length}
                  </span>
                  report{reports.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Reports list */}
          <div className="p-6 h-[calc(100%-96px)]">
            <div className="h-full overflow-y-auto pr-2">
              {reports.length > 0 ? (
                <ul className="space-y-3">
                  {Array.isArray(reports) &&
                    reports.map((report, index) => (
                      <li
                        key={index}
                        className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 cursor-pointer"
                        onClick={() => console.log("Report clicked:", report)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors duration-200">
                            <span className="text-xl text-indigo-600">📄</span>
                          </div>
                          <div>
                            <span className="text-lg font-medium text-gray-800 block">
                              {report}
                            </span>
                            <span className="text-sm text-gray-500">
                              Last updated: {new Date().toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200"
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
                      </li>
                    ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <div className="p-5 bg-blue-50 rounded-full mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-blue-400"
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
                  <h3 className="text-xl font-medium text-gray-700 mb-1">
                    No reports available
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    You haven't uploaded any reports yet. Get started by
                    uploading your first medical report.
                  </p>
                  <button className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm">
                    Upload Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Prescription;
