// src/components/Patients.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './components/Patients.css';
import PatientCard from './components/PatientCard';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: '' });
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // Fetch patients on mount
    useEffect(() => {
        axios
            .get('http://localhost:5000/patients/')
            .then((response) => setPatients(response.data))
            .catch((error) => console.error('Error fetching patients:', error));
    }, []);

    // Add Patient
    const handleAddPatient = (e) => {
        e.preventDefault();

        axios
            .post('http://localhost:5000/patients/add', newPatient)
            .then((response) => {
                setPatients([...patients, response.data]);
                setNewPatient({ name: '', age: '', gender: '' });
            })
            .catch((error) => console.error('Error adding patient:', error));
    };

    // Update Patient
    const handleUpdatePatient = (id, e) => {
        e.preventDefault();

        axios
            .post(`http://localhost:5000/patients/update/${id}`, selectedPatient)
            .then(() => {
                const updatedPatient = { ...selectedPatient, _id: id };

                setPatients(
                    patients.map((patient) =>
                        patient._id === id ? updatedPatient : patient
                    )
                );

                setSelectedPatient(null);
                setIsEditMode(false);
            })
            .catch((error) => console.error('Error updating patient:', error));
    };

    // Delete Patient
    const handleDeletePatient = (id) => {
        axios
            .delete(`http://localhost:5000/patients/delete/${id}`)
            .then(() => {
                setSelectedPatient(null);
                setPatients(patients.filter((patient) => patient._id !== id));
            })
            .catch((error) => console.error('Error deleting patient:', error));
    };

    // Edit Patient
    const handleEditPatient = (patient) => {
        setSelectedPatient(patient);
        setIsEditMode(true);
    };

    return (
        <div className="patient-main">
            <div className="form-sections">
                <h4>{isEditMode ? 'Edit Patient' : 'Add New Patient'}</h4>

                <form
                    onSubmit={
                        isEditMode
                            ? (e) => handleUpdatePatient(selectedPatient._id, e)
                            : handleAddPatient
                    }
                >
                    {/* Name Input */}
                    <label>Name: </label>
                    <input
                        type="text"
                        value={
                            isEditMode && selectedPatient
                                ? selectedPatient.name
                                : newPatient.name
                        }
                        onChange={(e) =>
                            isEditMode
                                ? setSelectedPatient({
                                      ...selectedPatient,
                                      name: e.target.value,
                                  })
                                : setNewPatient({
                                      ...newPatient,
                                      name: e.target.value,
                                  })
                        }
                        required
                    />
                    <br />

                    {/* Age Input */}
                    <label>Age: </label>
                    <input
                        type="number"
                        value={
                            isEditMode && selectedPatient
                                ? selectedPatient.age
                                : newPatient.age
                        }
                        onChange={(e) =>
                            isEditMode
                                ? setSelectedPatient({
                                      ...selectedPatient,
                                      age: e.target.value,
                                  })
                                : setNewPatient({
                                      ...newPatient,
                                      age: e.target.value,
                                  })
                        }
                        required
                    />
                    <br />

                    {/* Gender Input */}
                    <label>Gender: </label>
                    <input
                        type="text"
                        value={
                            isEditMode && selectedPatient
                                ? selectedPatient.gender
                                : newPatient.gender
                        }
                        onChange={(e) =>
                            isEditMode
                                ? setSelectedPatient({
                                      ...selectedPatient,
                                      gender: e.target.value,
                                  })
                                : setNewPatient({
                                      ...newPatient,
                                      gender: e.target.value,
                                  })
                        }
                        required
                    />
                    <br />

                    {/* Submit Button */}
                    <button type="submit">
                        {isEditMode ? 'Update Patient' : 'Add Patient'}
                    </button>
                </form>
            </div>

            <div className="patients-section">
                <h3 style={{ textAlign: 'center' }}>
                    Patients ({patients.length})
                </h3>

                <div className="patient-list">
                    {patients.map((patient) => (
                        <PatientCard
                            key={patient._id}
                            patient={patient}
                            onEdit={handleEditPatient}
                            onDelete={handleDeletePatient}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Patients;
