// backend/src/controllers/admin.controller.js
const { User, DoctorPatientAssignment, HealthRecord } = require('../models/sequelize/associations');
const { Op } = require('sequelize');

// Get pending users for approval
exports.getPendingUsers = async (req, res) => {
  try {
    const { role } = req.query;
    
    if (role && !['patient', 'doctor'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be patient or doctor' });
    }
    
    let pendingUsers = [];
    if (role) {
      pendingUsers = await User.findAll({ 
        where: { 
          role: role, 
          isApproved: false 
        },
        attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'role', 'isApproved', 'created_at']
      });
    } else {
      pendingUsers = await User.findAll({ 
        where: { 
          role: { [Op.in]: ['patient', 'doctor'] }, 
          isApproved: false 
        },
        attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'role', 'isApproved', 'created_at']
      });
    }
    
    res.json({ users: pendingUsers });
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Approve or reject user
exports.verifyUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isApproved } = req.body;
    
    if (typeof isApproved !== 'boolean') {
      return res.status(400).json({ message: 'isApproved must be a boolean value' });
    }
    
    await User.update(
      { isApproved: isApproved },
      { where: { id: userId } }
    );
    
    res.json({ 
      message: `User ${isApproved ? 'approved' : 'rejected'} successfully` 
    });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Assign doctor to patient
exports.assignDoctor = async (req, res) => {
  try {
    const { doctorId, patientId } = req.body;
    
    if (!doctorId || !patientId) {
      return res.status(400).json({ message: 'Doctor ID and Patient ID are required' });
    }
    
    // Check if assignment already exists
    const exists = await DoctorPatientAssignment.findOne({
      where: { doctorId: doctorId, patientId: patientId }
    });
    if (exists) {
      return res.status(400).json({ message: 'Assignment already exists' });
    }
    
    // Check if patient is already assigned to another doctor
    const existingDoctor = await DoctorPatientAssignment.findOne({
      where: { patientId: patientId }
    });
    if (existingDoctor) {
      return res.status(400).json({ 
        message: 'Patient is already assigned to a doctor',
        currentDoctor: existingDoctor
      });
    }
    
    // Create assignment
    const assignment = await DoctorPatientAssignment.create({
      doctorId: doctorId,
      patientId: patientId
    });
    
    res.status(201).json({ 
      message: 'Doctor assigned successfully',
      assignment
    });
  } catch (error) {
    console.error('Assign doctor error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Unassign doctor from patient
exports.unassignDoctor = async (req, res) => {
  try {
    const { doctorId, patientId } = req.body;
    
    if (!doctorId || !patientId) {
      return res.status(400).json({ message: 'Doctor ID and Patient ID are required' });
    }
    
    await DoctorPatientAssignment.destroy({
      where: { doctorId: doctorId, patientId: patientId }
    });
    
    res.json({ message: 'Assignment removed successfully' });
  } catch (error) {
    console.error('Unassign doctor error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get unassigned patients and doctors for assignment
exports.getAssignmentData = async (req, res) => {
  try {
    // Get all approved patients
    const allPatients = await User.findAll({
      where: { 
        role: 'patient', 
        isApproved: true 
      },
      attributes: ['id', 'username', 'email', 'firstName', 'lastName']
    });
    
    // Get all approved doctors
    const allDoctors = await User.findAll({
      where: { 
        role: 'doctor', 
        isApproved: true 
      },
      attributes: ['id', 'username', 'email', 'firstName', 'lastName']
    });
    
    // Get assigned patient IDs
    const assignedPatients = await DoctorPatientAssignment.findAll({
      attributes: ['patientId']
    });
    const assignedPatientIds = assignedPatients.map(assignment => assignment.patientId);
    
    // Filter unassigned patients
    const unassignedPatients = allPatients.filter(patient => 
      !assignedPatientIds.includes(patient.id)
    );
    
    res.json({ 
      unassignedPatients, 
      unassignedDoctors: allDoctors // All doctors can be assigned to multiple patients
    });
  } catch (error) {
    console.error('Get assignment data error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all uploaded data (encrypted)
exports.getAllRecords = async (req, res) => {
  try {
    console.log('Getting all records...');
    
    const records = await HealthRecord.findAll({
      include: [{
        model: User,
        as: 'patient',
        attributes: ['id', 'username', 'email', 'firstName', 'lastName']
      }],
      order: [['created_at', 'DESC']]
    });
    
    console.log(`Found ${records.length} total records`);
    console.log('Records data:', JSON.stringify(records, null, 2));
    
    res.json({ records });
  } catch (error) {
    console.error('Get all records error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all users by role
exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    
    if (!['patient', 'doctor', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    console.log(`Getting users by role: ${role}`);
    
    const users = await User.findAll({
      where: { role: role },
      attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'isApproved', 'created_at']
    });
    
    console.log(`Found ${users.length} users with role ${role}`);
    console.log('Users data:', JSON.stringify(users, null, 2));
    
    res.json({ users });
  } catch (error) {
    console.error('Get users by role error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};