const User = require('../models/user.model');

exports.findUserByEmailPhoneOrUsername = async (email, phonNumber, userName) => {
    return User.findOne({
        $or : [
            {
                email: email
            },
            {
                phone_number: phonNumber
            },
            {
                user_name: userName
            }
        ]
    });
};

exports.createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
}

exports.getUsers = async () => {
    return User.find();
}

exports.findUserByEmail = async (email) => {
    return User.findOne({email : email});
}

