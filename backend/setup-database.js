// setup-database.js
require('dotenv').config();
const mysql = require('mysql2');

// Database configuration - using local MySQL defaults
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Try empty password first, change if needed
  database: 'dsas_db'
};

console.log('Setting up database with config:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database
});

// Create connection
const connection = mysql.createConnection(dbConfig);

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    console.log('\nPlease make sure:');
    console.log('1. MySQL is running');
    console.log('2. Database credentials are correct');
    console.log('3. Create a .env file with proper database settings');
    process.exit(1);
  }
  
  console.log('Connected to MySQL successfully!');
  
  // Create database if it doesn't exist
  connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`, (err) => {
    if (err) {
      console.error('Error creating database:', err.message);
      process.exit(1);
    }
    
    console.log(`Database '${dbConfig.database}' created or already exists`);
    
    // Use the database
    connection.query(`USE ${dbConfig.database}`, (err) => {
      if (err) {
        console.error('Error using database:', err.message);
        process.exit(1);
      }
      
      console.log(`Using database '${dbConfig.database}'`);
      
      // Create tables
      const createTablesSQL = `
        -- Users table
        CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('patient', 'doctor', 'admin') NOT NULL,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            phone VARCHAR(20),
            specialization VARCHAR(100),
            is_approved BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );

        -- Doctor-Patient Assignments table
        CREATE TABLE IF NOT EXISTS doctor_patient_assignments (
            id INT PRIMARY KEY AUTO_INCREMENT,
            doctor_id INT NOT NULL,
            patient_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE KEY unique_assignment (doctor_id, patient_id)
        );

        -- Health Records table (encrypted data)
        CREATE TABLE IF NOT EXISTS health_records (
            id INT PRIMARY KEY AUTO_INCREMENT,
            patient_id INT NOT NULL,
            encrypted_data LONGTEXT NOT NULL,
            data_type VARCHAR(50) NOT NULL,
            file_name VARCHAR(255),
            file_size INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE
        );

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
        CREATE INDEX IF NOT EXISTS idx_users_approved ON users(is_approved);
        CREATE INDEX IF NOT EXISTS idx_assignments_doctor ON doctor_patient_assignments(doctor_id);
        CREATE INDEX IF NOT EXISTS idx_assignments_patient ON doctor_patient_assignments(patient_id);
        CREATE INDEX IF NOT EXISTS idx_records_patient ON health_records(patient_id);
        CREATE INDEX IF NOT EXISTS idx_records_created ON health_records(created_at);
      `;
      
      connection.query(createTablesSQL, (err) => {
        if (err) {
          console.error('Error creating tables:', err.message);
          process.exit(1);
        }
        
        console.log('Tables created successfully!');
        
        // Create admin user
        const bcrypt = require('bcryptjs');
        const hashedPassword = bcrypt.hashSync('password', 10);
        
        const adminUser = {
          username: 'admin',
          email: 'admin@dsas.com',
          password: hashedPassword,
          role: 'admin',
          first_name: 'Admin',
          last_name: 'User',
          is_approved: true
        };
        
        // Check if admin user already exists
        connection.query('SELECT id FROM users WHERE email = ?', [adminUser.email], (err, results) => {
          if (err) {
            console.error('Error checking admin user:', err.message);
            process.exit(1);
          }
          
          if (results.length > 0) {
            console.log('Admin user already exists');
          } else {
            // Insert admin user
            connection.query(
              'INSERT INTO users (username, email, password, role, first_name, last_name, is_approved) VALUES (?, ?, ?, ?, ?, ?, ?)',
              [adminUser.username, adminUser.email, adminUser.password, adminUser.role, adminUser.first_name, adminUser.last_name, adminUser.is_approved],
              (err) => {
                if (err) {
                  console.error('Error creating admin user:', err.message);
                  process.exit(1);
                }
                
                console.log('Admin user created successfully!');
                console.log('Email: admin@dsas.com');
                console.log('Password: password');
              }
            );
          }
          
          connection.end();
          console.log('\nDatabase setup complete! You can now start the backend server.');
        });
      });
    });
  });
});
