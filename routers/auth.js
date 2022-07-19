const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validarCampos');

const router = Router()

router.post('/login', [
    check('correo', 'Debe poner un correo válido').isEmail(),
    check('password', 'El Password es obligatorio').not().isEmpty(),
    validarCampos
], login);

router.post('/google', [
    check('id_token', 'EL id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignIn);

module.exports = router;