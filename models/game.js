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

//delete user form game --DEV ONLY
module.exports.deleteUser = function(userId, callback){
    Game.updateOne({}, {$pull: {leaderboard: {userId: userId}}}, callback);
}

//find how many logs a user has in the game
module.exports.getTotalLogs = function(gameId, userId, callback){
    Game.aggregate([{$unwind:"$logs"}, 
        {$group:{_id:"$logs.userId", 
        logs: {$sum: 1}
    }}]).exec(callback);
}
 
//add a new log to the game
module.exports.updateLogs = function(gameId, newLog, callback){
    Game.findByIdAndUpdate(gameId, {$push: {logs: newLog}}, {new:true}, callback);
}

//update users total points in game leaderboard
module.exports.updateLeaderboard = function(userId, totalPoints, callback){
    Game.update({leaderboard: {$elemMatch: {userId: userId}}}, {$set: {'leaderboard.$.userPoints': totalPoints}}, callback);
}

//get all of a users bgl logs from game
module.exports.getUserBgls = function(userId, callback){
    Game.aggregate([
        {$unwind: "$logs"},
        {$match: {"logs.userId":userId}},
        {$group:{_id:'$logs.userId', bgls:{$push:'$logs.bgl'}}}
    ]).exec(callback);
}
