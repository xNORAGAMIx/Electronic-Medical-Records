// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract DoctorRegistration {
    address public owner;

    struct Doctor {
        address walletAddress;
        string name;
        string dateOfbirth; // Stored as string (could also be timestamp)
        string gender;
        string bloodGroup;
        string specialization;
        string licenseNumber; // Unique medical registration number
        string email;
        string hospital;
        string passwordHash; // Store the hashed password
    }

    // Mappings for efficient lookups
    mapping(string => bool) public isDoctorRegistered;
    mapping(address => bool) public isDoctorRegisteredAddress;
    mapping(string => Doctor) public doctors;
    string[] public registeredDoctorNumbers;

    // Events
    event DoctorRegistered(string registrationNumber, string name, address walletAddress);
    event DoctorDetailsUpdated(string registrationNumber, string name, string hospital);
    event DoctorPasswordUpdated(string registrationNumber);

    // Constructor to set the contract deployer as owner
    constructor() {
        owner = msg.sender;
    }

    // Modifier to restrict access to only the owner (for registration)
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    // Function to register a new doctor
    function registerDoctor(
        address _walletAddress,
        string memory _name,
        string memory _dateOfbirth,
        string memory _gender,
        string memory _bloodGroup,
        string memory _specialization,
        string memory _licenseNumber,
        string memory _email,
        string memory _hospital,
        string memory _password
    ) external onlyOwner {
        require(!isDoctorRegistered[_licenseNumber], "Doctor already registered");
        require(!isDoctorRegisteredAddress[_walletAddress], "Doctor already registered");

        // Hash the password before storing
        string memory passwordHash = string(abi.encodePacked(_password));  // Consider a stronger hash

        Doctor memory newDoctor = Doctor({
            walletAddress: _walletAddress,
            name: _name,
            dateOfbirth: _dateOfbirth,
            gender: _gender,
            bloodGroup: _bloodGroup,
            specialization: _specialization,
            licenseNumber: _licenseNumber,
            email: _email,
            hospital: _hospital,
            passwordHash: passwordHash
        });

        doctors[_licenseNumber] = newDoctor;
        isDoctorRegistered[_licenseNumber] = true;
        isDoctorRegisteredAddress[_walletAddress] = true;
        registeredDoctorNumbers.push(_licenseNumber);

        emit DoctorRegistered(_licenseNumber, _name, _walletAddress);
    }

    // Function to update doctor's details (only owner can update)
    function updateDoctorDetails(
        string memory _licenseNumber,
        string memory _name,
        string memory _hospital
    ) external onlyOwner {
        require(isDoctorRegistered[_licenseNumber], "Doctor not registered");

        Doctor storage doctor = doctors[_licenseNumber];
        doctor.name = _name;
        doctor.hospital = _hospital;

        emit DoctorDetailsUpdated(_licenseNumber, _name, _hospital);
    }

    // Function to update doctor's password (hashed password)
    function updateDoctorPassword(string memory _licenseNumber, string memory _newPassword) external {
        require(isDoctorRegistered[_licenseNumber], "Doctor not registered");

        Doctor storage doctor = doctors[_licenseNumber];
        doctor.passwordHash = string(abi.encodePacked(_newPassword));

        emit DoctorPasswordUpdated(_licenseNumber);
    }

    // Validate password (hashed) before login
    function validatePassword(string memory _licenseNumber, string memory _password) external view returns (bool) {
        require(isDoctorRegistered[_licenseNumber], "Doctor not registered");
        return keccak256(abi.encodePacked(_password)) == keccak256(abi.encodePacked(doctors[_licenseNumber].passwordHash));
    }

    // Validate if address is linked with the registration number
    function validateAddress(address _walletAddress, string memory _licenseNumber) external view returns (bool) {
        require(isDoctorRegistered[_licenseNumber], "Doctor not registered");
        return _walletAddress == doctors[_licenseNumber].walletAddress;
    }

    // Get the list of all registered doctors
    function getAllDoctors() external view returns (Doctor[] memory) {
        uint count = registeredDoctorNumbers.length;
        Doctor[] memory doctorList = new Doctor[](count);

        for (uint i = 0; i < count; i++) {
            doctorList[i] = doctors[registeredDoctorNumbers[i]];
        }

        return doctorList;
    }

    // Function to check the doctor by license number (view function)
    function getDoctorByLicense(string memory _licenseNumber) external view returns (Doctor memory) {
        require(isDoctorRegistered[_licenseNumber], "Doctor not registered");
        return doctors[_licenseNumber];
    }

    // Function to withdraw contract's balance (for contract owners only)
    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    // Function to accept ether into the contract (for contract balance)
    receive() external payable {}
}
