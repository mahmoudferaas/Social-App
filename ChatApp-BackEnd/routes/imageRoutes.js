const express = require('express');
const router = express.Router();

const ImagesCtrl = require('../controllers/images');
const AuthHelper = require('../Helpers/AuthHelper');

router.post('/upload-image' ,AuthHelper.VerifyToken , ImagesCtrl.UploadImage);
router.get('/set-default-image/:imageId/:imageVersion' ,AuthHelper.VerifyToken , ImagesCtrl.SetDefaultImage);

module.exports = router;