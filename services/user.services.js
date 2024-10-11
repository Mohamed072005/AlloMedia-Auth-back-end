const { findUserByEmailPhoneOrUsernameForRegister, findUserByEmailOrPhoneOrUserName, createUser, findUserByEmail, findUserById } = require('../repositorys/user.repository');
const { generateJWT, verifyJWT } = require('../helpers/jwt.helper');
const { generateOTP } = require('../helpers/otp.generator.helper');
const bcrypt = require('bcryptjs');
const { sendMailForResetPassword, sendOTPEmail, sendMail } = require('./email.services');
const { default: mongoose } = require('mongoose');

exports.register = async (userData, userAgent) => {
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
        const error = new Error('a user with this email or phone or nick name already exists');
        error.status = 409;
        throw error;
    }

    const newUser = await createUser({
        email, 
        password: hachedPassword, 
        phone_number, 
        user_name,
        full_name,
        country,
        city,
        address,
    })
    newUser.user_agents.push({ agent: userAgent, isCurrent: true});
    await newUser.save();
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
        if (!userAgent || userAgent === ''){
            return false;
        }
        const currentAgent = await user.user_agents.find(ua => ua.agent === userAgent);
        return currentAgent ? currentAgent : false;
    }

exports.login = async (identifier, password, userAagent) => {
    try{
        const user = await findUserByEmailOrPhoneOrUserName(identifier);
        if(!user){
            throw new Error('Invalide login');
        }
        if(!user.virefied){
            const token = generateJWT(user.email, '1800s');
            await sendMail(user, token);
            return {
                message: "We send you an email to confirm your account",
                user_email: user.email,
                status: 204
            }
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            const agent = await this.verifyUserAgentForOTP(userAagent, user);
            if(agent && agent.isCurrent){
                const token = generateJWT(user._id, '24h');
                return  {
                    message: "login successfully",
                    token: token,
                    status: 200
                };
            }
            const otp = generateOTP();
            const token = generateJWT({code: otp, user_id: user._id, user_email: user.email}, '120s');
            await sendOTPEmail(user, otp, userAagent);
            return  {
                message: "we send you email with code to virefy this new device",
                user_id: user._id,
                token: token,
                status: 202
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
        const alreadyHaveThisAgent = await this.verifyUserAgentForOTP(userAagent, user);
        if(rememberMe){
            if(alreadyHaveThisAgent){                
                alreadyHaveThisAgent.isCurrent = true;
                await user.save();
            }else{
                user.user_agents.push({ agent: userAagent, isCurrent: true});
                await user.save();
            }
        }else {
            if(!alreadyHaveThisAgent){
                user.user_agents.push({ agent: userAagent });
                await user.save();
            }
        }
        return {
            token: generateJWT(user._id, '24h'),
        } 
    }catch(err){
        throw err;
    }
}

exports.resetOTPService = async (user_id, userAgent) => {
    try{
        if((!user_id || user_id === '') || !mongoose.Types.ObjectId.isValid(user_id)){
            const error = new Error('You are not authorized');
            error.status = 401;
            throw error
        }
        const user = await findUserById(user_id);
        if(!user){
            const error = new Error('You are not authorized');
            error.status = 401;
            throw error
        }
        const OTPCode = generateOTP();
        const JWTtoken = generateJWT({ code: OTPCode, user_id: user._id , user_email: user.email }, '120s');
        await sendOTPEmail(user, OTPCode, userAgent);
            return  {
                message: "we send you email with code to virefy this new device",
                token: JWTtoken,
                user_email: user.email,
                user_id: user._id
            };
    }catch(err){
        throw err
    }
}