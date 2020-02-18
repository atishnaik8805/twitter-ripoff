const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/TwitterDB', {useNewUrlParser:true} , (err) => {
    if(!err){
     console.log('MongoDB Connection Succesfull')
    }
    else {
        console.log('Error in connection:'+err);
    }
});

require('./user.model');