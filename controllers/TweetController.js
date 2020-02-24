const expresss = require('express');
var router = expresss.Router();
const mongoose = require('mongoose');
const tweet = mongoose.model('tweets');
const user =  mongoose.model('users');

router.get('/', (req,res)=>{
    res.render("user/tweetuserLogin",{
        viewTitle: "User Login"
    });
});


router.post('/list', (req,res)=>{
    tweet.find((err,docs)=>{
        if(!err){
            let data = docs.map(doc => {
            return {
                username: doc.username,
                Tweet: doc.Tweet,
                Date: doc.Date,
                Hashtags: doc.Hashtags
            }
            });
            console.log(data);
            // res.render('user/tweetsList',{
            //     viewTitle: "Tweets List",
            //     ListofTweets: data

            // })
            res.send(data);
            res.end();
        }
    })
});

router.get('/list', (req,res)=>{
    tweet.find((err,docs)=>{
        if(!err){
            let data = docs.map(doc => {
            return {
                username: doc.username,
                Tweet: doc.Tweet,
                Date: doc.Date,
                Hashtags: doc.Hashtags
            }
            });
            console.log(data);
            // res.render('user/tweetsList',{
            //     viewTitle: "Tweets List",
            //     ListofTweets: data

            // })
            res.send(data);
            res.end();
        }
    })
});

router.post('/AET', (req,res)=>{
    if(req.body._id == '')
    insertTweetRecord(req,res);
    else
    updateTweetRecord(req,res);
});

router.get('/AET', (req,res)=>{
    res.render("user/AddorEditTweet",{
        viewTitle: "Add a new Tweet"
    });
});

router.post('/', (req,res)=>{
    login(req,res);
});

function login(req,res) {
  var query = {email : req.body.email, password : req.body.password}
  user.findOne(query, (err,doc) => {
      console.log('quert',query)
      if(!err){
        console.log(doc)
        let result = {
                email: doc.email,
                pwd: doc.password
            };
        console.log('result',result)
          if(result.pwd == req.body.password)
          {
                 
              console.log("Succesfull Login");
              console.log(result);
              res.render('user/tweetsList', {
                  viewTitle: "Tweets List",
                  ListofTweets: [{Tweet: "Hello World",Date: "19/02/2020",Hashtags: ['hello','firstTweet']}]
              });
          }
          else{
            //   handleLoginError("",body)
          }
      }
      else{
        console.log(query)
          handleLoginError(err,res);
      }
  })
}

function handleLoginError(err,res){
    if(err == null){ 
        res.render('user/tweetuserLogin', {
            viewTitle: "Login UnSuccesfull"
        });
          console.log("Err while selecting", err);  
    }

}

function insertTweetRecord(req,res) {
    var newTweet = new tweet();
    newTweet.username = req.body.username;
    newTweet.Tweet = req.body.Tweet;
    newTweet.Date = req.body.Date;
    newTweet.Hashtags = [req.body.Hashtags];
    console.log('newTweet',newTweet);
    newTweet.save((err,doc)=>{
        if(!err){
            console.log('in here');
            res.redirect('AET');
   
        }
        else
        {
            if(err.name == 'ValidationError' ) {
                console.log('err',err)
                handleValidationError(err , req.body);
                res.render("user/AddorEditTweet",{
                   viewTitle: "Adding tweet failed add once again",
                   ListofTweets: [{Tweet: "Hello World",Date: "19/02/2020",Hashtags: ['hello','firstTweet']}]
               });
            }
            else
            console.log('Error during record insertion', err);
        }
    });
}

function handleValidationError(err,body) {
    for(field in err.errors){
        switch (err.errors[field].path) {
            case 'username':
                body['usernameError'] = err.errors[field].message;
                break;
           case 'Tweet':
                body['TweetError'] = err.errors[field].message;
                break; 
           case 'Date':
               body['DateError'] = err.errors[field].message;
               break;
           case 'Hashtags':
               body['HashtagsError'] = err.errors[field].message;
               break;
        }
    }
   
   }
module.exports = router;