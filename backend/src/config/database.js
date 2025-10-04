// backend/src/config/database.js
const { sequelize, testConnection } = require('./sequelize.config');
const { User, HealthRecord, DoctorPatientAssignment } = require('../models/sequelize/associations');

// Initialize database
const initializeDatabase = async () => {
  try {
    // Test connection
    await testConnection();
    
    // Sync models with database
    await sequelize.sync({ force: false }); // Set to true to drop and recreate tables
    
    console.log('✅ Database synchronized successfully.');
    
    // Create default admin user if it doesn't exist
    await createDefaultAdmin();
    
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
};

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ where: { email: 'admin@dsas.com' } });
    
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: 'admin@dsas.com',
        password: 'password',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        isApproved: true
      });
      console.log('✅ Default admin user created.');
    } else {
      console.log('ℹ️  Admin user already exists.');
    }
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
  }
};

// Close database connection
const closeDatabase = async () => {
  try {
    await sequelize.close();
    console.log('✅ Database connection closed.');
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
  }
};

module.exports = {
  sequelize,
  initializeDatabase,
  closeDatabase,
  User,
  HealthRecord,
  DoctorPatientAssignment
};
