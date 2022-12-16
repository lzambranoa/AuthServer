const { response } =require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJwt } = require('../helpers/jwt');
const { db } = require('../models/Usuario');

const crearUsuario = async (req, res = response) => {
    
    const {email, name, password} = req.body;

    try {

        //Verificar que el email no exista en la base de datos
        const usuario = await Usuario.findOne({email});

        if( usuario ) {
            return res.status(400).json({
                ok:  false,
                msg: 'El email ya existe en la base de datos'
            });
        }


    // crear usuario con el modelo
        const dbUser = new Usuario( req.body );

    //Hashear (encriptar) la contraseña
    const salt = bcrypt.genSaltSync();
    dbUser.password = bcrypt.hashSync(password, salt);


    //Generar el JWT
    const token = await generarJwt(dbUser.id, name)

    //Crear usuario de BD
       await dbUser.save();

    // Generar respuesta exitosa

        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            email,
            token
        })
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error en la creación del usuario hable con admin'
        });
    }

    

    
}

const LoginUsuario = async(req, res = response) => {

    const {email, password} = req.body;

    try {

        const dbUser = await Usuario.findOne({email});

        if(!dbUser){
            return res.status(400).json({
                ok: false,
                msg: 'el correo no existe'
            })
        }

        // Confirmar si el password hace match
        const validarPassword = bcrypt.compareSync(password, dbUser.password);

        if(!validarPassword){
            return res.status(400).json({
                ok: false,
                msg: 'el password no es valido'
            })
        }

         // Generar el JWT
         const token = await generarJwt(dbUser.id, dbUser.name);

         // respuesta del servicio
         return res.json({
             ok: true,
             uid: dbUser.id,
             name: dbUser.name,
             email: dbUser.email,
             token
         })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }
}

const validarToken = async (req, res) => {

    const { uid } = req;

    // leer la base de datos para obtener el name y email
    const dbUser = await Usuario.findById(uid);
    

    // Generar el JWT
    const token = await generarJwt(uid, dbUser.name);

    return res.json({
        ok: true,
        uid,
        name: dbUser.name,
        email: dbUser.email,
        token
    });
}

module.exports = {
    crearUsuario,
    LoginUsuario,
    validarToken
}