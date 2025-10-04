// backend/src/models/assignment.model.js
const db = require('../config/db.config');

const Assignment = {};

// Create doctor-patient assignment
Assignment.create = async (doctorId, patientId) => {
  try {
    const query = 'INSERT INTO doctor_patient_assignments (doctor_id, patient_id, created_at) VALUES (?, ?, datetime(\'now\'))';
    const result = await db.execute(query, [doctorId, patientId]);
    return { id: result.lastID, doctorId, patientId };
  } catch (error) {
    throw error;
  }
};

// Get patients assigned to a doctor
Assignment.getPatientsByDoctor = async (doctorId) => {
  try {
    const query = `
      SELECT u.*, dpa.created_at as assigned_at 
      FROM users u 
      JOIN doctor_patient_assignments dpa ON u.id = dpa.patient_id 
      WHERE dpa.doctor_id = ? AND u.is_approved = 1
      ORDER BY dpa.created_at DESC
    `;
    const rows = await db.query(query, [doctorId]);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Get doctor assigned to a patient
Assignment.getDoctorByPatient = async (patientId) => {
  try {
    const query = `
      SELECT u.*, dpa.created_at as assigned_at 
      FROM users u 
      JOIN doctor_patient_assignments dpa ON u.id = dpa.doctor_id 
      WHERE dpa.patient_id = ? AND u.is_approved = 1
    `;
    const rows = await db.query(query, [patientId]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// Check if assignment exists
Assignment.exists = async (doctorId, patientId) => {
  try {
    const query = 'SELECT id FROM doctor_patient_assignments WHERE doctor_id = ? AND patient_id = ?';
    const rows = await db.query(query, [doctorId, patientId]);
    return rows.length > 0;
  } catch (error) {
    throw error;
  }
};

// Get unassigned patients
Assignment.getUnassignedPatients = async () => {
  try {
    const query = `
      SELECT u.* 
      FROM users u 
      LEFT JOIN doctor_patient_assignments dpa ON u.id = dpa.patient_id 
      WHERE u.role = 'patient' AND u.is_approved = 1 AND dpa.patient_id IS NULL
      ORDER BY u.created_at DESC
    `;
    const rows = await db.query(query);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Get unassigned doctors
Assignment.getUnassignedDoctors = async () => {
  try {
    const query = `
      SELECT u.* 
      FROM users u 
      WHERE u.role = 'doctor' AND u.is_approved = 1
      ORDER BY u.created_at DESC
    `;
    const rows = await db.query(query);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Delete assignment
Assignment.delete = async (doctorId, patientId) => {
  try {
    const query = 'DELETE FROM doctor_patient_assignments WHERE doctor_id = ? AND patient_id = ?';
    await db.execute(query, [doctorId, patientId]);
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = Assignment;
