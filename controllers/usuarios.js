const { response, request } = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');

const usuariosGet = async (req = request, res = response) => {
    //Una ventaja de usar queryParams en express es que podemos definirles
    //valores por derfecto.
    // const { q, nombre = 'No name', apikey } = req.query;

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };//para que ignore a los estados en false, que serán documentos borrados.

    //Habría que hacer el control en caso de que user ingrese letras en vez de numeros
    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite));
    // const total = await Usuario.countDocuments(query);

    //Podemos ajecutar las promesas que son independientes una de otra simultaneamente ahorrando tiempo con Promise.all
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });//manejo de BBDD


    //Encriptar la contraseña || revisar doc de bcryptjs para entender su funcionamientoi.
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //Guardar en BD
    await usuario.save();

    res.status(201).json({
        usuario
    });
}

const usuariosPut = async (req, res = response) => {
    const { id } = req.params;

    const { _id, password, google, correo, ...resto } = req.body;

    //Encriptar la contraseña || revisar doc de bcryptjs para entender su funcionamientoi.
    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}

const usuariosDelete = async (req, res = response) => {
    const { id } = req.params;

    //Borrar físicamente de la base de datos
    // const usuario = await Usuario.findByIdAndDelete(id);

    //Vamos a mantener la integridad de la BD y solo haremos el update del estado
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json({
        usuario,
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'Patch Api - Controler'
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
}