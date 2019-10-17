const game = require('../models/game');
const user = require('../models/user');
const express = require('express');
const moment = require('moment');

//create a game --dev only
exports.createGame = function(req, res){
    const endTime = moment().add(14, 'days');
    const newGame = new game ({
        endTime: endTime
    });

    game.createGame(newGame, (err, game) => {
        if(err) throw err;
        if(!game){
            res.json({success: false, msg:"There was an error creating the game"});
        } else {
            res.json({success: true, game: game});
        }
    })
}

//get game
exports.findGame = function(req, res){
    game.findGame((err, foundGame) => {
        if(err) throw err;
        if (foundGame) {
            res.json({success: true, game: foundGame});
        }
    });
}

//add user to game
exports.addUser = function(req, res, next){

    game.addUser(newUser, (err, updatedGame) => {
        if(err) throw err;
        if (!game) {
            res.json({success: false, msg:"There was a problem retrieving the game."});
        } else {
            res.json({success: true, game: updatedGame});
        }
    })
}

