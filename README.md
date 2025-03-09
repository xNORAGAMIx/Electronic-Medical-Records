cd client - npm install
cd contracts -
  1. compile - npx hardhat compile
  2. start local blockchain - npx hardhat node
  3. deploy contracts -
     1. npx hardhat ignition deploy ./ignition/modules/PatientRegistration.js --network localhost
     2. npx hardhat ignition deploy ./ignition/modules/Upload.js --network localhost

// Testing on browser
1. Register Page - http://localhost/patient-register
  1. copy the deployed contract address from contracts/ignition/deployments - deployed address (JSON file)
  2. paste the deployed address to the const in the component Register (only the PatientRegistration address)
  3. select any private key from hardhat node and paste in component Register

2. Login Page - http://localhost/patient-login
  1. copy the deployed contract address from contracts/ignition/deployments - deployed address (JSON file)
  2. paste the deployed address to the const in the component Login (only the PatientRegistration address)
  3. select any private key from hardhat node and paste in component Login

3. Dashboard - http://localhost/patient/hhNumber
  1. copy the deployed contract address from contracts/ignition/deployments - deployed address (JSON file)
  2. paste the deployed address to the const in the component Dashboard (PatientRegistration address and Upload address)
  3. select any private key from hardhat node and paste in component Dashboard

Current functionalities - only Patient
1. Registration
2. Login
3. Dashboard visit + file upload on IPFS
