const { body, validationResult } = require('express-validator')

exports.requestResetPasswordValidation = [
    body('identifier')
        .trim()
        .notEmpty()
        .withMessage('The Identifier is required')
        .custom(value => {
            const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            const phoneNumberFormat = /^\+?[1-9]\d{1,14}$/.test(value)
            const userNameFormat = /^[a-zA-Z0-9_]+$/.test(value)

            if(!emailFormat && !phoneNumberFormat && !userNameFormat) {
                throw new Error('Invalide identifiant');
            }
            return true;
        }),
        function (req, res, next) {
            try{
                const errors = validationResult(req);
                if(!errors.isEmpty()){
                    return res.status(401).json({
                        error: errors.array()[0].msg
                    })
                }
                next();
            }catch(error){
                return res.status(500).json({
                    error: error
                })
            }
        }
]

exports.resetPasswordFormValidation = [
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/\d/).withMessage('Password must contain at least one number'),
    body('confirmPassword')
        .notEmpty().withMessage('Confirm password is required'),
    function (req, res, next) {
        const errors = validationResult(req);
        if(!errors.isEmpty()){                
            return res.status(401).json({
                message: errors.array()[0].msg,
                status: 401
            })
        }
        const { user, password, confirmPassword } = req.body;
        if (password !== confirmPassword){
            return res.status(401).json({
                message: "Password doesn't match",
                status: 401
            })
        }
        if(!user || user === ''){
            return res.status(401).json({
                message: "Invalide info",
                status: 401
            })
        }
        next();
    }
]