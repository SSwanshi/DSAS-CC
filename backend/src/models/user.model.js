// backend/src/models/user.model.js
const db = require('../config/db.config');
const bcrypt = require('bcryptjs');

const User = {};

// Create a new user
User.create = async (userData) => {
  try {
    const { username, email, password, role, firstName, lastName, phone, specialization } = userData;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (username, email, password, role, first_name, last_name, phone, specialization, is_approved, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `;
    
    const result = await db.execute(query, [
      username, email, hashedPassword, role, firstName, lastName, phone, specialization, role === 'admin' ? 1 : 0
    ]);
    
    return { id: result.lastID, ...userData, password: undefined };
  } catch (error) {
    throw error;
  }
};

// Find user by email
User.findByEmail = async (email) => {
  try {
    const query = 'SELECT * FROM users WHERE email = ?';
    const rows = await db.query(query, [email]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// Find user by ID
User.findById = async (id) => {
  try {
    const query = 'SELECT * FROM users WHERE id = ?';
    const rows = await db.query(query, [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// Find user by username
User.findByUsername = async (username) => {
  try {
    const query = 'SELECT * FROM users WHERE username = ?';
    const rows = await db.query(query, [username]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// Update user approval status
User.updateApproval = async (id, isApproved) => {
  try {
    const query = 'UPDATE users SET is_approved = ? WHERE id = ?';
    await db.execute(query, [isApproved, id]);
    return true;
  } catch (error) {
    throw error;
  }
};

// Get all users by role
User.findByRole = async (role) => {
  try {
    const query = 'SELECT * FROM users WHERE role = ? ORDER BY created_at DESC';
    const rows = await db.query(query, [role]);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Get pending approvals
User.getPendingApprovals = async (role) => {
  try {
    const query = 'SELECT * FROM users WHERE role = ? AND is_approved = 0 ORDER BY created_at DESC';
    const rows = await db.query(query, [role]);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Verify password
User.verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = User;