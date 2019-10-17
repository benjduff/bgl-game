const mongoose = require('mongoose');
const config = require('../config/database');

const GameSchema = mongoose.Schema({
    leaderboard:{
        type: Array
    },
    endTime:{
        type: Date
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
    Game.findOne({});
}

//add user to game
module.exports.addUser = function(user, callback){
    Game.findOneAndUpdate({}, {$push:{leaderboard: user}}, {new: true}, callback);
}

//remove user from game


//update leaderboard and logs