const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/bdValidators');


const router = Router()

//Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

//Obtener una categoría por id - publico
router.get('/:id', [
    check('id', "No es un id válido de Mongo").isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoria);

//Crear una categoria - usuario con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    validarCampos
], crearCategoria);

//Actualizar categoria - usuario con token valido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    check('id', "No es un id válido de Mongo").isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria);

//Borrar categoria - Usuario con rol admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', "No es un id válido de Mongo").isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria);




module.exports = router;