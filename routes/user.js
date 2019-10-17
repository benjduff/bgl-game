const userController = require('../controllers/userController');
const gameController = require('../controllers/gameController');
const express = require('express');
const router = express.Router();

//Register router
router.post('/signup', userController.registerUser);

router.post('/login', userController.authenticate);