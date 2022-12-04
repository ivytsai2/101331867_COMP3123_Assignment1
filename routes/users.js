const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const UserModel = require('../models/Users');
const fun = require('../functions');
const userRoutes = express.Router();
let myToken;

/*{
    "username": "test1",
    "email": "test1@domain.com",
    "password": "test1"
}*/
//create new account
userRoutes.post('/signup', async (req, res) => {
    const {username, email, password} = req.body;
    // validate user input
    if (fun.isEmpty(req.body)) {
        return res.status(400).send(fun.emptyBodyMsg("user"));
    }
    try {
        // check if user already exist
        const oldUser = await UserModel.findOne({username});
        if (oldUser) {
            return res.status(400).send({
                status: false,
                message: "User already exist. Please Login"
            });
        }
        // emcrpyt password
        encryptedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({
            username: username,
            email: email,
            password: encryptedPassword
        });
        newUser.save();
        res.status(201).send({
            status: true,
            message: "Registered successfully!"
        });
    } catch (e) {
        if (!(username && email && password)){
            return res.status(400).send({
                status: false,
                message: "All fields are required"
            });
        }
        res.status(500).send({
            status: false,
            message: "This email has been registered"
        });
    }
})

/*{
    "username": "comp3123",
    "password": "comp3123isthebest"
}*/
//account login
userRoutes.post('/login', async (req, res) => { 
    // validate user input
    if (fun.isEmpty(req.body)) {
        return res.status(400).send(fun.emptyBodyMsg("user"));
    }
    try {
        const {username, password} = req.body;
        const user = await UserModel.findOne({username});
        if (!user) {
            res.status(500).send(fun.invalidImputMsg("username"));
        } else {
            if (await bcrypt.compare(password, user.password)) {
                // Create token with the username in the payload and expires after 2hrs
                const jwtKey = "my_secret_key";
                const myToken = await jwt.sign(
                    { username },
                    jwtKey,
                    { expiresIn: "2h" }
                );
                res.status(200).send({
                    status: true,
                    username: username,
                    message: "User logged in successfully",
                    token: `${myToken}`
                });
            } else {
                res.status(500).send(fun.invalidImputMsg("password"));
            }
        } 
    } catch (e) {
        res.status(500).send({
            status: false,
            message: e.message
        });
    }
})

module.exports = userRoutes;