// backend/src/api/auth.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/verify', controller.verifyToken);

module.exports = router;