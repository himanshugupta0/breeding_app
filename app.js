const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyparser = require('body-parser');
const nocache = require('nocache');

const app = express();

const port = process.env.PORT || 5000;

console.log(`NODE_ENV: ${app.get('env')}`); 

app.use(cors());
app.use(bodyparser.json({ extended: true }));
app.use(nocache());
// app.use(express.static(distPath));


require('./startup/routes')(app);
require('./startup/db');
// require('./startup/usermoduleDb')();


if (process.env.NODE_ENV == 'production') {
    require('./startup/prod')(app);
}

app.listen(port, () => {
    console.log('Server started at port ' + port);
    // readResponseForS3Job();
});
