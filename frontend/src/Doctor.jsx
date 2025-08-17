// Doctors.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoctorCard from './components/DoctorCard';
import './components/Doctors.css';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [newDoctor, setNewDoctor] = useState({ name: '', specialty: '' });
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // Fetch doctors on mount
    useEffect(() => {
        axios
            .get('http://localhost:5000/doctors/')
            .then((response) => setDoctors(response.data))
            .catch((error) => console.error('Error fetching doctors:', error));
    }, []);

    // Add doctor
    const handleAddDoctor = (e) => {
        e.preventDefault();
        axios
            .post('http://localhost:5000/doctors/add', newDoctor)
            .then((response) => {
                setDoctors([...doctors, response.data]);
                setNewDoctor({ name: '', specialty: '' });
            })
            .catch((error) => console.error('Error adding doctor:', error));
    };

    // Update doctor
    const handleUpdateDoctor = (id, e) => {
        e.preventDefault();
        if (!selectedDoctor) return;

        axios
            .put(`http://localhost:5000/doctors/update/${id}`, selectedDoctor)
            .then(() => {
                const updatedDoc = { ...selectedDoctor, _id: id };
                setDoctors(
                    doctors.map((doctor) =>
                        doctor._id === id ? updatedDoc : doctor
                    )
                );
                setSelectedDoctor(null);
                setIsEditMode(false);
            })
            .catch((error) => console.error('Error updating doctor:', error));
    };

    // Delete doctor
    const handleDeleteDoctor = (id) => {
        axios
            .delete(`http://localhost:5000/doctors/delete/${id}`)
            .then(() => {
                setDoctors(doctors.filter((doctor) => doctor._id !== id));
            })
            .catch((error) => console.error('Error deleting doctor:', error));
    };

    // Switch to edit mode
    const handleEditDoctor = (doctor) => {
        setSelectedDoctor(doctor);
        setIsEditMode(true);
    };

    return (
        <div className="main-doc-container">
            {/* Form Section */}
            <div className="form-sections">
                <h4>{isEditMode ? 'Edit Doctor' : 'Add New Doctor'}</h4>
                <form
                    onSubmit={
                        isEditMode
                            ? (e) => handleUpdateDoctor(selectedDoctor._id, e)
                            : handleAddDoctor
                    }
                >
                    <label>Name: </label>
                    <input
                        type="text"
                        value={
                            isEditMode && selectedDoctor
                                ? selectedDoctor.name
                                : newDoctor.name
                        }
                        onChange={(e) =>
                            isEditMode && selectedDoctor
                                ? setSelectedDoctor({
                                      ...selectedDoctor,
                                      name: e.target.value,
                                  })
                                : setNewDoctor({
                                      ...newDoctor,
                                      name: e.target.value,
                                  })
                        }
                        required
                    />
                    <br />
                    <label>Specialty: </label>
                    <input
                        type="text"
                        value={
                            isEditMode && selectedDoctor
                                ? selectedDoctor.specialty
                                : newDoctor.specialty
                        }
                        onChange={(e) =>
                            isEditMode && selectedDoctor
                                ? setSelectedDoctor({
                                      ...selectedDoctor,
                                      specialty: e.target.value,
                                  })
                                : setNewDoctor({
                                      ...newDoctor,
                                      specialty: e.target.value,
                                  })
                        }
                        required
                    />
                    <br />
                    <button type="submit">
                        {isEditMode ? 'Update Doctor' : 'Add Doctor'}
                    </button>
                </form>
            </div>

            {/* Doctors List */}
            <div className="doctors-section">
                <h3>Doctors ({doctors.length})</h3>
                <div className="doctor-list">
                    {doctors.map((doctor) => (
                        <DoctorCard
                            key={doctor._id}
                            doctor={doctor}
                            onEdit={handleEditDoctor}
                            onDelete={handleDeleteDoctor}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Doctors;
