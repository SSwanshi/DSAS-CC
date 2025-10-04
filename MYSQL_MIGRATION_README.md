# DSAS MySQL Migration Guide

## Overview
This guide explains the migration from SQLite to MySQL with Sequelize ORM for AWS RDS integration.

## What's Changed

### 1. Database Layer
- **From:** SQLite with raw SQL queries
- **To:** MySQL with Sequelize ORM
- **Benefits:** Better scalability, AWS RDS support, ORM benefits

### 2. New Files Added
```
backend/
├── src/
│   ├── config/
│   │   ├── sequelize.config.js      # Sequelize configuration
│   │   └── database.js              # Database initialization
│   └── models/
│       └── sequelize/
│           ├── User.js              # User model
│           ├── HealthRecord.js      # Health record model
│           ├── DoctorPatientAssignment.js  # Assignment model
│           └── associations.js      # Model associations
├── migrate-to-mysql.js              # Migration script
├── env.example                      # Environment variables template
└── AWS_RDS_SETUP_GUIDE.md          # AWS RDS setup guide
```

### 3. Updated Files
- `server.js` - Added database initialization
- All controllers - Updated to use Sequelize models
- `package.json` - Added migration scripts

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Copy `env.example` to `.env` and update with your RDS credentials:
```env
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_PORT=3306
DB_NAME=dsas_db
DB_USER=your_username
DB_PASSWORD=your_password
```

### 3. Run Migration
```bash
npm run migrate
```

### 4. Start Application
```bash
npm run dev
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'doctor', 'patient') NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  phone VARCHAR(20),
  specialization VARCHAR(100),
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Health Records Table
```sql
CREATE TABLE health_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  encrypted_data TEXT NOT NULL,
  data_type VARCHAR(50) NOT NULL,
  file_name VARCHAR(255),
  file_size INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id)
);
```

### Doctor-Patient Assignments Table
```sql
CREATE TABLE doctor_patient_assignments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  doctor_id INT NOT NULL,
  patient_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES users(id),
  FOREIGN KEY (patient_id) REFERENCES users(id),
  UNIQUE KEY unique_assignment (doctor_id, patient_id)
);
```

## Sequelize Models

### User Model
- Automatic password hashing with bcrypt
- Instance method: `verifyPassword()`
- Class methods: `findByEmail()`, `findByUsername()`, etc.

### HealthRecord Model
- Belongs to User (patient)
- Encrypted data storage
- Class methods for querying by patient/doctor

### DoctorPatientAssignment Model
- Many-to-many relationship between doctors and patients
- Class methods for managing assignments

## API Endpoints (Unchanged)
All API endpoints remain the same. The migration is transparent to the frontend.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DB_HOST | RDS endpoint | Yes |
| DB_PORT | MySQL port (default: 3306) | No |
| DB_NAME | Database name | Yes |
| DB_USER | Database username | Yes |
| DB_PASSWORD | Database password | Yes |
| JWT_SECRET | JWT signing secret | Yes |
| ENCRYPTION_KEY | Data encryption key | Yes |

## Migration Scripts

### Available Scripts
```bash
npm run migrate      # Run full migration
npm run db:sync      # Sync database schema
npm run dev          # Start development server
npm start            # Start production server
```

### Manual Migration
```bash
node migrate-to-mysql.js
```

## AWS RDS Setup

1. Create RDS MySQL instance
2. Configure security groups
3. Get connection endpoint
4. Update `.env` file
5. Run migration script

See `AWS_RDS_SETUP_GUIDE.md` for detailed instructions.

## Troubleshooting

### Connection Issues
- Check RDS endpoint and credentials
- Verify security group allows your IP
- Ensure RDS instance is running

### Migration Issues
- Check database permissions
- Verify all dependencies installed
- Check environment variables

### Performance Issues
- Monitor RDS metrics
- Check connection pooling
- Optimize queries

## Benefits of Migration

1. **Scalability:** Better performance with large datasets
2. **AWS Integration:** Native RDS support
3. **ORM Benefits:** Type safety, migrations, associations
4. **Production Ready:** Better for production deployment
5. **Backup & Recovery:** AWS managed backups
6. **Monitoring:** CloudWatch integration

## Next Steps

1. Set up AWS RDS instance
2. Configure production environment
3. Set up monitoring and alerting
4. Implement CI/CD pipeline
5. Configure SSL certificates
6. Set up database replication

## Support

For issues or questions:
1. Check the AWS RDS setup guide
2. Verify environment configuration
3. Check application logs
4. Test database connection manually
