const mongoose = require('mongoose');//Es para facilitar el manejo de la BBDD

const dbConnection = async() => {
    try {
        //revisar documentación de mongoose
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Base de datos online');
        
    } catch (error) {
        console.log(error);
        throw new Error('Hubo un problema al conectarse con la base de datos');
    }
}

module.exports = {
    dbConnection
}