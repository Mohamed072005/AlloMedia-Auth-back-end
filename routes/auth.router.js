const express = require('express')
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.get('/users', authController.getUsers);

module.exports = router;