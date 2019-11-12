require('./config/config.js');

const mongoose = require('mongoose');
const express = require('express');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Configuracion global de rutas
app.use(require('./routes/index.js'));

// parse application/json
app.use(bodyParser.json());

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

//console.log(path.resolve(__dirname, '../public'));

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