// require your server and launch it
require('dotenv').config()  ;
const server = require('./api/server');

const port = process.env.PORT || 5000;

server.get('/api', (req, res) => {
    res.json({ message: `API running on port ${process.env.PORT}.` });
});

server.use((req, res) => {
    res.status(404).json({ message: '404 Not Found' });
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});