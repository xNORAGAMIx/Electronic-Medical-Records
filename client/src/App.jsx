import React from "react";
import { Routes, Route } from "react-router-dom";

import Registration from "./components/Patient/Registration";
import Login from "./components/Patient/Login";
import Homepage from "./pages/Homepage";
import Dashboard from "./components/Patient/Dashboard";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/patient-register" element={<Registration />} />
        <Route path="/patient-login" element={<Login />} />
        <Route path="patient/:hhNumber" element={<Dashboard />} />
      </Routes>
    </>
  );
};

export default App;
