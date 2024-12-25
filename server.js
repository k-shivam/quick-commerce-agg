const express = require('express');
const {PORT} = require('./config')
const bodyParser = require('body-parser');

const routes = require('./src/routes/routes')

const app = express();
app.use(bodyParser.json())

app.use('/quick', routes);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
