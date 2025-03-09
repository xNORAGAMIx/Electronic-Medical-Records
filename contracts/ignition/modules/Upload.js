const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Upload", (m) => {
  const upload = m.contract("Upload");

  return { upload };
});
