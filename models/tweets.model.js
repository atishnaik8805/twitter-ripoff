const mongoose = require('mongoose');
var TweetsSchema = new mongoose.Schema({
    username: {
        type: String,
        required: 'This is required'
    },
    Tweet: {
        type: String,
        required: 'this is required'
    },
    Date: {
        type: Date,
        required: 'this is required'
    },
    Hashtags: {
        type: Array,
        required: 'this is required'
    }
});

mongoose.model('tweets', TweetsSchema);