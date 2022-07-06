const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async(rol = '') => {
    const existRole = await Role.findOne({rol});
    if(!existRole){
        //throw new Error es la forma en como express-validator maneja elos errores con un check personalizado
        throw new Error(`El rol ${rol} no existe en la BD`);
    }
}

const emailExiste = async(correo = '') => {
     //Verificar si el correo existe
     const existEmail = await Usuario.findOne({ correo });

     if (existEmail) {
        throw new Error(`El correo ${correo} ya existe`);
     }
}

const existeUsuarioPorId = async(id) => {
    //Verificar si el id existe
    const existeUsuario = await Usuario.findById(id);

    if (!existeUsuario) {
       throw new Error(`El usuario con id ${id} no existe`);
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}