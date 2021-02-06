const router = require('express').Router();
const user = require('../model/user').userModel;
const validation = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Validation

const Joi = require('@hapi/joi');

const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()

})

router.post('/register', async (req, res) => {
    //Validation of the data before we make the user
    const { error } = validation.registerValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //checking if the user is already inside the database ;
    const emailExist = await user.findOne({ email: req.body.email });
    if (emailExist) {
        return res.status(400).send("email already exists");
    }


    //hash the password before we save the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);




    //here we save the user after validation
    const userdata = new user({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });
    try {
        const saveduser = await userdata.save();
        res.status(200).send({ user: saveduser._id });
    }
    catch (err) {
        console.log(e);
        return res.status(400).send(err);
    }
});


//LOGIN 

router.post('/login', async (req, res) => {
    //Validating the data for the login body
    const { error } = validation.loginValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    //we check if there is a user existing with the given email
    const data = await user.findOne({ email: req.body.email });
    if (!data) {
        return res.status(400).send("Email is not found");
    }
    //we will check for password; 
    const validPass = await bcrypt.compare(req.body.password, data.password);
    if (!validPass) {
        return res.status(400).send("password is wrong");
    }

    //Create and assign a token
    const token = jwt.sign({ _id: data._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

})



module.exports = router;