// backend/migrate-to-mysql.js
const { sequelize } = require('./src/config/sequelize.config');
const { User, HealthRecord, DoctorPatientAssignment } = require('./src/models/sequelize/associations');

const migrateToMySQL = async () => {
  try {
    console.log('🔄 Starting migration to MySQL...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ MySQL connection established.');
    
    // Sync all models (create tables)
    await sequelize.sync({ force: true });
    console.log('✅ Tables created successfully.');
    
    // Create default admin user
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
    
    console.log('🎉 Migration completed successfully!');
    console.log('📊 Database: MySQL with Sequelize ORM');
    console.log('🔗 Ready for AWS RDS connection');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await sequelize.close();
  }
};

// Run migration if called directly
if (require.main === module) {
  migrateToMySQL();
}

module.exports = migrateToMySQL;
