const express = require('express')
const authController = require('../controllers/auth.controller');
const { registerValidation } = require('../validations/register.input.validation')
const { loginValidation } = require('../validations/login.input.validation');
const router = express.Router();

router.post('/register', registerValidation, authController.register);
router.get('/users', authController.getUsers);
router.get('/verify/account', authController.checkEmailConfirmed);
router.post('/login', loginValidation, authController.login);
router.post('/verify/login', authController.virefyOTPCode);
router.post('/resent/otp/code', authController.resendOTPCode);


module.exports = router;