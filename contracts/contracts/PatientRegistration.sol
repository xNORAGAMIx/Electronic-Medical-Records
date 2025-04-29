// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract PatientRegistration {
    struct Patient {
        address walletAddress;
        string name;
        string dateOfBirth;
        string gender;
        string bloodGroup;
        string homeAddress;
        string email;
        string hhNumber;
        string password;
    }

    struct PatientList{
        string patient_number;
        string patient_name;
    }

    mapping(string => bool) public isPatientRegistered;
    mapping(address => bool) public isPatientRegisteredAddress;
    mapping(string => Patient) public patients;
    mapping(string => PatientList[]) private Dpermission;
    mapping(string => mapping(string => bool)) public doctorPermissions;
    string[] public registeredPatientsNumbers;

    event PatientRegistered(string hhNumber, string name, address walletAddress);

    function registerPatient(
        address _walletAddress,
        string memory _name,
        string memory _dateOfBirth,
        string memory _gender,
        string memory _bloodGroup,
        string memory _homeAddress,
        string memory _email,
        string memory _hhNumber,
        string memory _password

    ) external {
        require(!isPatientRegistered[_hhNumber], "Patient already registered");
        require(!isPatientRegisteredAddress[_walletAddress], "Patient already registered");

        Patient memory newPatient = Patient({
            walletAddress: _walletAddress,
            name: _name,
            dateOfBirth: _dateOfBirth,
            gender: _gender,
            bloodGroup: _bloodGroup,
            homeAddress: _homeAddress,
            email: _email,    
            hhNumber: _hhNumber,        
            password: _password // Store password in the struct
        });

        patients[_hhNumber] = newPatient;
        isPatientRegisteredAddress[_walletAddress] = true;
        isPatientRegistered[_hhNumber] = true;
        registeredPatientsNumbers.push(_hhNumber); // << push license number

        emit PatientRegistered(_hhNumber, _name, _walletAddress);
    }

    function getAllPatients() external view returns (Patient[] memory) {
    uint256 count = registeredPatientsNumbers.length;
    Patient[] memory result = new Patient[](count);
    for (uint256 i = 0; i < count; i++) {
        result[i] = patients[registeredPatientsNumbers[i]];
    }
    return result;
}


    function isRegisteredPatient(string memory _hhNumber) external view returns (bool) {
        return isPatientRegistered[_hhNumber];
    }
    
    // Add a function to validate patient's password
    function validatePassword(string memory _hhNumber, string memory _password) external view returns (bool) {
        require(isPatientRegistered[_hhNumber], "Patient not registered");
        return keccak256(abi.encodePacked(_password)) == keccak256(abi.encodePacked(patients[_hhNumber].password));
    }

    // Add a funtion to validate user address
    function validateAddress(address _walletAddress, string memory _hhNumber) external view returns (bool) {
        require(isPatientRegistered[_hhNumber], "Patient not registered");
        return _walletAddress == patients[_hhNumber].walletAddress;
    }

    function getPatientDetails(string memory _hhNumber) external view returns (
    address walletAddress,
    string memory name,
    string memory dateOfBirth,
    string memory gender,
    string memory bloodGroup,
    string memory homeAddress,
    string memory email
    ) {
        require(isPatientRegistered[_hhNumber], "Patient not registered");
        Patient memory patient = patients[_hhNumber];
        return (patient.walletAddress, patient.name, patient.dateOfBirth, patient.gender, patient.bloodGroup, patient.homeAddress, patient.email);
    }

    function grantPermission(
        string memory _patientNumber,
        string memory _doctorNumber,
        string memory _patientName
    ) external {
        require(!doctorPermissions[_patientNumber][_doctorNumber], "View Access already given to the Doctor!");
        // Check if the patient number already exists in the list
        bool exists = false;
        for (uint i = 0; i < Dpermission[_doctorNumber].length; i++) {
            if (keccak256(abi.encodePacked(Dpermission[_doctorNumber][i].patient_number)) == keccak256(abi.encodePacked(_patientNumber))) {
                exists = true;
                break;
            }
        }

        // If the patient number does not exist, add it to the list
        if (!exists) {
            PatientList memory newRecord = PatientList(
                _patientNumber,
                _patientName
            );
            Dpermission[_doctorNumber].push(newRecord);
        }
        doctorPermissions[_patientNumber][_doctorNumber] = true;
    }

    function isPermissionGranted(string memory _patientNumber,string memory _doctorNumber) external view returns (bool) {
        return doctorPermissions[_patientNumber][_doctorNumber];
    }

    function getPatientList(string memory _doctorNumber) public view returns (PatientList[] memory) {
        return Dpermission[_doctorNumber];
    }
}