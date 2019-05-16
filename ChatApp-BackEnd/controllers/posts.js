const Joi = require('joi');
const HttpStatus = require('http-status-codes');
const User = require('../models/userModels');
const Post = require('../models/postModels');
const request = require('request');
const cloudinary = require('cloudinary');
cloudinary.config({ 
    cloud_name: '', 
    api_key: '', 
    api_secret: '' 
  });

module.exports = {

    async addPost(req , res)
    {
        const schema = Joi.object().keys({
            post: Joi.string().required(),
        });
        const mybody = {
            post : req.body.post
        } 

        const { error } = Joi.validate(mybody , schema);

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

        if(req.body.post && !req.body.image){
            debugger
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
        }

        if(req.body.post && req.body.image){
            debugger
            cloudinary.uploader.upload(req.body.image , async (result) => {
                const reqBody = {
                    user : req.user._id,
                    username : req.user.username,
                    post : req.body.post,
                    imgVersion : result.version,
                    imgId : result.public_id,
                    created : new Date()
                }

                Post.create(reqBody).then(
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
            })

        }

        
    },

    async GetAllPosts(req , res){

        try {
            const posts = await Post.find({}).populate('user').sort({ created : -1 });
            const top = await Post.find({totalLikes: {$gte : 2}}).populate('user').sort({ created : -1 });
            const user = await User.findOne({_id : req.user._id});
            if(!user.city && !user.country){
                request('https://geoip-db.com/json/' , { json : true} , async (err , res , body) =>{
                    //console.log(body);
                    await User.update({_id : req.user._id},
                        {
                            city : body.city,
                            country : body.country_name
                        })
                })
            }
            res
            .status(HttpStatus.OK)
            .json({message : 'All Posts' , posts ,top});
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