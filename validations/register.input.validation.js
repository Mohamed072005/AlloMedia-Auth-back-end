const { body, validationResult }  = require('express-validator');

exports.registerValidation = [
    body('full_name')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 3 }).withMessage('Full name must be at least 3 characters long'),

    body('user_name')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isAlphanumeric().withMessage('Username must contain only letters and numbers')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/\d/).withMessage('Password must contain at least one number'),

    body('phone_number')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Phone number must be in a valid international format'),

    body('country')
        .trim()
        .notEmpty().withMessage('Country is required'),

    body('city')
        .trim()
        .notEmpty().withMessage('City is required'),

    body('address')
        .trim()
        .notEmpty().withMessage('Address is required'),
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
];
