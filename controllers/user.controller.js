const { sendEmailForResetPassword, confirmeResetPasswordRequest, completeRestPasswordRequest } = require('../services/user.services');

exports.sendEmailForResertPassword = async (req, res) => {
    const { identifier } = req.body;    
    try{
        const response = await sendEmailForResetPassword(identifier);        
        return res.status(200).json({
            message: "Email sended success",
            user_email: response.email
        })
    }catch(err){
        console.log(err.message);
        
        if(err.status === 401){
            return res.status(401).json({
                message: err.message
            })
        }
        return res.status(500).json(err);
    }
}

exports.confirmeResetPassword = async (req, res) => {
    const token = req.query.token;
    try{
        const response = await confirmeResetPasswordRequest(token);
        return res.render('resetPasswordPage', {
            user: response
        });        
    }catch(err){
        if(err.message === 'jwt expired' || err.message === 'invalid signature'){
            return res.status(401).json({
                message: err.message
            });
        }
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.resetPassword = async (req, res) => {
    const { password, user } = req.body;
    try{
        const response = await completeRestPasswordRequest(password, user);
        return res.status(200).json({
            message: 'reset password successfully',
            user: response,
            status: 200
        })
    }catch(err){
        if(err.status === 404){
            return res.status(404).json({
                message: 'There is no user with this identifier',
                status: 404
            })
        }
    }
}