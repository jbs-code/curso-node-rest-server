const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { existeCategoriaPorId, existeProductoPorId, existeProductoPorNombre } = require('../helpers/bdValidators');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');


const router = Router()

//Obtener todas las categorias - publico
router.get('/', obtenerProductos);

//Obtener una categoría por id - publico
router.get('/:id', [
    check('id', "No es un id válido de Mongo").isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto);

//Crear una categoria - usuario con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    check('categoria', 'La categoría es requerida').not().isEmpty(),
    check('categoria', "No es un id válido de Mongo").isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

//Actualizar categoria - usuario con token valido
router.put('/:id', [
    validarJWT,
    check('id', "No es un id válido de Mongo").isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

//Borrar categoria - Usuario con rol admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', "No es un id válido de Mongo").isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);


module.exports = router;