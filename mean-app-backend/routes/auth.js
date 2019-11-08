const express = require("express");
const router = express.Router();
const authController = require('../controllers/auth.js');



router.post('', authController.createUser);


router.get('/unique/:email', authController.isEmailUnique);


router.post('/login', authController.login);

module.exports = router;
