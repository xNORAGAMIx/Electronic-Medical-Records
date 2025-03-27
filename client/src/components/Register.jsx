import { Link } from "react-router-dom";
import { FaUserInjured, FaUserMd } from "react-icons/fa";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100  font-semibold text-black">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Join Us</h1>
        <p className="text-lg mt-2">
          Register as a <span className="font-semibold">Patient</span> or <span className="font-semibold">Doctor</span> to access and manage medical records securely.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {/* Patient Card */}
        <Link
          to="/patient-register"
          className="flex flex-col items-center justify-center bg-white text-black rounded-2xl shadow-lg p-8 w-80 hover:scale-105 transition-transform duration-300"
        >
          <FaUserInjured className="text-6xl text-blue-500 mb-4" />
          <h2 className="text-2xl font-bold">Patient</h2>
          <p className="text-center mt-2 text-gray-600">
            Manage your medical records securely with ease.
          </p>
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            Register as Patient
          </button>
        </Link>

        {/* Doctor Card */}
        <Link
          to="/doctor-register"
          className="flex flex-col items-center justify-center bg-white text-black rounded-2xl shadow-lg p-8 w-80 hover:scale-105 transition-transform duration-300"
        >
          <FaUserMd className="text-6xl text-green-500 mb-4" />
          <h2 className="text-2xl font-bold">Doctor</h2>
          <p className="text-center mt-2 text-gray-600">
            Access and update patient records efficiently.
          </p>
          <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300">
            Register as Doctor
          </button>
        </Link>
      </div>

      {/* Back to Home Button */}
      <div className="mt-12">
        <Link
          to="/"
          className="text-black text-2xl font-semibold underline hover:text-blue-600 transition duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Register;
