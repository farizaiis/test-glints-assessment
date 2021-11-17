require('dotenv').config();
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY_JWT;

function generateToken(dataUser = {}) {
    let token = jwt.sign(dataUser, secretKey);
    return token;
}

module.exports = { generateToken };
