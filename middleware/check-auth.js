const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports.checkToken = function(req, res, next){
    try {
        //get token from auth header
        const token = req.headers.authorization.split(" ")[1];
        //verify with private key
        const decoded = jwt.verify(token, config.JWT_KEY);
        //pass decoded token data to new req param
        res.locals.userData = decoded;
        next();
    } catch (error) {
        return res.redirect('/login');
    }
}