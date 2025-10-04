// backend/src/config/aws.config.js
require('dotenv').config();
const AWS = require('aws-sdk');

// Configure the AWS SDK with credentials from the .env file
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Create and export a new S3 instance that can be used in other files
const s3 = new AWS.S3();

module.exports = s3;