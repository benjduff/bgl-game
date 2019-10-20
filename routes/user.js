const userController = require('../controllers/userController');
const auth = require('../middleware/check-auth');
const express = require('express');
const router = express.Router();

//Register router
router.post('/signup', userController.registerUser);

//Login
router.post('/login', userController.authenticate);

//Delete a user
router.delete('/delete/:userId', auth.checkToken, userController.deleteUser);


module.exports = router;