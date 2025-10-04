// backend/src/models/sequelize/associations.js
const { sequelize } = require('../../config/sequelize.config');
const User = require('./User')(sequelize);
const HealthRecord = require('./HealthRecord')(sequelize);
const DoctorPatientAssignment = require('./DoctorPatientAssignment')(sequelize);

// Define associations
User.hasMany(HealthRecord, {
  foreignKey: 'patientId',
  as: 'healthRecords'
});

HealthRecord.belongsTo(User, {
  foreignKey: 'patientId',
  as: 'patient'
});

// Doctor-Patient Assignment associations
User.belongsToMany(User, {
  through: DoctorPatientAssignment,
  as: 'patients',
  foreignKey: 'doctorId',
  otherKey: 'patientId'
});

User.belongsToMany(User, {
  through: DoctorPatientAssignment,
  as: 'doctors',
  foreignKey: 'patientId',
  otherKey: 'doctorId'
});

// Direct associations for easier querying
User.hasMany(DoctorPatientAssignment, {
  foreignKey: 'doctorId',
  as: 'doctorAssignments'
});

User.hasMany(DoctorPatientAssignment, {
  foreignKey: 'patientId',
  as: 'patientAssignments'
});

DoctorPatientAssignment.belongsTo(User, {
  foreignKey: 'doctorId',
  as: 'doctor'
});

DoctorPatientAssignment.belongsTo(User, {
  foreignKey: 'patientId',
  as: 'patient'
});

module.exports = {
  sequelize,
  User,
  HealthRecord,
  DoctorPatientAssignment
};
