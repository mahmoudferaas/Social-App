const Joi = require('joi');

const HttpStatus = require('http-status-codes');
const User = require('../models/userModels');
const Helper = require('../Helpers/helper');
const Post = require('../models/postModels');
const jwt = require('jsonwebtoken');
const dbConfig = require('../config/secret');

module.exports = {

    async addPost(req , res)
    {
        const schema = Joi.object().keys({
            post: Joi.string().required(),
        });

        const { error , value} = Joi.validate(req.body , schema);
        if(error  && error.details)
        {
            return res.status(HttpStatus.BAD_REQUEST).json({msg : error.details})
        }

        const body = {
            user : req.user._id,
            username : req.user.username,
            post : req.body.post,
            created : new Date()
        }

        Post.create(body).then(
           async post => { 
               await User.update(
                   {_id : req.user._id },
                   {
                       $push :{
                        posts : {
                            postId:post._id,
                            post : req.body.post,
                            created : new Date()
                        }
                       }
                       
                   }
               );
               res.status(HttpStatus.OK).json({ message:"post created" , post})  }
        ).catch(err => {
            res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({message : 'ERROR' });
        })
    },

    async GetAllPosts(req , res){

        try {
            const posts = await Post.find({}).populate('user').sort({ created : -1 });
            res
            .status(HttpStatus.OK)
            .json({message : 'All Posts' , posts });
        }catch(err){
            res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({message : 'ERROR' });
        }
    },

    async GetPost(req , res){
        console.log( req.params.id )
            await Post.findOne({_id : req.params.id})
            .populate('user')
            .populate('comments.userId').then( (post) => {
                res
            .status(HttpStatus.OK)
            .json({message : 'Post found' , post });
            }).catch(err => {
                res
            .status(HttpStatus.NOT_FOUND)
            .json({message : 'post not found' , post });
            })
    },


    async addLike(req , res){
        debugger
        const postID = req.body._id;
        await Post.update({
            _id : postID,
            'likes.username' : { $ne : req.user.username }
        },{
            $push : {
                likes :{
                username : req.user.username
                }
            },
            $inc :{
                totalLikes : 1
            }
        }
        ).then( ()=> {
            res.status(HttpStatus.OK)
            .json({message : 'you liked post' })
        }).catch(err => {
            res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({message : 'ERROR' });
        })
    },

    async AddComment(req , res){
        const postID = req.body.postId;
        await Post.update(
            {
                _id: postID
            },{
            $push : {
                comments :{
                userId : req.user._id,
                username : req.user.username,
                comment : req.body.comment,
                createdAt : new Date()
                }
            }
        }
        ).then( ()=> {
            res.status(HttpStatus.OK)
            .json({message : 'Comment Added' })
        }).catch(err => {
            res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({message : 'ERROR' });
        })
    }

}