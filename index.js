// require your server and launch it
require('dotenv').config();
const express = require('express');
const server = express();

if (process.env.NODE_ENV === 'production') {
    console.log('This means this code is deployed.');
}

const port = process.env.PORT || 5000;

server.get('/api', (req, res) => {
    res.json({ message: `API running on port ${port}.` });
});

server.use((req, res) => {
    res.status(404).json({ message: '404 Not Found' });
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});