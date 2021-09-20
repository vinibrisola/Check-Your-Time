const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuario = new Schema({
    usuarioId:{
        type:integer,
        required: true,
        unique: true,
    },
    tipo: {
        type: String,
        enum: ['CL', 'CO','GE','RE'],
        required: true,
        default: '',
    },
    tipoId:{
        type:integer,
        required:true,
    },
    usuario: {
        type: String,
        required: true,
        unique: true,
      },
    senha: {
        type: String,
        default: null,
    },
});

module.exports = mongoose.model('Usuario', usuario);