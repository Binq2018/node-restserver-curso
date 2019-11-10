//====================
//====== PUERTO ======
//====================
process.env.PORT = process.env.PORT || 3000;

//===================
//== Entorno ========
//===================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//===================
//== Base de datos ==
//===================
let urlDB;

// if (process.env.NODE_ENV === 'dev') {
//     urlDB = 'mongodb://localhost:27017/cafe';
// } else {
//urlDB = 'mongodb://Binq2018:mongo523@ds213209mlab.com:13209/cafe';
urlDB = 'mongodb+srv://Binq2018:mongo523@cluster0-5zktn.mongodb.net/cafe';
//}

process.env.URLDB = urlDB;