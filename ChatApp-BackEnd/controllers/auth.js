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
                    expiresIn:"1h"
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
    },






    async  LoginUser(req , res)
    {
        if(!req.body.username || !req.body.password)
        {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({message : " No Empty Feild Allowed"});
        }

        await User.findOne({username : Helper.firstUpper(req.body.username)})
                    .then(user =>{
                        if(!user)
                        {
                            return res.status(HttpStatus.NOT_FOUND)
                             .json({message : "UserName Not Found"});
                        }

                        return bcrypt.compare(req.body.password , user.password).then(result =>{
                            if(!result)
                            {
                                return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .json({message : "Password Not Correct"});
                            }

                            const token = jwt.sign({data:user} , dbConfig.secret,{expiresIn:"1h"});
                            res.cookie('auth' , token);
                            return res.status(HttpStatus.OK)
                            .json({message : "Log in Successfully" , user , token});
                        })

                    }).catch(err =>{
                        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .json({message : "SERVER_ERROR" });
                    })

    }






}