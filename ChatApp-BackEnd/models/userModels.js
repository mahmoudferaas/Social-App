const mongoose = require('mongoose');
 const userSchema = mongoose.Schema({
     username : {type : String},
     email : {type : String},
     password : {type : String},
     posts : [{
         postId : { type : mongoose.Schema.ObjectId , ref : 'Post'},
         post : { type : String},
         created : { type : Date , default : new Date()}
     }],
     following : [
         { userFollowed : { type : mongoose.Schema.ObjectId , ref : 'User' }}
     ],
     followers : [
        { follower : { type : mongoose.Schema.ObjectId , ref : 'User' }}
    ],
    notifications :[
        {
            senderId :{ type : mongoose.Schema.ObjectId , ref : 'User' },
            message : {type : String},
            viewProfile : {type : Boolean , default:false},
            created : {type : Date , default:Date.now()},
            read : {type : Boolean , default:false},
            date : {type : String , default:''},

        }
    ]
 })

 module.exports = mongoose.model('User' , userSchema);