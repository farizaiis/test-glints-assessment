const port = process.env.PORT || 6000;
const app = require('./server');

app.listen(port, () => {
    console.log('Listening on port', port);
});
