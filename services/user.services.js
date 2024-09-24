const { findUserByEmailPhoneOrUsername, createUser } = require('../repositorys/user.repository');
const bcrypt = require('bcrypt');

exports.register = async (userData) => {
    const { 
        email, 
        password, 
        phone_number, 
        user_name,
        full_name,
        country,
        city,
        address
        } = userData;

    const userExist = await findUserByEmailPhoneOrUsername(email, phone_number, user_name);
    const hachedPassword = await bcrypt.hash(password, 10);
    if(userExist){
        throw new Error('user already exists');
    }

    const newUser = await createUser({
        email, 
        password: hachedPassword, 
        phone_number, 
        user_name,
        full_name,
        country,
        city,
        address
    })

    return newUser;
}