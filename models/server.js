const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

//Implementamos un server de express con una clase. Una forma diferente a su implementación tradicional.
class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            auth: '/api/auth',
            auth: '/api/buscar',
            categorias: '/api/categorias',
            productos : '/api/productos',
            usuarios : '/api/usuarios'
        }
        
        //dbConnection
        this.ConnectionDB();

        //Middlewares
        this.middlewares();

        //Methods
        this.routes();
    }

    async ConnectionDB() {
        await dbConnection();
    }

    middlewares() {
        //CORS. Para proteger las rutas.
        this.app.use(cors());

        //Lectura y parseo del body(Recibir objetos del body con POST, PUT, etc.)
        this.app.use(express.json());

        //Directorio público
        this.app.use(express.static('public'));
    }

    routes() {
        //middleware que solo se ejecta en la ruta especificada y carga un recurso, en este caso las rutas.
        this.app.use(this.paths.auth, require('../routers/auth'));
        this.app.use(this.paths.auth, require('../routers/buscar'));
        this.app.use(this.paths.categorias, require('../routers/categorias'));
        this.app.use(this.paths.productos, require('../routers/productos'));
        this.app.use(this.paths.usuarios, require('../routers/usuarios'));

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`);
        });
    }
}

module.exports = Server;