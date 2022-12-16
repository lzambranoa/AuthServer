
const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, LoginUsuario, validarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// crear un nuevo usuario
router.post('/new', [
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('email','El email es obligatorio').isEmail(),
    check('password','El password es obligatorio').isLength({min: 6}),
    validarCampos
], crearUsuario );

// Login usuario
router.post('/',[
    check('email','El email es obligatorio').isEmail(),
    check('password','El password es obligatorio').isLength({min: 6}),
    validarCampos
],LoginUsuario );

// Validar y revalidar token
router.get('/renew', validarJWT, validarToken );


module.exports = router;