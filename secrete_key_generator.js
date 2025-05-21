// Node.js built-in crypto module
const crypto = require('crypto');

const secret = crypto.randomBytes(64).toString('hex');
console.log(secret);
