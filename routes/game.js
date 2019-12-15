const gameController = require('../controllers/gameController');
const auth = require('../middleware/check-auth');
const express = require('express');
const router = express.Router();


//creategame
router.post('/creategame', auth.checkToken, gameController.createGame);

//get current game
router.get('/', auth.checkToken, gameController.findGame);


//add user to game
router.post('/joingame', auth.checkToken, gameController.addUser);

router.get('/logs/:userId', gameController.calcAvBgl);
//update game
router.post('/', auth.checkToken, gameController.updateLogs, gameController.updateLeaderboard);

//remove user from game --DEV ONLY
router.delete('/:userId', gameController.removeUser);


module.exports = router;





