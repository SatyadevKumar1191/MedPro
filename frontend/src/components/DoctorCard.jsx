// src/components/DoctorCard.js

import React from 'react';

const DoctorCard = ({ doctor, onEdit, onDelete }) => {
    if (!doctor) return null; // safeguard in case doctor is undefined

    return (
        <div className="doctor-card">
            <p>
                <strong>{doctor.name}</strong> - {doctor.specialty}
            </p>
            <div className="btn-container">
                <button 
                    type="button"
                    onClick={() => onEdit(doctor)}
                >
                    Edit
                </button>
                <button 
                    type="button"
                    onClick={() => onDelete(doctor._id)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default DoctorCard;
