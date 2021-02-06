const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
//Import routes

const authRoute = require('./routes/auth');


dotenv.config();
//connect to DB

mongoose.connect(process.env.DB_connect, { useUnifiedTopology: true, useNewUrlParser: true }, () => {
    console.log('database connected');
})

//middlewares 

app.use(express.json());



//Route Middlewares

app.use('/api/user', authRoute);

app.listen(3000, () => {
    console.log('Server started');
})

