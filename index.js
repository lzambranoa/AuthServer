const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config();



//Crear el servidor/aplicación de express
const app = express();

//Conexion a la base de datos
dbConnection();

// directorio publico
app.use( express.static('./public'))

//configuración del cors
app.use( cors() );

//lectura y parseo del body
app.use( express.json() );

//Rutas
app.use('/api/auth', require('./routes/auth'));


//Se inicia la aplicación
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
})