const game = require('../models/game');
const config = require('../config/database');
const user = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//registering a new user
exports.registerUser = function(req, res){
    //create new user object, get username and pass from request body
    var newUser = new user({
        username: req.body.username,
        password: req.body.password
    });

    //before adding the new user, check to see if the username already exists, return err if true
    user.validateUsername(newUser.username, (err, result) => {
        if(err) throw err;
        //check if document returned any usernames in an array if so then username already exists
        if(result.length >= 1){
            res.status(409).json({msg: "User already exists"});
        } else {
            //username doesnt exist so we can add new user to users collection
            user.addNewUser(newUser, (err, user) => {
                if(err){
                    res.status(500).json({error: err});
                //  res.redirect('/signup'); in future
                } else {
                    res.status(201).json({msg:"User created successfully", userId: user._id});
                    //res.redirect('/login'); 
                }
            });
        }
    });
}

//Authenticate user
exports.authenticate = function(req, res, next){
    // find user by their username 
    user.findUserByUsername(req.body.username, (err, foundUser) => {
        if(err) res.status(500).json({error: err});
        //if the user is found compare password with bcrypt
        if(foundUser){
            bcrypt.compare(req.body.password, foundUser.password, (err, result) => {
                if (err) res.status(401).json({ msg: "Authentication failed" });
                //if password matches create a new json web token
                if (result) {
                    const token = jwt.sign({
                        username: foundUser.username,
                        userId: foundUser._id,
                        userBglAverage: foundUser.bglAverage
                    },
                    config.JWT_KEY,
                    {
                        expiresIn: "1hr"
                    });
                    res.status(200).json({ msg: "Authentication successful", authToken: token });
                } else {
                    res.status(401).json({msg: "Authentication failed"});  
                }
            }); 
        }
    });
}

//delete user from database
exports.deleteUser = function(req, res, next){
    user.deleteUserFromDb(req.params.userId, (err) => {
        if(err) throw err;
        if(!err) res.redirect('/login');
    })
}

//add log to users document
exports.addNewLog = function(req, res, next){
    //const newLog = res.locals.newLog;
    user.addLog(req.body.userId, req.body.newLog, (err, updatedUser) => {
        if(err) throw err;
        if(updatedUser === null){
            res.status(404).json({msg:"The user was not found"});
        } else {
            //res.status(200).json({msg:"User log was added successfully!"});
            next();
        }
    })
}

exports.redirectToHome = function(req, res){
    res.redirect('/');
}

