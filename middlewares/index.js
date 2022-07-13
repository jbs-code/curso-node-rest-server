//Este index nos va a ayudar con la importación de los middlewares y tener mejor ordenado nuestro código.
const validaJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');
const validaCampos = require('../middlewares/validarCampos');

module.exports = {
    //con spread nos olvidamos de las importaciones de las funciones individuales
    ...validaJWT,
    ...validaCampos,
    ...validaRoles
}