const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-Parser');
const cors = require('cors');
//const logger = require('morgan');

const app = express();
app.use(cors());

const dbConfig = require('./config/secret');
var http = require('http').Server(app);
var io = require('socket.io')(http);

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

require('./socket/streams')(io);

const auth = require('./routes/authRoutes');
const posts = require('./routes/postRoutes');
const users = require('./routes/userRoutes');
const friends = require('./routes/friendsRoutes');
const images = require('./routes/imageRoutes');

app.use('/api/chatApp' , auth);
app.use('/api/chatApp' , posts);
app.use('/api/chatApp' , users);
app.use('/api/chatApp' , friends);
app.use('/api/chatApp' , images);

http.listen(3000 ,() => {
    console.log('running on 3000');
    //console.log('running on 3000');
})