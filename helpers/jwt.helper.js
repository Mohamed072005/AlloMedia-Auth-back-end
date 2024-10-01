const jwt = require('jsonwebtoken');

exports.generateJWT = (parameter, time) => { //parameter : email or userId
    return jwt.sign({identifier: parameter}, process.env.TOKEN_SECRET, { expiresIn: time });
}

exports.verifyJWT = (token) => {    
    return jwt.verify(token, process.env.TOKEN_SECRET);
}