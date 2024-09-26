const express = require('express')
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { registerValidation } = require('../validations/register.input.validation')
const { loginValidation } = require('../validations/login.input.validation')

router.post('/register', registerValidation, authController.register);
router.get('/users', authController.getUsers);
router.get('/verify/account', authController.checkEmailConfirmed);
router.post('/login', loginValidation, authController.login);

module.exports = router;