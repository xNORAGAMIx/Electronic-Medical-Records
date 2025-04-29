const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("AppointmentBooking", (m) => {
  const ticket = m.contract("AppointmentBooking");

  return { ticket };
});
