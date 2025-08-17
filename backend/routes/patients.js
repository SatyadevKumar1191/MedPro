// routes/patients.js

const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// Get all patients
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add new patient
router.post('/add', async (req, res) => {
  try {
    const { name, age, gender } = req.body;
    const newPatient = new Patient({ name, age, gender });
    const savedPatient = await newPatient.save();
    res.json(savedPatient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update patient data
router.put('/update/:id', async (req, res) => {
  try {
    const { name, age, gender } = req.body;

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      { name, age, gender },
      { new: true } // return updated doc
    );

    if (!updatedPatient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(updatedPatient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete patient by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);

    if (!deletedPatient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
