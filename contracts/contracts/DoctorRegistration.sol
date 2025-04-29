// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract DoctorRegistration {
    struct Doctor {
        address walletAddress;
        string name;
        string dateOfBirth;
        string gender;
        string bloodGroup;
        string specialization;
        string licenseNumber;
        string email;
        string hospital;
        string password;
    }

    struct DoctorList {
        string doctorNumber;
        string doctorName;
    }

    mapping(string => bool) public isDoctorRegistered;
    mapping(address => bool) public isDoctorRegisteredAddress;
    mapping(string => Doctor) public doctors;
    mapping(string => DoctorList[]) private Ppermission;
    mapping(string => mapping(string => bool)) public patientPermissions;

    event DoctorRegistered(string licenseNumber, string name, address walletAddress);

    function registerDoctor(
        address _walletAddress,
        string memory _name,
        string memory _dateOfBirth,
        string memory _gender,
        string memory _bloodGroup,
        string memory _specialization,
        string memory _licenseNumber,
        string memory _email,
        string memory _hospital,
        string memory _password
    ) external {
        require(!isDoctorRegistered[_licenseNumber], "Doctor already registered");
        require(!isDoctorRegisteredAddress[_walletAddress], "Doctor already registered");

        Doctor memory newDoctor = Doctor({
            walletAddress: _walletAddress,
            name: _name,
            dateOfBirth: _dateOfBirth,
            gender: _gender,
            bloodGroup: _bloodGroup,
            specialization: _specialization,
            licenseNumber: _licenseNumber,
            email: _email,
            hospital: _hospital,
            password: _password
        });

        doctors[_licenseNumber] = newDoctor;
        isDoctorRegistered[_licenseNumber] = true;
        isDoctorRegisteredAddress[_walletAddress] = true;

        emit DoctorRegistered(_licenseNumber, _name, _walletAddress);
    }

    function isRegisteredDoctor(string memory _licenseNumber) external view returns (bool) {
        return isDoctorRegistered[_licenseNumber];
    }

    function validatePassword(string memory _licenseNumber, string memory _password) external view returns (bool) {
        require(isDoctorRegistered[_licenseNumber], "Doctor not registered");
        return keccak256(abi.encodePacked(_password)) == keccak256(abi.encodePacked(doctors[_licenseNumber].password));
    }

    function validateAddress(address _walletAddress, string memory _licenseNumber) external view returns (bool) {
        require(isDoctorRegistered[_licenseNumber], "Doctor not registered");
        return _walletAddress == doctors[_licenseNumber].walletAddress;
    }

    function getDoctorDetails(string memory _licenseNumber) external view returns (
        address walletAddress,
        string memory name,
        string memory dateOfBirth,
        string memory gender,
        string memory bloodGroup,
        string memory specialization,
        string memory email,
        string memory hospital
    ) {
        require(isDoctorRegistered[_licenseNumber], "Doctor not registered");
        Doctor memory doctor = doctors[_licenseNumber];
        return (
            doctor.walletAddress,
            doctor.name,
            doctor.dateOfBirth,
            doctor.gender,
            doctor.bloodGroup,
            doctor.specialization,
            doctor.email,
            doctor.hospital
        );
    }

    function grantPermission(
        string memory _doctorNumber,
        string memory _patientNumber,
        string memory _doctorName
    ) external {
        require(!patientPermissions[_doctorNumber][_patientNumber], "Access already granted to patient!");

        bool exists = false;
        for (uint i = 0; i < Ppermission[_patientNumber].length; i++) {
            if (keccak256(abi.encodePacked(Ppermission[_patientNumber][i].doctorNumber)) == keccak256(abi.encodePacked(_doctorNumber))) {
                exists = true;
                break;
            }
        }

        if (!exists) {
            DoctorList memory newRecord = DoctorList(
                _doctorNumber,
                _doctorName
            );
            Ppermission[_patientNumber].push(newRecord);
        }
        patientPermissions[_doctorNumber][_patientNumber] = true;
    }

    function isPermissionGranted(string memory _doctorNumber, string memory _patientNumber) external view returns (bool) {
        return patientPermissions[_doctorNumber][_patientNumber];
    }

    function getDoctorList(string memory _patientNumber) public view returns (DoctorList[] memory) {
        return Ppermission[_patientNumber];
    }
}
