const { response, request } = require("express");

const usuariosGet = (req = request, res = response) => {
    //Una ventaja de usar queryParams en express es que podemos definirles
    //valores por derfecto.
    const { q , nombre = 'No name', apikey } = req.query;

    res.json({
        msg: 'Get Api - Controler',
        q,
        nombre,
        apikey
    });
}

const usuariosPost = (req, res = response) => {
    const body = req.body;
    res.status(201).json({
        msg: 'POST Api - Controler',
        body
    });
}

const usuariosPut = (req, res = response) => {
    const { id } = req.params;
    res.json({
        msg: 'PUT Api - Controler',
        id
    });
}

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'Delete Api - Controler'
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