const game = require('../models/game');
const log = require('../models/log');
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

//delete user from game --DEV ONLY
exports.removeUser = function(req, res, next){
    game.deleteUser(req.params.userId, (err) => {
        if(err) {
            throw err;
        } else {
            res.status(200).json({msg:"User was successfully removed from the game."});
        }
    })
}

//update game logs when user adds a log
exports.updateLogs = function(req, res, next){
    //new log obj
    const gameId = req.body.gameId;
    const newLog = new log({
        userId: res.locals.userData.userId,
        username: res.locals.userData.username,
        bgl: req.body.bgl,
        date: moment().format('LLLL')
    });

    //update the game logs and if successful move on to updateLeaderboard
    game.updateLogs(gameId, newLog, (err, updatedGame) => {
        if(err){
            throw err;
        } else {
            res.locals.currentGame = updatedGame;
            next()    
        }
    })
}

//update leaderboard after user adds a new log
exports.updateLeaderboard = function(req, res, next){

    let totalPoints = 0;
    //find how many logs the user has submitted
    game.getTotalLogs(res.locals.currentGame._id, res.locals.userData.userId, (err, userLogs) => {
        if(err) res.status(400).json({msg: "Bad Request: Use appropriate game/user id"});
        //Add 5 points for each log the user has submitted
        userLogs.forEach(player => {
            if(player._id === res.locals.userData.userId){
                totalPoints = player.logs * 5;
            }
        });
        //update the users leaderboard score with their total points
        game.updateLeaderboard(res.locals.userData.userId, totalPoints, (err, updatedGame) => {
            if(err) throw err;
            if(updatedGame){
                res.status(200).json({msg: "The game has been updated"});
            } else {
                res.status(404).json({msg: "The leaderboard could not be updated."});
            }
        })
    })
}

exports.calcAvBgl = function(req, res, next){
    game.getUserBgls(req.params.userId, (err, userLogs) => {
        if(err) throw err;
        if(userLogs === null){
            res.status(404).json({msg: "User does not have any logs."});
        } else {
            let total = 0;
            let bglArr = userLogs[0].bgls;
            //calculate average bgl and return 
            for (let i = 0; i < bglArr.length; i++) {
                total += bglArr[i];
            }
            let avg = total / bglArr.length;
            avg = Math.round(avg * 100) / 100;

            res.status(200).json({avgBgl: avg});
        }
    })
}

//DEV ONLY -- For testing getTotalLogs (find how many logs a user has in the game).
exports.getTotalLogs = function(req, res, next){
    game.getTotalLogs(req.body.gameId, req.params.userId, (err, logs) => {
        if(err) throw err;
        if (logs) {
            res.json({userLogs: logs});
        }
    })
}



