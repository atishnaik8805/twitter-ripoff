require('./models/db');

const express = require('express');
const cors = require('cors');
const path = require('path');
const  exphbs = require('express-handlebars');
const bodyparser = require('body-parser');
require("dotenv").config()
const userController = require('./controllers/userController');
const TweetController = require('./controllers/TweetController');

const port = process.env.PORT || 3007
var app = express();
app.use(cors({
    origin: 'http://localhost:3007'
}));
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, "twitter-client", "build")))

// ...
// Right before your app.listen(), add this:
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "twitter-client", "build", "index.html"));
});

app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs',exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');


app.listen(port, ()=> {
    console.log('Express server started at port: '+port);
})

app.use('/user', userController);
app.use('/tweet', TweetController);