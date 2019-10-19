const userController = require('../controllers/userController');
const express = require('express');
const router = express.Router();

//Register router
router.post('/signup', userController.registerUser);

//Login
router.post('/login', userController.authenticate);

//Delete a user
router.delete('/delete/:userId', userController.deleteUser);


module.exports = router;