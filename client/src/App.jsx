import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Patient Components
import RegistrationPatient from "./components/Patient/Registration";
import LoginPatient from "./components/Patient/Login";
import Dashboard from "./components/Patient/Dashboard";

// Doctor Components
import RegistrationDoctor from "./components/Doctor/Registration";
import LoginDoctor from "./components/Doctor/Login";
import DashboardDoctor from "./components/Doctor/Dashboard";
import Prescribe from "./pages/Prescribe";

import Header from "./components/Header";
import Homepage from "./pages/Homepage";
import Hospital from "./pages/Hospital";
import Doctors from "./pages/Doctors";

import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";
import PrivateRoute from "./components/PrivateRoute";

import AppointmentsPatients from "./pages/AppointmentsPatients";
import AppointmentDoctor from "./pages/AppointmentDoctor";
import Prescription from "./pages/Prescription";

import Footer from "./components/Footer";


const App = () => {
  return (
      <div className="min-h-screen flex flex-col">

      <Header />
      <main className="flex-grow">
     <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/hospitals" element={<Hospital />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Patient */}
        <Route path="/patient-register" element={<RegistrationPatient />} />
        <Route path="/patient-login" element={<LoginPatient />} />
        <Route
          path="patient/:hhNumber"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient-appointments"
          element={
            <PrivateRoute>
              <AppointmentsPatients />
            </PrivateRoute>
          }
        />
        <Route
          path="/prescription/:doctorWallet"
          element={
            <PrivateRoute>
              <Prescription />
            </PrivateRoute>
          }
        />

        {/* Doctor */}
        <Route path="/doctor-register" element={<RegistrationDoctor />} />
        <Route path="/doctor-login" element={<LoginDoctor />} />
        <Route
          path="doctor/:licenseNumber"
          element={
            <PrivateRoute>
              <DashboardDoctor />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor-appointments"
          element={
            <PrivateRoute>
              <AppointmentDoctor />
            </PrivateRoute>
          }
        />
        <Route
          path="/prescribe/:patientWallet"
          element={
            <PrivateRoute>
              <Prescribe />
            </PrivateRoute>
          }
        />
        

        {/* Doctor List - Public */}
        <Route path="/doctor-list/:hospitalName" element={<Doctors />} />
      </Routes>
     </main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
       
      <Footer/>
    </div>
  );
};

export default App;
