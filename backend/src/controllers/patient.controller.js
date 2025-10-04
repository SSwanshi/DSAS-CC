// backend/src/controllers/patient.controller.js
const { DoctorPatientAssignment, HealthRecord } = require('../models/sequelize/associations');
const CryptoService = require('../services/crypto.service');

// Get assigned doctor for patient
exports.getAssignedDoctor = async (req, res) => {
  try {
    const patientId = req.user.id;
    const assignment = await DoctorPatientAssignment.findOne({
      where: { patientId: patientId },
      include: [{
        model: require('../models/sequelize/associations').User,
        as: 'Doctor',
        attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'specialization']
      }]
    });
    
    const doctor = assignment ? assignment.Doctor : null;
    
    if (!doctor) {
      return res.status(404).json({ message: 'No doctor assigned' });
    }
    
    res.json({ doctor });
  } catch (error) {
    console.error('Get assigned doctor error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Upload encrypted health record
exports.uploadRecord = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { formData, dataType, fileName, fileSize } = req.body;

    if (!formData || !dataType) {
      return res.status(400).json({ message: 'Form data and data type are required' });
    }

    // Encrypt the form data
    const encryptedData = CryptoService.encrypt(formData);

    // Save to database
    const recordData = {
      patientId,
      encryptedData,
      dataType,
      fileName: fileName || 'health_record',
      fileSize: fileSize || 0
    };

    const record = await HealthRecord.create(recordData);

    res.status(201).json({
      message: 'Record uploaded successfully',
      record: {
        id: record.id,
        dataType: record.dataType,
        fileName: record.fileName,
        fileSize: record.fileSize,
        createdAt: record.created_at
      }
    });
  } catch (error) {
    console.error('Upload record error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get patient's own records
exports.getPatientRecords = async (req, res) => {
  try {
    const patientId = req.user.id;
    console.log('Getting records for patient ID:', patientId);
    
    const records = await HealthRecord.findAll({
      where: { patientId: patientId },
      order: [['created_at', 'DESC']],
      attributes: ['id', 'dataType', 'fileName', 'fileSize', 'created_at']
    });
    
    console.log('Found records:', records.length);
    res.json({ records });
  } catch (error) {
    console.error('Get patient records error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get specific record (encrypted)
exports.getRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const patientId = req.user.id;
    
    const record = await HealthRecord.findOne({
      where: { 
        id: recordId,
        patientId: patientId 
      }
    });
    
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json({ record });
  } catch (error) {
    console.error('Get record error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};