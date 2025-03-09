import { useState, useEffect } from "react";
import { ethers } from "ethers";

import PatientRegistration from "../../constants/PatientRegistration.json";

const contractABI = PatientRegistration.abi;
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const privateKey =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const Registration = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [hhNumber, setHHNumber] = useState("");

  useEffect(() => {
    const connectToBlockchain = () => {
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      const wallet = new ethers.Wallet(privateKey, provider);
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        wallet
      );

      setContract(contract);
      setAccount(wallet.address);
    };

    connectToBlockchain();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!contract) {
      console.log("Contract not initialized");
      return;
    }

    if (
      !account ||
      !name ||
      !dob ||
      !bloodGroup ||
      !gender ||
      !address ||
      !password ||
      !email ||
      !hhNumber ||
      !confirmPassword
    ) {
      alert(
        "You have missing input fields. Please fill in all the required fields."
      );
      return;
    }

    if (hhNumber.length != 6) {
      alert(
        "You have entered a wrong HH Number. Please enter a 6-digit HH Number."
      );
      return;
    }

    if (password.length < 8) {
      alert(
        "You have entered a weak password. Please enter a password with at least 8 characters"
      );
      //   setPassword("");
      //   setConfirmPassword("");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      // setConfirmPassword("");
      return;
    }

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(dob)) {
      alert("Please enter Date of Birth in the format dd/mm/yyyy");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const isRegPat = await contract.isRegisteredPatient(hhNumber);
      // await isRegPat.wait();

      if (isRegPat) {
        alert("Patient already exists");
        return;
      }

      const tx = await contract.registerPatient(
        account,
        name,
        dob,
        gender,
        bloodGroup,
        address,
        email,
        hhNumber,
        password
      );
      await tx.wait();
      alert("Patient registered successfully!");
    } catch (err) {
      console.log(err);
      alert("An error occurred while registering the doctor.");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Register Patient
          </h1>
          <h3 className="text-center text-sm text-gray-500 mb-4">
            Connected as: {account}
          </h3>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Gender
                </label>
                <input
                  type="text"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Blood Group
                </label>
                <input
                  type="text"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Security Number
                </label>
                <input
                  type="text"
                  value={hhNumber}
                  onChange={(e) => setHHNumber(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    confirmPassword && password !== confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    confirmPassword && password !== confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleRegister}
              type="submit"
              className="w-full py-2 mt-4 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Registration;
