const { findUserByEmailPhoneOrUsernameForRegister, findUserByEmailOrPhoneOrUserName, createUser, findUserByEmail, findUserById } = require('../repositorys/user.repository');
const { generateJWT, verifyJWT } = require('../helpers/jwt.helper');
const { generateOTP } = require('../helpers/otp.generator.helper');
const bcrypt = require('bcrypt');
const { sendMailForResetPassword, sendOTPEmail } = require('./email.services');

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

exports.verifyUserAgentForOTP = async (userAgent, user) => {
        const currentAgent = await user.user_agents.find(ua => ua.agent === userAgent);
        if(currentAgent){
            return true;
        }
        return false;
    }

exports.login = async (identifier, password, userAagent) => {
    try{
        const user = await findUserByEmailOrPhoneOrUserName(identifier);
        if(!user){
            throw new Error('Invalide login');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            const agent = await this.verifyUserAgentForOTP(userAagent, user);
            if(agent){
                const token = generateJWT(user._id, '24h');
                return  {
                    message: "login successfully",
                    agent: true,
                    user,
                    token: token
                };
            }
            const otp = generateOTP();
            const token = generateJWT({code: otp, user_id: user._id, user_email: user.email}, '300s');
            await sendOTPEmail(user, otp, userAagent);
            return  {
                message: "we send you email with code to virefy this new device",
                token: token,
                agent: false,
                user,
            };
        }else{
            console.log(user);
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

exports.handelOTPCode = async (token, code, rememberMe, userAagent) => {
    try{
        if((!token || token === '') && (!code || code === '')){
            const error = new Error('invalide code or token, try again!'); 
            error.status = 401;
            throw error;
        }
        const verifyToken = verifyJWT(token);
        if(verifyToken.identifier.code !== code){
            const error = new Error('invalide code!'); 
            error.status = 401;
            throw error;
        }
        const user =  await findUserById(verifyToken.identifier.user_id);
        if(!user){
            const error = new Error('user not found!'); 
            error.status = 404;
            throw error;
        }
        if(rememberMe){
            user.user_agents.push({ agent: userAagent, isCurrent: true});
            await user.save();
        }else {
            user.user_agents.push({ agent: userAagent });
            await user.save();
        }
        

        return {
            token: generateJWT(user._id, '24h'),
            user: user
        } 
    }catch(err){
        throw err;
    }
}