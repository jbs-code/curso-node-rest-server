const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'EL nombre es requerido']
    },

    correo:{
        type: String,
        required: [true, 'EL correo es requerido'],
        unique: true
    },

    password:{
        type: String,
        required: [true, 'EL password es requerido']
    },

    img:{
        type: String
    },

    rol:{
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },

    estado:{
        type: Boolean,
        default: true
    },

    google:{
        type: Boolean,
        default: false
    }
});

//En nuestro modelo podemos escribir métodos, en este caso vamos a sobreescibir el metodo toJSON
//que utiliza mongoose para entregar los datos. Esto lo vamos a hacer para quitar el password y la version.

//Debemos declarar una función tradicional porque emplearemos el objeto this y de esta manera mantemeos la intancia.
UsuarioSchema.methods.toJSON = function() {
    const {__v, password, ...usuario} = this.toObject();
    return usuario;
}
module.exports = model('Usuario', UsuarioSchema);