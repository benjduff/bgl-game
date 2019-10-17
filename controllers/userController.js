const game = require('../models/game');
const express = require('express');
const moment = require('moment');
const user = require('../models/user');

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
                //  res.redirect('/signup') in future
                } else {
                    res.status(201).json({msg:"User created successfully", userId: user._id});
                }
            });
        }
    });
}

//delete user from database
exports.deleteUser = function(req, res, next){
    user.deleteUserFromDb(req.params.userId, (err) => {
        if(err) throw err;
        if(!err) res.status(200).json({msg: "User deleted"});
    })
}

