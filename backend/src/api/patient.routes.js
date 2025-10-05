// backend/src/api/patient.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/patient.controller');
const authJwt = require('../middleware/authJwt');

router.use(authJwt.verifyToken, authJwt.isPatient);

// Add debugging middleware
router.use((req, res, next) => {
  console.log('=== PATIENT ROUTES ===');
  console.log('Request URL:', req.originalUrl);
  console.log('Request method:', req.method);
  console.log('Request path:', req.path);
  next();
});

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Patient routes are working!', user: req.user });
});

router.get('/my-doctor', controller.getAssignedDoctor);
router.post('/upload', controller.uploadRecord);

// Add specific debugging for records route
router.get('/records', (req, res, next) => {
  console.log('=== PATIENT /records ROUTE HIT ===');
  console.log('Request URL:', req.originalUrl);
  console.log('Request path:', req.path);
  next();
}, controller.getPatientRecords);

router.get('/records/:recordId', controller.getRecord);

module.exports = router;