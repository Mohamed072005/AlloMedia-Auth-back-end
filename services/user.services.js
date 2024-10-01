const { findUserByEmailPhoneOrUsernameForRegister, findUserByEmailOrPhoneOrUserName, createUser, findUserByEmail, findUserById } = require('../repositorys/user.repository');
const { generateJWT, verifyJWT } = require('../helpers/jwt.helper');
const bcrypt = require('bcrypt');
const { sendMailForResetPassword } = require('./email.services');

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
        
        const decoded = verifyJWT(token);
        const userEmail = decoded.identifier;
        const user = await findUserByEmail(userEmail); 
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
        const user = await findUserByEmailOrPhoneOrUserName(identifier);
        
        if(!user){
            throw new Error('Invalide login');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            const token = generateJWT(user._id, '24h');
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

exports.sendEmailForResetPassword = async (identifier) => {
    try{
        const findUser = await findUserByEmailOrPhoneOrUserName(identifier);        
        if(!findUser){
            const error = new Error('Invalid Identifier');
            error.status = 401;
            throw error;
        }
        
        const token = generateJWT(identifier, '300s');
        await sendMailForResetPassword(findUser ,token);
        return findUser;
    }catch(err){
        
        throw err;
    }
}

exports.confirmeResetPasswordRequest = async (token) => {
    try {
        if(!token || token === ''){
            const error = new Error('invalide Token'); 
            error.status = 401;
            throw error;
        }
        const virefiedToken = verifyJWT(token);
        const findUser = await findUserByEmailOrPhoneOrUserName(virefiedToken.identifier);
        if(!findUser){
            const error = new Error('User not found'); 
            error.status = 404;
            throw error;
        }
        return findUser.id;
    }catch(err){
        throw err;
    }
}

exports.completeRestPasswordRequest = async (password, user) => {
    try{
        const findUser = await findUserById(user);
        if(!findUser){
            const error = new Error('User not found');
            console.log("Hello");
            error.status = 404;
            throw error;
        }
        const hachedPassword = await bcrypt.hash(password, 10);
        findUser.password = hachedPassword;
        await findUser.save();
        return findUser;
    }catch(err){
        throw err;
    }
}