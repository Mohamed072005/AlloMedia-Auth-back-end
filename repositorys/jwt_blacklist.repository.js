const BlacklistJWT = require('../models/jwt_blacklist.model');

exports.storeJWT = async (token) => {
    const newToken = new BlacklistJWT({ jwt_token: token });
    await newToken.save();
}

exports.findBlacklistedJWT = async (token) => {
    return await BlacklistJWT.findOne({ jwt_token: token });
}