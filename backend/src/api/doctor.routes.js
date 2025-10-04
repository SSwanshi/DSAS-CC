// backend/src/api/doctor.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/doctor.controller');
const authJwt = require('../middleware/authJwt');

router.use(authJwt.verifyToken, authJwt.isDoctor);

router.get('/assigned-patients', controller.getAssignedPatients);
router.get('/all-patients', controller.getAllPatients);
router.get('/patients/:patientId/records', controller.getPatientRecords);
router.get('/records/:recordId', controller.getRecord);
router.get('/search-patients', controller.searchPatients);

module.exports = router;