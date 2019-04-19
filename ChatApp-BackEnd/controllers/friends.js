const HttpStatus = require('http-status-codes');
const User = require('../models/userModels');


module.exports ={
    FollowUser (req , res ){
        const followUser = async () =>{
            await User.update({
                _id:req.user._id,
                "following.userFollowed" : { $ne : req.body.userFollowed}
            } , {
                $push :{
                    following : {
                        userFollowed : req.body.userFollowed
                    }
                }
            })


            await User.update({
                _id:req.body.userFollowed,
                "following.follower" : { $ne : req.user._id}
            } , {
                $push :{
                    followers : {
                        follower : req.user._id
                    },
                    notifications : {
                        senderId : req.user._id,
                        message : `${req.user.username} is now following you.`,
                        viewProfile : false,
                        created : new Date()
                    }
                }
            })

        };

        followUser()
        .then( () => {
            res.status(HttpStatus.OK).json({ message : " Following User Now"});
        })
        .catch (err => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message : " Error"});

        })
    },


    UnFollowUser (req , res ){
        const unFollowUser = async () =>{
            await User.update({
                _id:req.user._id
            } , {
                $pull :{
                    following : {
                        userFollowed : req.body.userFollowed
                    }
                }
            })
            await User.update({
                _id:req.body.userFollowed
            } , {
                $pull :{
                    followers : {
                        follower : req.user._id
                    }
                }
            })
        };
        unFollowUser()
        .then( () => {
            res.status(HttpStatus.OK).json({ message : " UnFollow User Now"});
        })
        .catch (err => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message : " Error"});

        })
    },

   async MarkNotification(req,res){
       if(!req.body.isDelete)
       {
        await User.updateOne({
            _id:req.user._id,
            "notifications._id" : req.params.id
        } , 
        {
            $set : {'notifications.$.read' : true}
        })
        .then( () => {
            res.status(HttpStatus.OK).json({ message : " Mark As Read "});
        })
        .catch (err => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message : " Error"});

        })
       }

    }

}