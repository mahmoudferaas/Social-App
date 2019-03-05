const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-Parser');
const cors = require('cors');
//const logger = require('morgan');

const app = express();
app.use(cors());

const dbConfig = require('./config/secret');

app.use((req , res , next) => {
    res.header('Access-Control-Allow-Origin' , '*');
    res.header('Access-Control-Allow-Credentials' , 'true');
    res.header('Access-Control-Allow-Methods' , 'GET','POST', 'PUT','DELETE','OPTIONS');
    res.header('Access-Control-Allow-Heafers' , 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});


app.use(express.json({limit : '50mb'}));
app.use(express.urlencoded({ extended:true , limit : '50mb'}));

app.use(cookieParser());
//app.use(logger('dev'));

mongoose.Promise = global.Promise;
mongoose.connect( dbConfig.url ,  { useNewUrlParser: true });

const auth = require('./routes/authRoutes');
app.use('/api/chatApp' , auth);

app.listen(3000 ,() => {
    console.log('running on 3000');
    //console.log('running on 3000');
})