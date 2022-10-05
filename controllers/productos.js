const { response, request } = require("express");
const { Producto } = require("../models");

//obtenerProductos
const obtenerProductos = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };//para que ignore a los estados en false, que serán documentos borrados.

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
    ]);
    res.json({
        total,
        productos
    });
}

//obtenerProductoPorId
const obtenerProducto = async (req = request, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findById(id)
                            .populate('usuario', 'nombre')//populate regresa los datos de categoria también
                            .populate('categoria', 'nombre');//populate regresa los datos de categoria también

    res.status(200).json({
        producto
    });
}

//crearProducto
const crearProducto = async (req, res = response) => {
    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre.toUpperCase() });

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id //req.usuario se genera al momento de validar el token
    }

    const producto = new Producto(data);

    //Guardar en BD
    await producto.save();

    res.status(201).json({
        producto
    });
}

//actualizarProducto
const actualizarProducto = async (req = request, res = response) => {
    const { id } = req.params;
    //debemos asegurarnos de excluir el estado y el usuario para que no sean modificados en nuestra BD.
    const { estado, usuario, ...data } = req.body;

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;

    //{new: true} es para que devuelva en la respuesta el nuevo estado en la BD
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
        producto
    });
}

//borrarCategoría
const borrarProducto = async (req = request, res = response) => {
    const { id } = req.params;

    const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.status(200).json({
        productoBorrado
    });
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}