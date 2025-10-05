// backend/src/controllers/doctor.controller.js
const { DoctorPatientAssignment, HealthRecord, User } = require('../models/sequelize/associations');
const CryptoService = require('../services/crypto.service');

// Get assigned patients
exports.getAssignedPatients = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const assignments = await DoctorPatientAssignment.findAll({
      where: { doctorId: doctorId },
      include: [{
        model: User,
        as: 'patient',
        attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'phone']
      }]
    });
    
    const patients = assignments.map(assignment => assignment.patient);
    
    res.json({ patients });
  } catch (error) {
    console.error('Get assigned patients error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all patients (for search)
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await User.findAll({
      where: { 
        role: 'patient',
        isApproved: true 
      },
      attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'phone']
    });
    
    res.json({ patients });
  } catch (error) {
    console.error('Get all patients error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get patient records (decrypted) - for doctors
exports.getPatientRecordsForDoctor = async (req, res) => {
  try {
    console.log('=== DOCTOR CONTROLLER: getPatientRecordsForDoctor called ===');
    const { patientId } = req.params;
    const doctorId = req.user.id;
    console.log('Doctor ID:', doctorId);
    console.log('Requested Patient ID:', patientId);
    
    // Check if doctor is assigned to this patient
    const isAssigned = await DoctorPatientAssignment.findOne({
      where: { doctorId: doctorId, patientId: patientId }
    });
    if (!isAssigned) {
      return res.status(403).json({ message: 'Not authorized to view this patient\'s records' });
    }
    
    const records = await HealthRecord.findAll({
      where: { patientId: patientId },
      order: [['created_at', 'DESC']]
    });
    
    // Decrypt the records
    const decryptedRecords = records.map(record => ({
      id: record.id,
      dataType: record.dataType,
      fileName: record.fileName,
      fileSize: record.fileSize,
      createdAt: record.created_at,
      decryptedData: CryptoService.decrypt(record.encryptedData)
    }));
    
    res.json({ records: decryptedRecords });
  } catch (error) {
    console.error('Get patient records error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get specific record (decrypted) - for doctors
exports.getRecordForDoctor = async (req, res) => {
  try {
    const { recordId } = req.params;
    const doctorId = req.user.id;
    
    const record = await HealthRecord.findByPk(recordId);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    // Check if doctor is assigned to this patient
    const isAssigned = await DoctorPatientAssignment.findOne({
      where: { doctorId: doctorId, patientId: record.patientId }
    });
    if (!isAssigned) {
      return res.status(403).json({ message: 'Not authorized to view this record' });
    }
    
    // Decrypt the record
    const decryptedData = CryptoService.decrypt(record.encryptedData);
    
    res.json({ 
      record: {
        ...record,
        decryptedData
      }
    });
  } catch (error) {
    console.error('Get record error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Search patients by name or email
exports.searchPatients = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const patients = await User.findAll({
      where: { 
        role: 'patient',
        isApproved: true 
      },
      attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'phone']
    });
    
    const filteredPatients = patients.filter(patient => 
      patient.firstName.toLowerCase().includes(query.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(query.toLowerCase()) ||
      patient.email.toLowerCase().includes(query.toLowerCase())
    );
    
    res.json({ patients: filteredPatients });
  } catch (error) {
    console.error('Search patients error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};