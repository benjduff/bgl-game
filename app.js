const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config/database');
const gameRoute = require('./routes/game');
const userRoute = require('./routes/user');

//connect to db
mongoose.connect(config.database);
//On connection
mongoose.connection.on('connected', ()=> {
    console.log('Connected to database: ' + config.database);    
});
//Err on connection
mongoose.connection.on('error', (err)=>{
    console.log('There was an error connecting to the database.. ERROR: ' + err);
});

//init app as express
const app = express();


//set port
const port = 8080;

//CORS middleware
app.use(cors());
//Body-Parser middleware
app.use(bodyParser.json());


//Routes
app.use(gameRoute);
app.use(userRoute);



//start server
app.listen(port, () => {
    console.log('App started on port: ' + port);
});




