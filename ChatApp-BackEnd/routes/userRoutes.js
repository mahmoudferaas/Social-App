const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const AuthHelper = require('../Helpers/AuthHelper');

router.get('/users' ,AuthHelper.VerifyToken , userCtrl.GetAllUsers);
router.get('/user/:id' ,AuthHelper.VerifyToken , userCtrl.GetUser);
router.get('/users/:username' ,AuthHelper.VerifyToken , userCtrl.GetUserByName);
router.post('/user/view-profile' ,AuthHelper.VerifyToken , userCtrl.ViewProfile);
router.post('/change-password' ,AuthHelper.VerifyToken , userCtrl.ChangePassword);

module.exports = router;