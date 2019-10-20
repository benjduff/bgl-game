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
    const newPlayer = {
        username: res.locals.userData.username,
        userId: res.locals.userData.userId,
        userLogs: [],
        userPoints: 0,
        userBglAverage:res.locals.userData.userBglAverage
    }

    //check if user is already in game before adding them
    game.checkUserInGame(newPlayer.userId, (err, existingUserArr) => {
        if(err) throw err;
        if(existingUserArr.length >= 1){
            res.status(409).json({msg: "User already joined this game."});
        } else {
            //user isn't in the game yet, so lets add them to the games leaderboard array
            game.addUserToLeaderboard(newPlayer, (err, updatedGame) => {
                if(err) throw err;
                if (!game) {
                    res.status(404).json({msg:"The game was not found."});
                } else {
                    res.status(200).json({game: updatedGame});
                } 
            });
        }
    });
}

