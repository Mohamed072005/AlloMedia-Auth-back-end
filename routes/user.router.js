const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { requestResetPasswordValidation, resetPasswordFormValidation } = require('../validations/reset.password.validation')

router.post('/ask/reset/password', requestResetPasswordValidation, userController.sendEmailForResertPassword);
router.get('/to/reset/password', userController.confirmeResetPassword);
router.post('/reset/password', resetPasswordFormValidation, userController.resetPassword);

module.exports = router;