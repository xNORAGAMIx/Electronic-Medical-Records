// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract DoctorRegistration {
    struct Doctor {
        address walletAddress;
        string name;
        string specialization;
        string hhNumber; // Unique identity
        string email;
        string hospital;
        string password; // for simple login
    }

    mapping(string => bool) public isDoctorRegistered;
    mapping(address => bool) public isDoctorRegisteredAddress;
    mapping(string => Doctor) public doctors;
    string[] public registeredDoctorNumbers; // << ADDED: track reg numbers

    event DoctorRegistered(string registrationNumber, string name, address walletAddress);

    function registerDoctor(
        address _walletAddress,
        string memory _name,
        string memory _specialization,
        string memory _hhNumber,
        string memory _email,
        string memory _hospital,
        string memory _password
    ) external {
        require(!isDoctorRegistered[_hhNumber], "Doctor already registered");
        require(!isDoctorRegisteredAddress[_walletAddress], "Doctor already registered");

        Doctor memory newDoctor = Doctor({
            walletAddress: _walletAddress,
            name: _name,
            specialization: _specialization,
            hhNumber: _hhNumber,
            email: _email,
            hospital: _hospital,
            password: _password
        });

        doctors[_hhNumber] = newDoctor;
        isDoctorRegistered[_hhNumber] = true;
        isDoctorRegisteredAddress[_walletAddress] = true;
        registeredDoctorNumbers.push(_hhNumber); // << push reg number

        emit DoctorRegistered(_hhNumber, _name, _walletAddress);
    }

    function validatePassword(string memory _hhNumber, string memory _password) external view returns (bool) {
        require(isDoctorRegistered[_hhNumber], "Doctor not registered");
        return keccak256(abi.encodePacked(_password)) == keccak256(abi.encodePacked(doctors[_hhNumber].password));
    }

    function validateAddress(address _walletAddress, string memory _hhNumber) external view returns (bool) {
        require(isDoctorRegistered[_hhNumber], "Doctor not registered");
        return _walletAddress == doctors[_hhNumber].walletAddress;
    }

    function getAllDoctors() external view returns (Doctor[] memory) {
        uint count = registeredDoctorNumbers.length;
        Doctor[] memory doctorList = new Doctor[](count);

        for (uint i = 0; i < count; i++) {
            doctorList[i] = doctors[registeredDoctorNumbers[i]];
        }

        return doctorList;
    }
}
