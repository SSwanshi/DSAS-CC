// backend/src/middleware/authJwt.js
const jwt = require('jsonwebtoken');

// JWT verification logic
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dsas-jwt-secret-2024');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Role-checking logic
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const isDoctor = (req, res, next) => {
  console.log('=== DOCTOR MIDDLEWARE CHECK ===');
  console.log('Request URL:', req.originalUrl);
  console.log('Request method:', req.method);
  console.log('User role:', req.user?.role);
  console.log('User ID:', req.user?.id);
  
  if (req.user.role !== 'doctor') {
    console.log('❌ DOCTOR ACCESS DENIED - User role:', req.user?.role);
    return res.status(403).json({ message: 'Doctor access required' });
  }
  console.log('✅ DOCTOR ACCESS GRANTED');
  next();
};

const isPatient = (req, res, next) => {
  console.log('=== PATIENT MIDDLEWARE CHECK ===');
  console.log('Request URL:', req.originalUrl);
  console.log('Request method:', req.method);
  console.log('User role:', req.user?.role);
  console.log('User ID:', req.user?.id);
  
  if (req.user.role !== 'patient') {
    console.log('❌ PATIENT ACCESS DENIED - User role:', req.user?.role);
    return res.status(403).json({ message: 'Patient access required' });
  }
  console.log('✅ PATIENT ACCESS GRANTED');
  next();
};

const authJwt = {
  verifyToken,
  isAdmin,
  isDoctor,
  isPatient
};

module.exports = authJwt;