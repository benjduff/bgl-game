const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9_.-]*$/
    },
    password:{
        type: String,
        required: true
    },
    logs:{
        type: Array
    },
    bglAverage:{
        type: Number
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

//find if username exists
module.exports.validateUsername = function(username, callback){
    User.find({username: username}, callback);
}

//salt and hash new users password then save new user obj to users collection
module.exports.addNewUser = function(newUser, callback){
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
} 

//authenticate user for login
module.exports.findUserByUsername = function(username, callback){
    User.findOne({username: username}, callback);
}

//find user by id and delete from users collection
module.exports.deleteUserFromDb = function(userId, callback){
    User.findByIdAndDelete(userId, callback);
}

//add log to users logs array
module.exports.addLog = function(userId, newLog, callback){
    User.findByIdAndUpdate({_id: userId}, {$push: {logs: newLog}}, {new: true}, callback);
}

