// remember express by default cannot parse JSON in request bodies

// global middlewares and the user's router need to be connected here

const express = require('express');
const cors = require('cors');
const usersRouter = require('./users/users-router');

const server = express();

server.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

server.use(express.json());
server.use('/api/users', usersRouter);
server.use(cors());

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

module.exports = server;
