// backend/src/controllers/patient.controller.js
const { DoctorPatientAssignment, HealthRecord, sequelize } = require('../models/sequelize/associations');
const CryptoService = require('../services/crypto.service');

// Get assigned doctor for patient
exports.getAssignedDoctor = async (req, res) => {
  try {
    const patientId = req.user.id;
    const assignment = await DoctorPatientAssignment.findOne({
      where: { patientId: patientId },
      include: [{
        model: require('../models/sequelize/associations').User,
        as: 'doctor',
        attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'specialization']
      }]
    });
    
    const doctor = assignment ? assignment.doctor : null;
    
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

    console.log('Upload record request:', { patientId, dataType, fileName, fileSize });
    console.log('Form data:', formData);

    if (!formData || !dataType) {
      return res.status(400).json({ message: 'Form data and data type are required' });
    }

    // Encrypt the form data
    const encryptedData = CryptoService.encrypt(formData);
    console.log('Data encrypted successfully');

    // Save to database
    const recordData = {
      patientId,
      encryptedData,
      dataType,
      fileName: fileName || 'health_record',
      fileSize: fileSize || 0
    };
    
    console.log('Record data to save:', recordData);

    console.log('Creating record with data:', recordData);
    const record = await HealthRecord.create(recordData);
    console.log('Record created successfully:', record.id);
    console.log('Created record data:', JSON.stringify(record, null, 2));
    
    // Verify the record was saved correctly by querying it back
    const savedRecord = await HealthRecord.findByPk(record.id);
    console.log('Verification - saved record:', JSON.stringify(savedRecord, null, 2));

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
    console.log('=== PATIENT CONTROLLER: getPatientRecords called ===');
    const patientId = req.user.id;
    console.log('Getting records for patient ID:', patientId);
    console.log('User object:', req.user);
    console.log('User role:', req.user.role);
    console.log('Request headers:', req.headers);
    console.log('Request user from middleware:', req.user);
    
    // Try the same approach as admin controller but with patient filter
    const records = await HealthRecord.findAll({
      where: { patientId: patientId },
      order: [['created_at', 'DESC']],
      attributes: ['id', 'dataType', 'fileName', 'fileSize', 'created_at']
    });
    
    // Alternative query using raw SQL if Sequelize mapping is the issue
    const rawRecords = await sequelize.query(
      'SELECT id, data_type as dataType, file_name as fileName, file_size as fileSize, created_at FROM health_records WHERE patient_id = ? ORDER BY created_at DESC',
      {
        replacements: [patientId],
        type: sequelize.QueryTypes.SELECT
      }
    );
    console.log('Raw SQL query results:', rawRecords);
    
    console.log('Found records:', records.length);
    console.log('Records data:', JSON.stringify(records, null, 2));
    
    // Also try to get all records to see if any exist
    const allRecords = await HealthRecord.findAll({
      attributes: ['id', 'patientId', 'patient_id', 'dataType', 'fileName', 'fileSize', 'created_at']
    });
    console.log('All records in database:', allRecords.length);
    console.log('All records data:', JSON.stringify(allRecords, null, 2));
    
    // Use raw query results if Sequelize query returns empty but raw query has data
    const finalRecords = records.length > 0 ? records : rawRecords;
    console.log('Final records to return:', finalRecords.length);
    
    res.json({ records: finalRecords });
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