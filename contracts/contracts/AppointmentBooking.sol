// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract AppointmentBooking {
    struct Appointment {
        string patientHHNumber;
        string doctorHHNumber;
        uint256 date; // Represented as a simple uint (e.g., day number or timestamp's day)
    }

    // doctorHHNumber => date => patient count
    mapping(string => mapping(uint256 => uint256)) public doctorAppointmentsPerDay;

    // patientHHNumber => doctorHHNumber => date => bool
    mapping(string => mapping(string => mapping(uint256 => bool))) public hasBookedAppointment;

    // List of appointments
    Appointment[] public appointments;

    uint256 public constant MAX_APPOINTMENTS_PER_DAY = 10;

    event AppointmentBooked(string patientHHNumber, string doctorHHNumber, uint256 date);

    function bookAppointment(string memory _patientHHNumber, string memory _doctorHHNumber, uint256 _date) external {
        // Check if the patient has already booked an appointment with the doctor for this day
        require(!hasBookedAppointment[_patientHHNumber][_doctorHHNumber][_date], "Already booked for today with this doctor");

        // Check if the doctor has slots available
        require(doctorAppointmentsPerDay[_doctorHHNumber][_date] < MAX_APPOINTMENTS_PER_DAY, "Doctor has reached daily appointment limit");

        // Book the appointment
        appointments.push(Appointment({
            patientHHNumber: _patientHHNumber,
            doctorHHNumber: _doctorHHNumber,
            date: _date
        }));

        // Update mappings
        hasBookedAppointment[_patientHHNumber][_doctorHHNumber][_date] = true;
        doctorAppointmentsPerDay[_doctorHHNumber][_date] += 1;

        emit AppointmentBooked(_patientHHNumber, _doctorHHNumber, _date);
    }

    function getAppointments() external view returns (Appointment[] memory) {
        return appointments;
    }

    function getDoctorAppointmentsCount(string memory _doctorHHNumber, uint256 _date) external view returns (uint256) {
        return doctorAppointmentsPerDay[_doctorHHNumber][_date];
    }

    function isAlreadyBooked(string memory _patientHHNumber, string memory _doctorHHNumber, uint256 _date) external view returns (bool) {
        return hasBookedAppointment[_patientHHNumber][_doctorHHNumber][_date];
    }
}
