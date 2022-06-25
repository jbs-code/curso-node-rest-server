const { Router } = require('express');
const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');
const router = Router();

//endpoints
router.get('/', usuariosGet);//Puede recibir queryParams, ver en routers.

router.post('/', usuariosPost);

router.put('/:id', usuariosPut);//recibiendo parámetros

router.delete('/', usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;