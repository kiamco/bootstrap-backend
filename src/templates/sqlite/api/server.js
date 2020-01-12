const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const server = express();

/*  import Routes here */
const AuthRouter = require('../routes/authRouter.js');

server.use(express.json());
server.use(helmet());
server.use(cors());
server.use('/', AuthRouter);


server.get('/', (req, res) => {
    res.send("server running");
})

module.exports = server;