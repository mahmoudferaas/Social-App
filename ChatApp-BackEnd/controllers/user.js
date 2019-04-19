const Joi = require('joi');

const HttpStatus = require('http-status-codes');
const User = require('../models/userModels');

module.exports = {
  async  GetAllUsers(req , res){
    //console.log(req.headers.authorization)      
      await User.find({})
            .populate('posts.postId')
            .populate('following.userFollowed')
            .populate('followers.follower')
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
              .then((result) => {
                  res.status(HttpStatus.OK).json({ message : "User By ID" , result})
              }).catch(err => {
                  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message : "Error From All users" })
              })
      },


      
    async  GetUserByName(req , res){
      //console.log(req.headers.authorization)      
        await User.findOne({_id : req.params.username})
              .populate('posts.postId')
              .populate('following.userFollowed')
              .populate('followers.follower')
              .then((result) => {
                  res.status(HttpStatus.OK).json({ message : "User By userName" , result})
              }).catch(err => {
                  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message : "Error F" })
              })
      }


}