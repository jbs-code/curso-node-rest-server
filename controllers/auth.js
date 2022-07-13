const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {
        //Verifica si el email existe
        const usuario = await Usuario.findOne({ correo });
        if(!usuario){
            return res.status(400).json({
                msg:"El Usuario / Password no es correcto - correo"
            });
        }

        //Si el usuario está activo
        if(!usuario.estado){
            return res.status(400).json({
                msg:"El Usuario / Password no es correcto - estado: false"
            });
        }

        //Validar password
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: "El Usuario / Password no es correcto - password"
            });
        }

        const token = await generarJWT(usuario.id);
        res.json({
            usuario,
            token
        });
    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: "Póngase en contacto con el administrador"
        });
    }
}

module.exports = {
    login
}