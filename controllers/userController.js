const expresss = require('express');
var router = expresss.Router();
const mongoose = require('mongoose');
const user = mongoose.model('users');

router.get('/', (req,res)=>{
    res.render("user/addOrEdit",{
        viewTitle: "Insert User"
    });
});

router.post('/', (req,res)=>{
    if(req.body._id == '')
    insertUserRecord(req,res);
    else
    updateRecord(req,res);
});

function insertUserRecord(req,res) {
 var newUser = new user();
 newUser.fullName = req.body.fullName;
 newUser.email = req.body.email;
 newUser.username = req.body.username;
 newUser.password = req.body.password;
 newUser.city = req.body.city;
 newUser.save((err,doc)=>{
     if(!err){
         console.log('in here');
         res.redirect('user/list');

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