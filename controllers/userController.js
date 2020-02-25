const expresss = require('express');
var router = expresss.Router();
const mongoose = require('mongoose');
const user = mongoose.model('users');
const http = require('http');
const jwt = require('jsonwebtoken');
const tweet = mongoose.model('tweets');
const secretKey = process.env.SECRET || 'secretKey'
const isEmpty = (string) => {
    if (string.trim() === '') return true;
    else return false;
  };

const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) return true;
    else return false;
};

router.get('/', (req,res)=>{
    res.render("user/addOrEdit",{
        viewTitle: "Insert User"
    });
});

router.post('/login', (req,res)=>{
    //req.body = req.query
    login(req,res);
});

router.post('/register', (req,res)=>{
    //req.body = req.query
    console.log(req.body)
    console.log(req.query)
    if(!req.body._id)
    insertUserRecord(req,res);
    else
    updateRecord(req,res);
});

function login(req,res) {
    var query = {email : req.body.email, password : req.body.password}
    var Verr = handleValidation(query, res);
    if (Verr) {
        user.findOne(query, (err,doc) => {
            console.log('doc', doc);
            if(!err && doc){
              console.log(doc)
              let result = {
                      email: doc.email,
                      pwd: doc.password,
                      date: Date.now()
                  };
                if(result.pwd == req.body.password)
                {
                    // res.render('user/tweetsList', {
                    //     viewTitle: "Tweets List",
                    //     ListofTweets: [{Tweet: "Hello World",Date: "19/02/2020",Hashtags: ['hello','firstTweet']}]
                    // });
                    //res.writeHead(200, {"Content-Type": "application/json"});
                    var token = jwt.sign({data: result}, secretKey);
                    res.send({login:"Sucess", token: token});
                }
                
            }
            else{
                console.log('in');
                handleLoginError(err,res);
            }
        })
    }
  }


function VerifyToken(req,res,next) {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader != 'undefined') {
       const bearer = bearerHeader.split(' ');
       const bearertoken = bearer[1];
       req.token = bearertoken;
       next();
    }
    else {
        res.sendStatus(403);
    }
}

function handleLoginError(err, res)
{
  return res.status(403).json({errResponse:{general: "Wrong Credentials"}});  
}

function handleValidation(query, res) {
    if (query.email) {
        emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(query.email)) {
            // res.send({emailerror: "Invalid format of Email"});
            res.status(403).json({errResponse: {email: "Invalid format of Email"}});
        }
        return emailRegex.test(query.email)
    }
    else {
        res.status(403).json({errResponse: {email: "No email provided"}});
        return false
    }
}

function insertUserRecord(req,res) {
 
 var validateError = ValidateInputs(req, res)
 if (!validateError) {
    var newUser = new user();
    newUser.fullName = req.body.fullName;
    newUser.email = req.body.email;
    newUser.username = req.body.username;
    newUser.password = req.body.password;
    newUser.confirmPassword = req.body.confirmPassword;
    newUser.save((err,doc)=>{
        if(!err){
            console.log('in here');
            var newuserdata = {
                email : newUser.email,
                password: newUser.password,
                date: Date.now()
            } 
            //res.redirect('user/list');
            var token = jwt.sign({data : newuserdata}, secretKey);
            res.status(200).json({register:"Sucess", token: token});
            var newTweet = new tweet();
            newTweet.username = newUser.username;
            newTweet.Tweet = "Hello Twiiter, i am" + newUser.username
            newTweet.Date = Date.now();
            newTweet.Hashtags = ['Fisrt Tweet','Automatically'];
            newTweet.save((err,doc)=>{
            if(!err){

            }
            else {
                console.log(err)
            }
            })
        }
        else
        {
            if(err.name == 'ValidationError' ) {
                handleValidationError(err , req.body);
                res.render("user/addOrEdit",{
                   viewTitle: "Insert User",
                   user: req.body
               });
            }
            else
            console.log('Error during record insertion', err);
        }
    });
 }
} 

function ValidateInputs(req,res) {
    var errors = {}
    console.log(req.body)
    if(isEmpty(req.body.email)) {
        errors.email = "This is required"
    } else 
    if (!isEmail(req.body.email)) {
        errors.email = "Must be a valid Email"
    } 
    
    if(isEmpty(req.body.password)) {
        errors.password = "This is required"
    } 
    if(isEmpty(req.body.confirmPassword)) {
        errors.confirmPassword = "This is required"
    } 
     if(isEmpty(req.body.username)) {
        errors.username = "This is required"
    }
    if (isEmpty(req.body.fullName)) {
        errors.fullName = "This is required"
    } 
     if(!isEmpty(req.body.password) && !isEmpty(req.body.confirmPassword) && !(req.body.password.trim() == req.body.confirmPassword.trim() )) {
        errors.confirmPassword = "Password Must be similiar"
    }

    if (Object.keys(errors).length > 0) {
        res.status(400).json({errResponse : errors});
        return true
    }
    else {
        return false
    }
}
function updateRecord(req,res){
    user.findOneAndUpdate({_id: req.body._id} , req.body, {new: true}, (err,doc) => {
        if(!err) {
            res.redirect('user/list');
        }
        else{
            if(err.name == 'ValidationError' ) {
                handleValidationError(err , req.body);
                res.render("user/addOrEdit",{
                   viewTitle: "Insert User",
                   user: req.body
               });
            }
            else
            console.log('Error during record updation', err);
        }
    });
}
router.get('/list',(req,res)=>{
    user.find((err,docs)=>{
        if(!err){
            let data = docs.map(doc => {
            return {
                fullName: doc.fullName,
                username: doc.username,
                _id: doc._id,
                city: doc.city,
                email: doc.email
            }
            });
            console.log(data);
            res.render('user/list',{
                list: data
            })
        }
    })
});

function handleValidationError(err,body) {
 for(field in err.errors){
     switch (err.errors[field].path) {
         case 'username':
             body['usernameError'] = err.errors[field].message;
             break;
        case 'email':
             body['emailError'] = err.errors[field].message;
             break; 
        case 'password':
            body['passwordError'] = err.errors[field].message;
            break;
        case 'fullName':
            body['fullNameError'] = err.errors[field].message;
            break;
     }
 }

}

router.get('/:id',(req,res)=>{
 user.findById(req.params.id, (err,doc)=>{
    if(!err){
       let data = {
        fullName: doc.fullName,
        username: doc.username,
        _id: doc._id,
        city: doc.city,
        email: doc.email,
        password: doc.password
       }
        res.render("user/addOrEdit",{
            viewTitle: "Update User",
            user: data
        });
    } 
 });
});

router.get('/delete/:id',(req,res) => {
    user.findByIdAndRemove(req.params.id, (err,doc) => {
       if(!err){
        res.redirect('/user/list');
       }
       else {
        console.log('Error during record deletion', err);
       }
    });
})
module.exports = router;