# AWS RDS MySQL Setup Guide for DSAS

## Prerequisites
- AWS Account
- MySQL Workbench installed
- Node.js and npm installed

## Step 1: Create AWS RDS MySQL Instance

### 1.1 Login to AWS Console
- Go to [AWS Console](https://console.aws.amazon.com/)
- Navigate to **RDS** service

### 1.2 Create Database
1. Click **"Create database"**
2. Choose **"Standard create"**
3. Select **"MySQL"** as engine type
4. Choose **"MySQL 8.0"** version
5. Select **"Free tier"** template (for development)

### 1.3 Database Configuration
```
DB instance identifier: dsas-database
Master username: admin
Master password: [Create a strong password]
DB instance class: db.t3.micro (Free tier)
Storage: 20 GB (Free tier)
```

### 1.4 Connectivity Settings
```
VPC: Default VPC
Subnet group: Default
Public access: Yes (for development)
VPC security groups: Create new
Security group name: dsas-mysql-sg
```

### 1.5 Security Group Configuration
1. Go to **EC2** → **Security Groups**
2. Find your `dsas-mysql-sg` security group
3. Edit **Inbound rules**:
   - Type: MySQL/Aurora
   - Port: 3306
   - Source: My IP (or 0.0.0.0/0 for development)
   - Description: MySQL access

### 1.6 Database Options
```
Initial database name: dsas_db
Backup retention: 7 days
Monitoring: Disable enhanced monitoring
Log exports: Disable
Maintenance window: No preference
```

## Step 2: Connect MySQL Workbench to RDS

### 2.1 Get RDS Endpoint
1. Go to **RDS** → **Databases**
2. Click on your `dsas-database` instance
3. Copy the **Endpoint** (e.g., `dsas-database.abc123.us-east-1.rds.amazonaws.com`)

### 2.2 Create Connection in MySQL Workbench
1. Open MySQL Workbench
2. Click **"+"** next to MySQL Connections
3. Configure connection:
   ```
   Connection Name: DSAS RDS
   Hostname: [Your RDS Endpoint]
   Port: 3306
   Username: admin
   Password: [Your master password]
   ```
4. Click **"Test Connection"**
5. Click **"OK"** to save

## Step 3: Configure DSAS Application

### 3.1 Create Environment File
Create `.env` file in `backend/` directory:

```env
# Database Configuration
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_PORT=3306
DB_NAME=dsas_db
DB_USER=admin
DB_PASSWORD=your_master_password

# JWT Configuration
JWT_SECRET=dsas-jwt-secret-2024

# Encryption Configuration
ENCRYPTION_KEY=dsas-secret-key-2024

# Server Configuration
PORT=3001
NODE_ENV=production
```

### 3.2 Update Database Configuration
The application is already configured to use environment variables. No code changes needed.

## Step 4: Initialize Database

### 4.1 Run Migration
```bash
cd backend
node migrate-to-mysql.js
```

### 4.2 Start Application
```bash
npm run dev
```

## Step 5: Verify Setup

### 5.1 Check Database Tables
In MySQL Workbench, run:
```sql
USE dsas_db;
SHOW TABLES;
```

You should see:
- users
- health_records
- doctor_patient_assignments

### 5.2 Test Application
1. Start the backend: `npm run dev`
2. Start the frontend: `npm start`
3. Test user registration and login
4. Verify data is stored in RDS

## Step 6: Production Considerations

### 6.1 Security
- Use VPC with private subnets
- Configure security groups properly
- Enable SSL connections
- Use IAM database authentication

### 6.2 Monitoring
- Enable CloudWatch monitoring
- Set up alarms for CPU, memory, connections
- Monitor slow query log

### 6.3 Backup
- Enable automated backups
- Test restore procedures
- Consider point-in-time recovery

## Troubleshooting

### Connection Issues
1. Check security group rules
2. Verify RDS endpoint
3. Check credentials
4. Ensure RDS is in "Available" state

### Performance Issues
1. Monitor CloudWatch metrics
2. Check slow query log
3. Consider read replicas
4. Optimize queries

### Cost Optimization
1. Use reserved instances for production
2. Monitor unused resources
3. Set up billing alerts
4. Consider Aurora Serverless for variable workloads

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| DB_HOST | RDS endpoint | dsas-db.abc123.us-east-1.rds.amazonaws.com |
| DB_PORT | MySQL port | 3306 |
| DB_NAME | Database name | dsas_db |
| DB_USER | Username | admin |
| DB_PASSWORD | Password | your_secure_password |
| JWT_SECRET | JWT signing secret | your_jwt_secret |
| ENCRYPTION_KEY | Data encryption key | your_encryption_key |

## Next Steps

1. Set up CI/CD pipeline
2. Configure monitoring and alerting
3. Implement backup strategies
4. Set up staging environment
5. Configure SSL certificates
6. Implement database connection pooling
7. Set up database replication for high availability
