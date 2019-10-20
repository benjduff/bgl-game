const mongoose = require('mongoose');
const config = require('../config/database');

const GameSchema = mongoose.Schema({
    leaderboard:{
        type: Array
    },
    endTime:{
        type: Date
    },
    logs:{
        type: Array
    }
});

//export Game model
const Game = module.exports = mongoose.model('Game', GameSchema);

//create game
module.exports.createGame = function(newGame, callback){
    newGame.save(callback);
}

//find game
module.exports.findGame = function(callback){
    Game.find({}, callback);
}

//check for userId in games leaderboard array
module.exports.checkUserInGame = function(userId, callback){
    Game.find({leaderboard: {$elemMatch: {userId: userId}}}, callback);
}

//add user to game
module.exports.addUserToLeaderboard = function(user, callback){
    Game.findOneAndUpdate({}, {$push:{leaderboard: user}}, {new: true}, callback);    
}

//remove user from game


//update leaderboard and logs