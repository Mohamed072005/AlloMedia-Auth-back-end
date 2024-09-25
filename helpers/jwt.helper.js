const jwt = require('jsonwebtoken');

exports.generateJWTForVerifyAccount = (parameter) => { //parameter : email or userId
    return jwt.sign({email: parameter}, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}