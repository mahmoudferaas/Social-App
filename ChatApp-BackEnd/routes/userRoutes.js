const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const AuthHelper = require('../Helpers/AuthHelper');

router.get('/users' ,AuthHelper.VerifyToken , userCtrl.GetAllUsers);
router.get('/user/:id' ,AuthHelper.VerifyToken , userCtrl.GetUser);
router.get('/user/:username' ,AuthHelper.VerifyToken , userCtrl.GetUserByName);

module.exports = router;