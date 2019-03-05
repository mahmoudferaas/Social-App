const Joi = require('joi');

const HttpStatus = require('http-status-codes');
const User = require('../models/userModels');
const Helper = require('../Helpers/helper');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbConfig = require('../config/secret');

module.exports = {
    async  CreateUser(req , res)
    {
        const schema = Joi.object().keys({
            username: Joi.string().min(5).max(10).required(),
            password: Joi.string().min(5).required(),
            email: Joi.string().email({ minDomainAtoms: 2 })
        });

        const { error , value} = Joi.validate(req.body , schema);
        console.log(value);

        if(error  && error.details)
        {
            return res.status(HttpStatus.BAD_REQUEST).json({msg : error.details})
        }
        
        const userEmail = await User.findOne( { email : Helper.lowerCase(req.body.email) });
        if(userEmail)
        {
            return res.status(HttpStatus.CONFLICT)
            .json({message : 'This Email Already Exist'})
        }

        const userName = await User.findOne( { username : Helper.firstUpper(req.body.username) });
        if(userName)
        {
            return res.status(HttpStatus.CONFLICT)
            .json({message : 'This userName Already Exist'})
        }

        return bcrypt.hash(value.password ,10 , (err , hash) =>{
            if(err)
            {
                return res.status(HttpStatus.BAD_REQUEST)
                .json({message : 'Error in Hash Password'})
            }

            const body = {
                username : Helper.firstUpper(value.username),
                email : Helper.lowerCase(value.email),
                password : hash,
            }
            User.create(body).then((user)=>{
                const token = jwt.sign( { data : user} ,dbConfig.secret ,{
                    expiresIn:120
                } );
                res.cookie('auth' , token);
                 res
                 .status(HttpStatus.CREATED)
                 .json({message : 'User Created successfully' , user , token});
            }).catch( (err) =>{
                res
                 .status(HttpStatus.INTERNAL_SERVER_ERROR)
                 .json({message : 'ERROR' });
            });
        });
    
    }
}