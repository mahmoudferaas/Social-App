const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/posts');
const AuthHelper = require('../Helpers/AuthHelper');

router.post('/post/add-post' ,AuthHelper.VerifyToken , postCtrl.addPost);
router.post('/post/add-like' ,AuthHelper.VerifyToken , postCtrl.addLike);
router.post('/post/add-comment' ,AuthHelper.VerifyToken , postCtrl.AddComment);


router.get('/posts' ,AuthHelper.VerifyToken , postCtrl.GetAllPosts);
router.get('/post/:id', AuthHelper.VerifyToken , postCtrl.GetPost);

module.exports = router;