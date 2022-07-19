const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {
        //Verifica si el email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: "El Usuario / Password no es correcto - correo"
            });
        }

        //Si el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: "El Usuario / Password no es correcto - estado: false"
            });
        }

        //Validar password
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
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

const googleSignIn = async (req, res = response) => {
    const { id_token } = req.body;

    try {
        const { nombre, correo, img } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        //Generar usuario si no existe
        if(!usuario){
            //aunque con la auntenticaión con google no requiere password, debemos mandarlo porque así esta diseñádo nuestro modelo.
            const data = {
                nombre,
                correo,
                password: ':P',
                rol: 'USER_ROLE',
                img,
                google: true
            }

            usuario = new Usuario(data);
            await usuario.save();
        }

        //Verificar que usuario no tenga estado: false
        if(!usuario.estado){
            return res.status(401).json({
                msg: "Hable con el administrador, usuario bloqueado"
            });
        }

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'El id_token no se pudo verificar'
        });
    }

}

module.exports = {
    login,
    googleSignIn
}