// backend/create-database.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const createDatabase = async () => {
  let connection;
  
  try {
    console.log('🔄 Connecting to MySQL server...');
    
    // Connect without specifying database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
    
    console.log('✅ Connected to MySQL server');
    
    // Create database
    console.log('🔄 Creating database...');
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`✅ Database '${process.env.DB_NAME}' created successfully`);
    
    // Test connection to the new database
    console.log('🔄 Testing database connection...');
    await connection.execute(`USE ${process.env.DB_NAME}`);
    console.log(`✅ Successfully connected to database '${process.env.DB_NAME}'`);
    
    console.log('🎉 Database setup completed! You can now run: npm run dev');
    
  } catch (error) {
    console.error('❌ Database creation failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('1. Your RDS instance is running');
    console.log('2. Your credentials are correct in .env file');
    console.log('3. Your IP is allowed in RDS security group');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

createDatabase();
