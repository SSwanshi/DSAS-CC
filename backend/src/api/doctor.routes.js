// backend/src/api/doctor.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/doctor.controller');
const authJwt = require('../middleware/authJwt');

router.use(authJwt.verifyToken, authJwt.isDoctor);

// Add debugging middleware
router.use((req, res, next) => {
  console.log('=== DOCTOR ROUTES ===');
  console.log('Request URL:', req.originalUrl);
  console.log('Request method:', req.method);
  console.log('Request path:', req.path);
  next();
});

router.get('/assigned-patients', controller.getAssignedPatients);
router.get('/all-patients', controller.getAllPatients);
router.get('/search-patients', controller.searchPatients);
router.get('/patients/:patientId/records', controller.getPatientRecordsForDoctor);

// Add specific debugging for record route
router.get('/record/:recordId', (req, res, next) => {
  console.log('=== DOCTOR /record/:recordId ROUTE HIT ===');
  console.log('Request URL:', req.originalUrl);
  console.log('Request path:', req.path);
  console.log('Record ID:', req.params.recordId);
  next();
}, controller.getRecordForDoctor);

module.exports = router;