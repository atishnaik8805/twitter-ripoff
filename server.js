require('./models/db');

const express = require('express');
const cors = require('cors');
const path = require('path');
const  exphbs = require('express-handlebars');
const bodyparser = require('body-parser');

const userController = require('./controllers/userController');
const TweetController = require('./controllers/TweetController');
var app = express();
app.use(cors({
    origin: 'http://localhost:3007'
}));
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());

app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs',exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');


app.listen(3000, ()=> {
    console.log('Express server started at port: 3000');
})

app.use('/user', userController);
app.use('/tweet', TweetController);