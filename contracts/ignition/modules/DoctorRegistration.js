const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DoctorRegistration", (m) => {
  const doctor = m.contract("DoctorRegistration");

  return { doctor };
});
