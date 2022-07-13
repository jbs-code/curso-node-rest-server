const { Router } = require('express');
const { check } = require('express-validator');

const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/bdValidators');
const {validarJWT, esAdminRole, tieneRol, validarCampos} = require('../middlewares')

const router = Router();

//endpoints
router.get('/', usuariosGet);//Puede recibir queryParams, ver en routers.

//El segundo argumento son middlewares que utilizamos para hacer validaciones, si son más de uno los metemos en un arreglo.
//Hacemos las validaciones con ayuda de express-validator y atrapamos los errores en el middleware personalizado validarCampos.
router.post('/',[
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    check('password', 'El password debe de tener al menos 6 caracteres').isLength({min:6}),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),//Esto es igual a: custom(correo => emailExiste(correo))
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    //La siguiente implemantación veirifica los roles con la BD
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPost);

router.put('/:id',[
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPut);//recibiendo parámetros

router.delete('/:id',[
    validarJWT,
    // esAdminRole,
    tieneRol('ADMIN_ROLE','USER_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;