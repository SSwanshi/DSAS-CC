// backend/src/models/record.model.js
const db = require('../config/db.config');

const Record = {};

// Create encrypted health record
Record.create = async (recordData) => {
  try {
    const { patientId, encryptedData, dataType, fileName, fileSize } = recordData;
    
    const query = `
      INSERT INTO health_records (patient_id, encrypted_data, data_type, file_name, file_size, created_at) 
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `;
    
    const result = await db.execute(query, [
      patientId, encryptedData, dataType, fileName, fileSize
    ]);
    
    return { id: result.lastID, ...recordData };
  } catch (error) {
    throw error;
  }
};

// Get records by patient ID
Record.getByPatientId = async (patientId) => {
  try {
    const query = `
      SELECT id, patient_id, encrypted_data, data_type, file_name, file_size, created_at 
      FROM health_records 
      WHERE patient_id = ? 
      ORDER BY created_at DESC
    `;
    const rows = await db.query(query, [patientId]);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Get encrypted record by ID
Record.getById = async (recordId) => {
  try {
    const query = 'SELECT * FROM health_records WHERE id = ?';
    const rows = await db.query(query, [recordId]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// Get all records (for admin)
Record.getAll = async () => {
  try {
    const query = `
      SELECT hr.*, u.first_name, u.last_name, u.email 
      FROM health_records hr 
      JOIN users u ON hr.patient_id = u.id 
      ORDER BY hr.created_at DESC
    `;
    const rows = await db.query(query);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Get records for doctor's assigned patients
Record.getByDoctorId = async (doctorId) => {
  try {
    const query = `
      SELECT hr.*, u.first_name, u.last_name, u.email 
      FROM health_records hr 
      JOIN users u ON hr.patient_id = u.id 
      JOIN doctor_patient_assignments dpa ON u.id = dpa.patient_id 
      WHERE dpa.doctor_id = ? 
      ORDER BY hr.created_at DESC
    `;
    const rows = await db.query(query, [doctorId]);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Delete record
Record.delete = async (recordId) => {
  try {
    const query = 'DELETE FROM health_records WHERE id = ?';
    await db.execute(query, [recordId]);
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = Record;