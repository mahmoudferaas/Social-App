const moment = require('moment');
const joi = require('joi');
const bcrypt = require('bcryptjs');
const HttpStatus = require('http-status-codes');
const User = require('../models/userModels');

module.exports = {
  async  GetAllUsers(req , res){
    //console.log(req.headers.authorization)      
      await User.find({})
            .populate('posts.postId')
            .populate('following.userFollowed')
            .populate('followers.follower')
            .populate('notifications.senderId')
            .then((result) => {
                res.status(HttpStatus.OK).json({ message : "All users" , result})
            }).catch(err => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message : "Error From All users" })
            })
    },

    async  GetUser(req , res){
      //console.log(req.headers.authorization)    
        await User.findOne({_id : req.params.id})
              .populate('posts.postId')
              .populate('following.userFollowed')
              .populate('followers.follower')
              .populate('notifications.senderId')
              .then((result) => {
                  res.status(HttpStatus.OK).json({ message : "User By ID" , result})
              }).catch(err => {
                  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message : "Error From All users" })
              })
      },


      
    async  GetUserByName(req , res){
      // console.log("ay 7aga")    
      // console.log(req.params.username  )
        await User.findOne({username : req.params.username})
              .populate('posts.postId')
              .populate('following.userFollowed')
              .populate('followers.follower')
              .populate('notifications.senderId')
              .then((result) => {
                  res.status(HttpStatus.OK).json({ message : "User By userName" , result})
              }).catch(err => {
                  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message : "Error F" })
              })
      },
    async  ViewProfile(req , res){
      const dateValue = moment().format('YYYY-MM-DD');
        await User.update({
          _id : req.body.id,
          'notifications.date' : {$ne : dateValue}
        } , {
          $push :{
            notifications : {
              senderId : req.user._id,
              message : `${req.user.username} viewed your profile`,
              created : new Date(),
              date : dateValue,
              viewProfile : true
            }
          }
        }).then((result) => {
          res.status(HttpStatus.OK).json({ message : "Notifaction Send" , result})
      }).catch(err => {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message : "Error Notifaction" })
      })
      },

  async ChangePassword(req , res){
    console.log(req.body);
    const schema = joi.object().keys({
      cpassword : joi.string().min(5).required(),
      newPassword : joi.string().required(),
      confirmPassword : joi.string().optional()
    });

    const { error , value } = joi.validate(req.body , schema) ;
    if( error && error.details){
      return res.status(HttpStatus.BAD_REQUEST).json({ message : error.details })
    }

    const user = await User.findOne({_id : req.user._id});
    return bcrypt.compare(value.cpassword , user.password).then( async (result) => {
      if(!result){
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message : "current password not valid" })
      }

      const newPassword = await User.EncryptPassword(req.body.newPassword);
      await User.update({
        _id : req.user._id
      } , {
        password : newPassword
      }).then((result) => {
        res.status(HttpStatus.OK).json({ message : "password changed" , result})
    }).catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message : "Error password" })
    })
    })
  }


}