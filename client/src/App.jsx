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

import Header from "./components/Header";
import Homepage from "./pages/Homepage";

import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
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

        {/* Doctor */}
        <Route path="/doctor-register" element={<RegistrationDoctor />} />
        <Route path="/doctor-login" element={<LoginDoctor />} />
        <Route
          path="doctor/:hhNumber"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
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
    </>
  );
};

export default App;
