import { Link } from "react-router-dom";
import { FaUserInjured, FaUserMd } from "react-icons/fa";

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fbff] to-[#e6f0ff] flex flex-col items-center justify-center px-4 py-12">
  <div className="text-center mb-12">
    <h1 className="text-5xl font-bold text-[#0a1128] mb-3">Join Us</h1>
    <p className="text-xl text-gray-700">
      Register as a <span className="text-[#007bff] font-semibold">Patient</span> or{" "}
      <span className="text-[#28a745] font-semibold">Doctor</span> to securely manage your medical records.
    </p>
  </div>

  <div className="grid gap-10 md:grid-cols-2">
    {/* Patient Card */}
    <Link
      to="/patient-register"
      className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-10 w-80 flex flex-col items-center"
    >
      <FaUserInjured className="text-6xl text-[#007bff] mb-6" />
      <h2 className="text-2xl font-bold text-[#0a1128] mb-2">Patient</h2>
      <p className="text-center text-gray-600 mb-4">Manage your medical records securely with ease.</p>
      <button className="bg-[#007bff] hover:bg-[#0062cc] text-white px-6 py-2 rounded-lg transition duration-300">
        Register as Patient
      </button>
    </Link>

    {/* Doctor Card */}
    <Link
      to="/doctor-register"
      className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-10 w-80 flex flex-col items-center"
    >
      <FaUserMd className="text-6xl text-[#28a745] mb-6" />
      <h2 className="text-2xl font-bold text-[#0a1128] mb-2">Doctor</h2>
      <p className="text-center text-gray-600 mb-4">Access and update patient records efficiently.</p>
      <button className="bg-[#28a745] hover:bg-[#218838] text-white px-6 py-2 rounded-lg transition duration-300">
        Register as Doctor
      </button>
    </Link>
  </div>
</div>

  );
};

export default Register;
