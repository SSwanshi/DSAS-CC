// backend/src/api/patient.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/patient.controller');
const authJwt = require('../middleware/authJwt');

router.use(authJwt.verifyToken, authJwt.isPatient);

router.get('/my-doctor', controller.getAssignedDoctor);
router.post('/upload', controller.uploadRecord);
router.get('/records', controller.getPatientRecords);
router.get('/records/:recordId', controller.getRecord);

module.exports = router;