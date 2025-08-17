// Appointments.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import AppointmentCard from "./components/AppointmentCard";
import "./components/Appointments.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    doctorName: "",
    date: "",
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch appointments on mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/appointments/")
      .then((response) => setAppointments(response.data))
      .catch((error) =>
        console.error("Error fetching appointments:", error)
      );
  }, []);

  // Add appointment
  const handleAddAppointment = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/appointments/add", newAppointment)
      .then((response) => {
        setAppointments([...appointments, response.data]);
        setNewAppointment({ patientName: "", doctorName: "", date: "" });
      })
      .catch((error) => console.error("Error adding appointment:", error));
  };

  // Update appointment
  const handleUpdateAppointment = (id, e) => {
    e.preventDefault();
    axios
      .put(
        `http://localhost:5000/appointments/update/${id}`,
        selectedAppointment
      )
      .then((response) => {
        const updated = response.data;
        setAppointments(
          appointments.map((a) => (a._id === id ? updated : a))
        );
        setSelectedAppointment(null);
        setIsEditMode(false);
      })
      .catch((error) =>
        console.error("Error updating appointment:", error)
      );
  };

  // Delete appointment
  const handleDeleteAppointment = (id) => {
    axios
      .delete(`http://localhost:5000/appointments/delete/${id}`)
      .then(() => {
        setAppointments(appointments.filter((a) => a._id !== id));
      })
      .catch((error) =>
        console.error("Error deleting appointment:", error)
      );
  };

  // Edit mode
  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsEditMode(true);
  };

  // Form state (switch between add/edit)
  const formData = isEditMode ? selectedAppointment : newAppointment;
  const setFormData = isEditMode
    ? setSelectedAppointment
    : setNewAppointment;

  return (
    <div className="flex-row" style={{ width: "100%" }}>
      {/* Add/Edit Form */}
      <div className="flex-column">
        <div className="add-form">
          <h4>{isEditMode ? "Edit Appointment" : "Add New Appointment"}</h4>
          <form
            className="appointment-form"
            onSubmit={
              isEditMode
                ? (e) => handleUpdateAppointment(formData._id, e)
                : handleAddAppointment
            }
          >
            <label>Patient Name:</label>
            <input
              type="text"
              value={formData?.patientName || ""}
              onChange={(e) =>
                setFormData({ ...formData, patientName: e.target.value })
              }
            />
            <label>Doctor Name:</label>
            <input
              type="text"
              value={formData?.doctorName || ""}
              onChange={(e) =>
                setFormData({ ...formData, doctorName: e.target.value })
              }
            />
            <label>Date:</label>
            <input
              type="date"
              value={formData?.date || ""}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
            <button type="submit">
              {isEditMode ? "Update Appointment" : "Add Appointment"}
            </button>
          </form>
        </div>
      </div>

      {/* Appointment List */}
      <div className="appointments">
        <h3>Appointments ({appointments.length})</h3>
        <div className="appointment-list">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              onEdit={handleEditAppointment}
              onDelete={handleDeleteAppointment}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
