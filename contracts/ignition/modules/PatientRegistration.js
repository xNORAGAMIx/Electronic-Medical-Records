const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("PatientRegistration", (m) => {
  const patient = m.contract("PatientRegistration");

  return { patient };
});
