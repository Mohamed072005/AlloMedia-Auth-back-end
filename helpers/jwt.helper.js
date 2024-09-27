const jwt = require('jsonwebtoken');

exports.generateJWTForVerifyAccount = (parameter) => { //parameter : email or userId
    return jwt.sign({email: parameter}, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

exports.verifyJWT = (token) => {
    return jwt.verify(token, process.env.TOKEN_SECRET);
}

exports.generateJWTForLogin = (identifier) => {
    return jwt.sign({id: identifier}, process.env.TOKEN_SECRET, { expiresIn: '24h' });
}