// backend/src/services/crypto.service.js
const Cryptr = require('cryptr');

const CryptoService = {};

// Initialize cryptr with a secret key (in production, use environment variable)
const cryptr = new Cryptr(process.env.ENCRYPTION_KEY || 'dsas-secret-key-2024');

// Encrypt data
CryptoService.encrypt = (data) => {
  try {
    return cryptr.encrypt(JSON.stringify(data));
  } catch (error) {
    throw new Error('Encryption failed: ' + error.message);
  }
};

// Decrypt data
CryptoService.decrypt = (encryptedData) => {
  try {
    const decryptedString = cryptr.decrypt(encryptedData);
    return JSON.parse(decryptedString);
  } catch (error) {
    throw new Error('Decryption failed: ' + error.message);
  }
};

// Encrypt file data
CryptoService.encryptFile = (fileData) => {
  try {
    return cryptr.encrypt(fileData);
  } catch (error) {
    throw new Error('File encryption failed: ' + error.message);
  }
};

// Decrypt file data
CryptoService.decryptFile = (encryptedFileData) => {
  try {
    return cryptr.decrypt(encryptedFileData);
  } catch (error) {
    throw new Error('File decryption failed: ' + error.message);
  }
};

// Generate a new encryption key (for admin use)
CryptoService.generateKey = () => {
  return require('crypto').randomBytes(32).toString('hex');
};

module.exports = CryptoService;