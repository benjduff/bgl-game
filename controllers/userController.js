const game = require('../models/game');
const express = require('express');
const moment = require('moment');
const user = require('../models/user');

exports.registerUser = function(req, res, next){
    const newUser = new user = {
        username: req.body.username,
        password: req.body.password
    }

    user.addNewUser(newUser, (err, user) => {
        if(err){
            req.session.errResMsg = "Oops, there was an error registering the user, please contact the site administrator.";
            res.redirect('/signup');
        }

    })


}