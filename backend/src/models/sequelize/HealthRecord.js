// backend/src/models/sequelize/HealthRecord.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const HealthRecord = sequelize.define('HealthRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'patient_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  encryptedData: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'encrypted_data'
  },
  dataType: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'data_type'
  },
  fileName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'file_name'
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'file_size'
  }
}, {
  tableName: 'health_records',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Class methods
HealthRecord.getByPatientId = async function(patientId) {
  return await this.findAll({
    where: { patientId },
    order: [['created_at', 'DESC']]
  });
};

HealthRecord.getById = async function(id) {
  return await this.findByPk(id);
};

HealthRecord.getAll = async function() {
  return await this.findAll({
    include: [{
      model: sequelize.models.User,
      as: 'patient',
      attributes: ['id', 'firstName', 'lastName', 'email']
    }],
    order: [['created_at', 'DESC']]
  });
};

HealthRecord.getByDoctorId = async function(doctorId) {
  return await this.findAll({
    include: [{
      model: sequelize.models.User,
      as: 'patient',
      attributes: ['id', 'firstName', 'lastName', 'email'],
      include: [{
        model: sequelize.models.DoctorPatientAssignment,
        as: 'doctorAssignments',
        where: { doctorId },
        attributes: []
      }]
    }],
    order: [['created_at', 'DESC']]
  });
};

  return HealthRecord;
};
