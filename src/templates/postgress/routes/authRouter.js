const Router = require('express').Router();
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secrets = require('../config/sercrets.js');

//data model for users
const userModel = require('../database/models/userModel.js');


Router.post('/register', (req, res) => {
    let user = req.body;
    const hash = bycrypt.hashSync(user.password, 10);
    user.password = hash;

    /* write function to add user to database */


});

Router.post('/login', (req, res) => {
    let { username, password } = req.body;

    /* write function to add user to login*/


})

module.exports = Router;