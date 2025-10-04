// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// API Routes
const authRoutes = require('./src/api/auth.routes');
const adminRoutes = require('./src/api/admin.routes');
const patientRoutes = require('./src/api/patient.routes');
const doctorRoutes = require('./src/api/doctor.routes');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/doctor', doctorRoutes);

// Simple route for health check
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the DSAS API. Server is healthy.' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database
    const dbInitialized = await initializeDatabase();
    
    if (dbInitialized) {
      app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
        console.log(`📊 Database: MySQL with Sequelize ORM`);
        console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    } else {
      console.error('❌ Failed to initialize database. Server not started.');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  const { closeDatabase } = require('./src/config/database');
  await closeDatabase();
  process.exit(0);
});

startServer();