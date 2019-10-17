const gameController = require('../controllers/gameController');
const express = require('express');
const router = express.Router();

//creategame
router.post('/creategame', gameController.createGame);

//get game
router.get('/', gameController.findGame);


//add user to game
router.post('/joingame', gameController.addUser);


//update game


//remove user from game


module.exports = router;



