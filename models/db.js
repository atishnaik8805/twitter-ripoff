const mongoose = require('mongoose');

var db_instance = null
const DB = process.env.MONGODB_URI || 'mongodb://localhost:27017/TwitterDB';
mongoose.connect(DB, {useNewUrlParser:true} , (err,db) => {
    if(!err){
     console.log('MongoDB Connection Succesfull');
    }
    else {
        console.log('Error in connection:'+err);
    }
});

require('./user.model');
require('./tweets.model');