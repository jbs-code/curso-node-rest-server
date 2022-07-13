const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validarCampos');

const router = Router()

router.post('/login', [
    check('correo', 'Debe poner un correo válido').isEmail(),
    check('password', 'El Password es obligatorio').not().isEmpty(),
    validarCampos
], login);

module.exports = router;