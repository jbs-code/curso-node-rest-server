const { response } = require("express");
const { isValidObjectId } = require("mongoose");
const { Usuario, Categoria, Producto } = require("../models");
const categoria = require("../models/categoria");

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuarios = async(termino = '', res = response) => {
    const esMongoId = isValidObjectId(termino);// verificamos que tenemos un id de mongo válido
    
    if(esMongoId){
        const usuario = await Usuario.findById(termino);

        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    //Usamos esta expresion regular para que no sea tan estricto al ingresar la búsqueda con mayúsculas y minúsculas
    const regex = RegExp(termino, 'i'); 

    //$or y $and son algunas de las instrucciones propias de mongo para condicionar nuestras busquedas, en
    //este caso para buscar ya sea por nombre o por correo y excluir los resultados con estado en false.
    const usuario = await Usuario.find({
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{estado: true}]
    })

    res.json({
        results: usuario
    });
}

const buscarCategoria = async(termino = '', res = response) => {
    const esMongoId = isValidObjectId(termino);// verificamos que tenemos un id de mongo válido
    
    if(esMongoId){
        const categoria = await Categoria.findById(termino);

        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }

    //Usamos esta expresion regular para que no sea tan estricto al ingresar la búsqueda con mayúsculas y minúsculas
    const regex = RegExp(termino, 'i'); 

    //$or y $and son algunas de las instrucciones propias de mongo para condicionar nuestras busquedas, en
    //este caso para buscar ya sea por nombre o por correo y excluir los resultados con estado en false.
    const categoria = await Categoria.find({
        nombre: regex,
        estado: true
     })

    res.json({
        results: categoria
    });
}

const buscarProducto = async(termino = '', res = response) => {
    const esMongoId = isValidObjectId(termino);// verificamos que tenemos un id de mongo válido
    
    if(esMongoId){
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');

        return res.json({
            results: (producto) ? [producto] : []
        });
    }

    //Usamos esta expresion regular para que no sea tan estricto al ingresar la búsqueda con mayúsculas y minúsculas
    const regex = RegExp(termino, 'i'); 

    //$or y $and son algunas de las instrucciones propias de mongo para condicionar nuestras busquedas, en
    //este caso para buscar ya sea por nombre o por correo y excluir los resultados con estado en false.
    const producto = await Producto.find({nombre: regex, estado: true}).populate('categoria', 'nombre');

    res.json({
        results: producto
    });
}

const buscar = (req, res = response) => {
    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `${coleccion} no es una colección permitida: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res)
            break;
        case 'categorias':
            buscarCategoria(termino, res);
            break;
        case 'productos':
            buscarProducto(termino, res);
            buscar
            break;

        default:
            res.status(500).json({
                msg: "busqueda no implementada aun"
            })
    }
}
module.exports = {
    buscar
}