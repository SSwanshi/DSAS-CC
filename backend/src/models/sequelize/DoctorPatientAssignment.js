// backend/src/models/sequelize/DoctorPatientAssignment.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DoctorPatientAssignment = sequelize.define('DoctorPatientAssignment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'doctor_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'patient_id',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'doctor_patient_assignments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['doctor_id', 'patient_id']
    }
  ]
});

// Class methods
DoctorPatientAssignment.getPatientsByDoctor = async function(doctorId) {
  return await this.findAll({
    where: { doctorId },
    include: [{
      model: sequelize.models.User,
      as: 'patient',
      attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'phone', 'isApproved']
    }],
    order: [['created_at', 'DESC']]
  });
};

DoctorPatientAssignment.getDoctorByPatient = async function(patientId) {
  const assignment = await this.findOne({
    where: { patientId },
    include: [{
      model: sequelize.models.User,
      as: 'doctor',
      attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'specialization']
    }]
  });
  return assignment?.doctor || null;
};

DoctorPatientAssignment.exists = async function(doctorId, patientId) {
  const assignment = await this.findOne({
    where: { doctorId, patientId }
  });
  return !!assignment;
};

DoctorPatientAssignment.getUnassignedPatients = async function() {
  const assignedPatientIds = await this.findAll({
    attributes: ['patientId'],
    raw: true
  }).then(assignments => assignments.map(a => a.patientId));

  return await sequelize.models.User.findAll({
    where: {
      role: 'patient',
      isApproved: true,
      id: {
        [sequelize.Sequelize.Op.notIn]: assignedPatientIds
      }
    },
    attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'phone']
  });
};

DoctorPatientAssignment.getUnassignedDoctors = async function() {
  return await sequelize.models.User.findAll({
    where: {
      role: 'doctor',
      isApproved: true
    },
    attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'specialization']
  });
};

  return DoctorPatientAssignment;
};
