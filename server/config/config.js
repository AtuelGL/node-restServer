// ===================
// Port
// ===================
process.env.PORT = process.env.PORT || 3000;


// ===================
// Entorno
// ===================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===================
// Vencimiento del Token
// ===================
// 60 min * 60 seg 
process.env.CADUCIDAD_TOKEN = '12h';

// ===================
// Seed
// ===================
process.env.SEED = process.env.SEED || 'Este-es-el-seed-desarrollo';

// ===================
// Base de datos
// ===================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


// ===================
// Google Client ID
// ===================
process.env.CLIENT_ID = process.env.CLIENT_ID || '419072330777-dm29fh8ibkgot5p5o99vmdhpmkuklrk7.apps.googleusercontent.com'