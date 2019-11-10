require('./config/config.js');

const mongoose = require('mongoose');
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(require('./routes/usuario.js'));

// parse application/json
app.use(bodyParser.json());


/*
mongoose.connect('mongodb://localhost:27017/cafe', (err, res) => {
    if (err) throw err;

    console.log('Base de datos ONLINE');
});
*/
mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    },
    (err, res) => {
        if (err) throw err;

        console.log('Base de datos ONLINE');
    });




app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: 3000');
});