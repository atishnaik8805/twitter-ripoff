const mongoose = require('mongoose');

var db_instance = null
mongoose.connect('mongodb://localhost:27017/TwitterDB', {useNewUrlParser:true} , (err,db) => {
    if(!err){
     console.log('MongoDB Connection Succesfull');
    }
    else {
        console.log('Error in connection:'+err);
    }
});

require('./user.model');
require('./tweets.model');