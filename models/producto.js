const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, "El nombre del producto es obligatorio"],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectID,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectID,
        ref: 'Categoria',
        required: true
    },
    descripcion: {
        type: String
    },
    disponible: {
        type: Boolean,
        default: true
    }
});

ProductoSchema.methods.toJSON = function() {
    const {__v, estado, ...data} = this.toObject();
    return data;
}

module.exports = model("Producto", ProductoSchema);