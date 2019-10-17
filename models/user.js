const mongoose = require('mongoose');
const config = require('../config/database');
const game = require('./game.js');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    userName:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    logs:{
        type: Array
    }
});

const User = module.exports = mongoose.model('User', UserSchema);


module.exports.addNewUser = function(newUser, callback){
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}