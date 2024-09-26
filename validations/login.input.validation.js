const { body, validationResult } = require('express-validator');

exports.loginValidation = [
    body('identifier')
        .trim()
        .notEmpty()
        .withMessage('Login identifier is required')
        .custom(value => {
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            const isPhoneNumber = /^\+?[1-9]\d{1,14}$/.test(value);
            const isUserName = /^[a-zA-Z0-9_]+$/.test(value)

            if(!isEmail && !isPhoneNumber && !isUserName) {
                throw new Error('INvalide identifiant');
            }
            return true;
        }),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
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