const express = require('express');
const cors = require('cors');
const app = express();
const Router = require('./routes/index');

app.use(cors());
app.use(express.json());
app.use('/v1', Router);

app.get('/', (req, res) => {
    res.json({
        message: 'server running',
        serverTime: new Date(),
    });
});

app.get('*', function (req, res) {
    res.status(404).send('not found');
});

module.exports = app;
