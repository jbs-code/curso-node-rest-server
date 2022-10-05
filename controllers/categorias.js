const { response, request } = require("express");
const { Categoria } = require("../models");

//obtenerCategorías
const obtenerCategorias = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };//para que ignore a los estados en false, que serán documentos borrados.

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario', 'nombre')
    ]);
    res.json({
        total,
        categorias
    });
}

//obtenerCategoríaPorId
const obtenerCategoria = async (req = request, res = response) => {
    const { id } = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');//populate regresa los datos de usuario también

    res.status(200).json({
        categoria
    });
}

const crearCategoria = async (req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoría ${categoriaDB.nombre} ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id //req.usuario se genera al momento de validar el token
    }

    const categoria = new Categoria(data);

    //Guardar en BD
    await categoria.save();

    res.status(201).json({
        categoria
    });
}

//actualizarCategoría 
const actualizarCategoria = async (req = request, res = response) => {
    const { id } = req.params;
    //debemos asegurarnos de excluir el estado y el usuario para que no sean modificados en nuestra BD.
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    //{new: true} es para que devuelva en la respuesta el nuevo estado en la BD
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
        categoria
    });
}

//borrarCategoría
const borrarCategoria = async (req = request, res = response) => {
    const { id } = req.params;

    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.status(200).json({
        categoriaBorrada
    });
}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}