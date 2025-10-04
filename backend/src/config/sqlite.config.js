// backend/src/config/sqlite.config.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create SQLite database connection
const dbPath = path.join(__dirname, '../../dsas.db');
const db = new sqlite3.Database(dbPath);

// Promisify database methods for async/await usage
const promisify = (method) => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      method.call(db, ...args, function(err, result) {
        if (err) reject(err);
        else {
          // For INSERT operations, include lastID and changes
          if (this && this.lastID !== undefined) {
            resolve({
              lastID: this.lastID,
              changes: this.changes,
              ...result
            });
          } else {
            resolve(result);
          }
        }
      });
    });
  };
};

// Create promise-based database object
const dbPromise = {
  execute: promisify(db.run),
  query: promisify(db.all),
  get: promisify(db.get),
  run: promisify(db.run),
  all: promisify(db.all)
};

module.exports = dbPromise;
