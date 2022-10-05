const Categoria = require('../models/categoria');
const Producto = require('../models/producto');
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

const existeCategoriaPorId = async (id = '') => {

    const categoria = await Categoria.findById(id);

    if (!categoria) {
        throw new Error(`La categoría no existe - id incorrecto`);
    }
}

const existeProductoPorId = async (id = '') => {
    const producto = await Producto.findById(id);

    if (!producto) {
        throw new Error(`El producto no existe - id incorrecto`);
    }
}

const existeProductoPorNombre = async(nombre = '') => {
    //Verificar si el correo existe
    const existProducto = await Producto.findOne({ nombre: nombre.toUpperCase() });

    if (existProducto) {
       throw new Error(`El producto ya existe`);
    }
}
module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    existeProductoPorNombre
}