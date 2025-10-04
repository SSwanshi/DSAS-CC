// backend/test-mysql-local.js
const { sequelize, testConnection } = require('./src/config/sequelize.config');

const testLocalMySQL = async () => {
  try {
    console.log('🔄 Testing local MySQL connection...');
    
    // Test connection
    await testConnection();
    
    console.log('✅ Local MySQL connection successful!');
    console.log('📊 Ready for AWS RDS migration');
    
  } catch (error) {
    console.error('❌ Local MySQL test failed:', error.message);
    console.log('\n💡 Make sure you have:');
    console.log('1. MySQL server running locally');
    console.log('2. Created a database named "dsas_db"');
    console.log('3. Updated .env file with local MySQL credentials');
  } finally {
    await sequelize.close();
  }
};

testLocalMySQL();
