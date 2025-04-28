import React from "react";
import { Routes, Route } from "react-router-dom";

import Registration from "./components/Patient/Registration";
import Login from "./components/Patient/Login";
import Homepage from "./pages/Homepage";
import Dashboard from "./components/Patient/Dashboard";
import Header from "./components/Header";

import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";
import PrivateRoute from "./components/PrivateRoute";
import GrantPermission from "./components/Patient/GrantPermission";
import DoctorRegistration from "../../contracts/ignition/modules/DoctorRegistration";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/patient-register" element={<Registration />} />
        <Route path="/patient-login" element={<Login />} />
        <Route path="/doctor-register" element={<DoctorRegistration/>}/>
        <Route path ="grant-permission" element={<GrantPermission/>}/>
        <Route
          path="patient/:hhNumber"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
