# Database Setup Guide

## Prerequisites
- MySQL Server installed and running
- MySQL root access

## Step 1: Start MySQL Service

### Windows:
```bash
# Start MySQL service
net start mysql
# OR if using XAMPP/WAMP
# Start XAMPP/WAMP control panel and start MySQL
```

### macOS:
```bash
# Using Homebrew
brew services start mysql
# OR
sudo /usr/local/mysql/support-files/mysql.server start
```

### Linux:
```bash
# Ubuntu/Debian
sudo systemctl start mysql
# OR
sudo service mysql start
```

## Step 2: Connect to MySQL and Create Database

```bash
# Connect to MySQL (try different password options)
mysql -u root -p
# OR if no password
mysql -u root
```

Once connected, run these SQL commands:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS dsas_db;

-- Use the database
USE dsas_db;

-- Create tables
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

CREATE TABLE IF NOT EXISTS doctor_patient_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT NOT NULL,
    patient_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_assignment (doctor_id, patient_id)
);

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

-- Create indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_approved ON users(is_approved);
CREATE INDEX idx_assignments_doctor ON doctor_patient_assignments(doctor_id);
CREATE INDEX idx_assignments_patient ON doctor_patient_assignments(patient_id);
CREATE INDEX idx_records_patient ON health_records(patient_id);
CREATE INDEX idx_records_created ON health_records(created_at);

-- Create admin user
INSERT INTO users (username, email, password, role, first_name, last_name, is_approved) 
VALUES ('admin', 'admin@dsas.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Admin', 'User', TRUE)
ON DUPLICATE KEY UPDATE username=username;
```

## Step 3: Update Database Configuration

Create a `.env` file in the `backend` directory with your MySQL credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=dsas_db

# JWT Secret
JWT_SECRET=dsas-jwt-secret-2024

# Encryption Key
ENCRYPTION_KEY=dsas-secret-key-2024

# Server Port
PORT=3001
```

## Step 4: Test the Setup

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Test the admin login:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dsas.com","password":"password"}'
```

## Troubleshooting

### Common Issues:

1. **"Access denied for user 'root'@'localhost'"**
   - Check your MySQL password
   - Try connecting with: `mysql -u root -p`
   - If no password works, reset MySQL root password

2. **"Can't connect to MySQL server"**
   - Make sure MySQL service is running
   - Check if MySQL is listening on port 3306
   - Try: `netstat -an | grep 3306`

3. **"Unknown database 'dsas_db'"**
   - Run the CREATE DATABASE command manually
   - Check if you're using the correct database name

### Alternative: Use SQLite (No MySQL Required)

If you prefer not to set up MySQL, I can modify the system to use SQLite instead, which requires no server setup.
