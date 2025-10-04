# DSAS Setup Instructions

## Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Backend Setup

1. Navigate to the backend directory:
```bash
cd DSAS-Project/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=dsas_db

# JWT Secret
JWT_SECRET=dsas-jwt-secret-2024

# Encryption Key
ENCRYPTION_KEY=dsas-secret-key-2024

# Server Port
PORT=3001
```

4. Set up the MySQL database:
   - Create a database named `dsas_db`
   - Run the SQL script from `backend/database_schema.sql` to create tables

5. Start the backend server:
```bash
npm run dev
```

The backend will run on http://localhost:3001

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd DSAS-Project/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend will run on http://localhost:3000

## Default Admin Credentials

- Email: admin@dsas.com
- Password: password

## Features

### Patient Features
- Register/Login as patient
- Upload health data (encrypted)
- View uploaded files
- See assigned doctor

### Doctor Features
- Register/Login as doctor
- View assigned patients
- Search all patients
- View patient records (decrypted)
- Access to patient health data

### Admin Features
- Login as admin (Cloud Server)
- Approve patient registrations
- Approve doctor registrations
- Assign doctors to patients
- View all uploaded data (encrypted)

## Security Features

- All patient data is encrypted using cryptr before storage
- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Secure API endpoints

## Database Schema

The system uses the following main tables:
- `users` - Stores all users (patients, doctors, admins)
- `doctor_patient_assignments` - Manages doctor-patient relationships
- `health_records` - Stores encrypted health data

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/verify` - Verify token

### Patient Endpoints
- GET `/api/patient/my-doctor` - Get assigned doctor
- POST `/api/patient/upload` - Upload health record
- GET `/api/patient/records` - Get patient records

### Doctor Endpoints
- GET `/api/doctor/assigned-patients` - Get assigned patients
- GET `/api/doctor/all-patients` - Get all patients
- GET `/api/doctor/patients/:id/records` - Get patient records
- GET `/api/doctor/search-patients` - Search patients

### Admin Endpoints
- GET `/api/admin/pending-users` - Get pending users
- PUT `/api/admin/users/:id/verify` - Approve/reject user
- POST `/api/admin/assign-doctor` - Assign doctor to patient
- GET `/api/admin/all-records` - Get all records
