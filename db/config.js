const mongoose = require('mongoose');

const dbConnection =  async() => {
    try {

        await mongoose.connect( process.env.BD_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Base de datos OnLine')
        
    } catch (error) {
        console.log(error);
        throw new Error('Error en la inicialización de la base de datos');
    }
}

module.exports = {
    dbConnection
}