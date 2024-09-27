const { findUserByEmailPhoneOrUsernameForRegister, findUserByEmailOrPhoneOrUserNameForLogin, createUser, findUserByEmail } = require('../repositorys/user.repository');
const { generateJWTForLogin } = require('../helpers/jwt.helper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

    const userExist = await findUserByEmailPhoneOrUsernameForRegister(email, phone_number, user_name);
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

exports.checkExistingUserByJWTEmail = async (token) => {
    try{
        if(!token || token === ''){
            throw new Error("invalid token");
        }
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const userEmail = decoded.email;
        const user = findUserByEmail(userEmail);
        if(!user){
            throw new Error('user not found');
        }
        return user;
    }catch(err){
        throw err;
    }

}

exports.login = async (identifier, password) => {
    try{
        const user = await findUserByEmailOrPhoneOrUserNameForLogin(identifier);
        
        if(!user){
            throw new Error('Invalide login');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            const token = generateJWTForLogin(user._id);
            return  {
                user,
                token: token
            };
        }else{
            throw new Error('Invalide login');
        }
    }catch(err){
        throw  err;
    }
}