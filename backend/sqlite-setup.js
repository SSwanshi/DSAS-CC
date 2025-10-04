// sqlite-setup.js - Alternative setup using SQLite (no MySQL required)
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

// Create SQLite database
const dbPath = path.join(__dirname, 'dsas.db');
const db = new sqlite3.Database(dbPath);

console.log('Setting up SQLite database...');

// Create tables
const createTablesSQL = `
  -- Users table
  CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('patient', 'doctor', 'admin')) NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT,
      specialization TEXT,
      is_approved BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Doctor-Patient Assignments table
  CREATE TABLE IF NOT EXISTS doctor_patient_assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      doctor_id INTEGER NOT NULL,
      patient_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE (doctor_id, patient_id)
  );

  -- Health Records table (encrypted data)
  CREATE TABLE IF NOT EXISTS health_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      encrypted_data TEXT NOT NULL,
      data_type TEXT NOT NULL,
      file_name TEXT,
      file_size INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
  CREATE INDEX IF NOT EXISTS idx_users_approved ON users(is_approved);
  CREATE INDEX IF NOT EXISTS idx_assignments_doctor ON doctor_patient_assignments(doctor_id);
  CREATE INDEX IF NOT EXISTS idx_assignments_patient ON doctor_patient_assignments(patient_id);
  CREATE INDEX IF NOT EXISTS idx_records_patient ON health_records(patient_id);
  CREATE INDEX IF NOT EXISTS idx_records_created ON health_records(created_at);
`;

db.exec(createTablesSQL, (err) => {
  if (err) {
    console.error('Error creating tables:', err.message);
    process.exit(1);
  }
  
  console.log('Tables created successfully!');
  
  // Create admin user
  const hashedPassword = bcrypt.hashSync('password', 10);
  
  const adminUser = {
    username: 'admin',
    email: 'admin@dsas.com',
    password: hashedPassword,
    role: 'admin',
    first_name: 'Admin',
    last_name: 'User',
    is_approved: 1
  };
  
  // Check if admin user already exists
  db.get('SELECT id FROM users WHERE email = ?', [adminUser.email], (err, row) => {
    if (err) {
      console.error('Error checking admin user:', err.message);
      process.exit(1);
    }
    
    if (row) {
      console.log('Admin user already exists');
    } else {
      // Insert admin user
      db.run(
        'INSERT INTO users (username, email, password, role, first_name, last_name, is_approved) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [adminUser.username, adminUser.email, adminUser.password, adminUser.role, adminUser.first_name, adminUser.last_name, adminUser.is_approved],
        function(err) {
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
    
    db.close();
    console.log('\nSQLite database setup complete!');
    console.log('Database file: dsas.db');
    console.log('You can now start the backend server.');
  });
});
