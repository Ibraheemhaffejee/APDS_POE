const fs = require('fs');
const path = require('path');

// Read SSL certificate and key from the files
const privateKey = fs.readFileSync(path.resolve(__dirname, '/Users/Ethan/Downloads/P2_APDS_Final/backend/private.key'), 'utf8');
const certificate = fs.readFileSync(path.resolve(__dirname, '/Users/Ethan/Downloads/P2_APDS_Final/backend/certificate.crt'), 'utf8');

// Export the credentials to be used in the main app
const credentials = { key: privateKey, cert: certificate };

module.exports = credentials;
