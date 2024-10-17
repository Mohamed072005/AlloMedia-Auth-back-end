const { register, checkExistingUserByJWTEmail, login, handelOTPCode, resetOTPService } = require('../services/user.services');
const { getUsers } = require('../repositorys/user.repository');
const { sendMail } = require('../services/email.services');
const { generateJWT } = require('../helpers/jwt.helper');
const { storeJWT } = require('../repositorys/jwt_blacklist.repository');

exports.register = async (req, res) => {
    const userAgent = req.headers['user-agent'];
    const userData = req.body;
    try{
        const newUser = await register(userData, userAgent);
        if (!newUser) {
            const error = new Error('user doesn\'t created!');
            error.status = 400;
            throw error;
        }
        const token = generateJWT(userData.email, '1800s');
        const sendEmail = await sendMail(newUser, token);
        return res.status(200).json({
            message: "registered and email sended",
            user: newUser,
            email : sendEmail,
            token: token
        })
    }catch(error){
        if(error.status === 401){
            return res.status(401).json({
                message: error.message
            })
        }
        if (error.status === 400){
            return res.status(400).json({
                message: error.message
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
        return res.status(500).json(error.message);
    }
}

exports.checkEmailConfirmed = async (req, res) => {
    const token = req.query.token;
    try{
        const user = await checkExistingUserByJWTEmail(token);
        user.virefied = true;
        user.save();
        res.redirect(`${process.env.FRONT_END_URL}/login`);
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

        if(err.message === 'jwt expired' || err.message === 'invalid signature'){
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

exports.login = async (req, res) => {
    const { password, identifier } = req.body;
    const userAgent = req.headers['user-agent'];
    try{
        const response = await login(identifier, password, userAgent);
        if (response.status === 200){
            return res.status(200).json({
                response: response,
                isLogged: true
            })
        }
        if (response.status === 202){
            return res.status(202).json({
                response: response,
            })
        }
        if(response.status === 204){
            return res.status(200).json({
                user_email: response.user_email,
                message: response.message,
                isLogged: false
            });
        }
    }catch(error){
        if(error.message === 'Invalide login'){
            return res.status(401).json({
                message: "Invalide login!!",
            })
        }
        return res.status(500).json({
            message: error.message || "Server error"
        });
    }
}

exports.virefyOTPCode = async(req, res) => {
    const { code, rememberMe} = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    const userAgent = req.headers['user-agent'];    
    try{
        const response = await handelOTPCode(token, code, rememberMe, userAgent);
        return res.status(200).json({
            message: "Login success",
            response
        }) 
    }catch(err){
        if(err.status === 401){
            return res.status(401).json({
                message: err.message
            })
        }
        if(err.status === 404){
            return res.status(404).json({
                message: err.message,
            })
        }
        if(err.name === 'JsonWebTokenError'){
            return res.status(401).json({
                message: err.message,
            })
        }
        return res.status(500).json(err);
    }
}

exports.resendOTPCode = async (req, res) => {
    const { user_id } = req.body;
    const userAgrnt = req.headers['user-agent'];
    try{
        const resposne = await resetOTPService(user_id, userAgrnt);
        return res.status(200).json({
            message: resposne.message,
            user_id: resposne.user_id,
            user_email: resposne.user_email,
            token: resposne.token
        })
    }catch(err){
        if(err.status === 401){
            return res.status(401).json({
                message: err.message
            })
        }
        if(err.name === 'JsonWebTokenError' || err.message === 'jwt expired' || err.message === 'invalid signature'){
            return res.status(401).json({
                message: err.message,
            })
        }
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.logout = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    try{
        if(!token || token === ''){
            const error = new Error('No jwt token provided');
            error.status = 401;
            throw error
        }
        await storeJWT(token);
        return res.status(200).json({
            message: 'Logout successfully'
        })
    }catch (err){
        if(err.status === 401){
            return res.status(401).json({
                error: err.message
            })
        }
        return res.status(500).json({
            error: 'Server error'
        })
    }
}