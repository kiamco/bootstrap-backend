const Router = require('express').Router();
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secrets = require('../config/secrets.js');

//data model for users
const userModel = require('../database/models/userModel.js');


Router.post('/register', (req, res) => {
    let user = req.body;
    const hash = bycrypt.hashSync(user.password, 10);
    user.password = hash;

    /* write function to add user to database */

    userModel.addUser(user)
        .then(users => {
            res.status(201).json({
                users,
                message: `Successfully created user: ${user.username} `
            })
        })
        .catch(err => {
            res.status(400).json({
                err,
                message: err.errno === 19 ? 'User exists' : "Server error"
            });
        })


});

Router.post('/login', (req, res) => {
    let { username, password } = req.body;

    /* write function to add user to login*/
    userModel.findByUser(username).then(item => {
            if (item && bycrypt.compareSync(password, item[0].password)) {
                const token = genToken(item[0]);
                res.status(200).json({
                    username: item[0].username,
                    token: token
                });
            } else {
                res.status(401).json({
                    message: "Invalid credentials"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                err,
                message: "Server issue"
            });
        });


});

function genToken(user) {
    // create the payload...
    const payload = {
        uid: user.uid,
        username: user.username,
        role: user.role
    };

    const options = {
        expiresIn: "3h"
    };

    const token = jwt.sign(payload, secrets.jwtSecret, options);
    return token;
}

module.exports = Router;