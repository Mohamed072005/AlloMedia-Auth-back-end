const { register, checkExistingUserByJWTEmail } = require('../services/user.services');
const { getUsers } = require('../repositorys/user.repository');
const { sendMail } = require('../services/email.services');
const { generateJWTForVerifyAccount } = require('../helpers/jwt.helper');

exports.register = async (req, res) => {
    const userData = req.body;
    try{
        const newUser = await register(userData);
        const token = generateJWTForVerifyAccount(newUser.email);
        const sendEmail = await sendMail(newUser, token);
        return res.status(200).json({
            message: "registered and email sended",
            user: newUser,
            email : sendEmail,
            token: token
        })
    }catch(error){
        if(error.message === 'user already exists'){
            return res.status(409).json({
                errorMessage: error.message
            })
        }
        if(error.name === 'ValidationError'){
            const firstErrorKey = Object.keys(error.errors)[0];
            const firstError = error.errors[firstErrorKey]; 

            return res.status(400).json({
            field: firstError.path,
            message: firstError.message
            });
        }
        return res.status(500).json(error);
    }
}

exports.checkEmailConfirmed = async (req, res) => {
    const token = req.query.token;
    try{
        const user = await checkExistingUserByJWTEmail(token);
        user.virefied = true;
        user.save();
        return res.status(200).json({
            message: 'User found successfully',
            user: user
        });
    }catch(err){
        if(err.message === 'invalid token'){
            return res.status(400).json({
                message: err.message
            });
        }

        if(err.message === 'user not found'){
            return res.status(404).json({
                message: err.message
            });
        }

        if(err.message === 'TokenExpiredError: jwt expired'){
            return res.status(401).json({
                message: err.message
            });
        }
        return res.status(500).json({
            message: err.message
        });
    }
}

exports.getUsers = async (req, res) => {
    const response = await getUsers();
    return res.status(200).json(response);
}