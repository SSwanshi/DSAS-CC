// backend/src/api/admin.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin.controller');
const authJwt = require('../middleware/authJwt');

// All admin routes should be protected
router.use(authJwt.verifyToken, authJwt.isAdmin);

router.get('/pending-users', controller.getPendingUsers);
router.put('/users/:userId/verify', controller.verifyUser);
router.post('/assign-doctor', controller.assignDoctor);
router.post('/unassign-doctor', controller.unassignDoctor);
router.get('/assignment-data', controller.getAssignmentData);
router.get('/all-records', controller.getAllRecords);
router.get('/users/:role', controller.getUsersByRole);

module.exports = router;