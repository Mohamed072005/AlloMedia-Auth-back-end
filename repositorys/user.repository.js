const User = require('../models/user.model');

exports.findUserByEmailPhoneOrUsernameForRegister = async (email, phonNumber, userName) => {
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
    return await User.findOne({email : email});
}

exports.findUserByEmailOrPhoneOrUserName = async (identifier) => {
    return await User.findOne({
        $or : [
            {
                email: identifier
            },
            {
                phone_number: identifier
            },
            {
                user_name: identifier
            }
        ],
    })
}

exports.findUserById = async (userId) => {
    return await User.findOne({ _id: userId });
}