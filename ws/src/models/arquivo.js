const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const arquivo = new Schema({
  referenciaId: {
    type: Schema.Types.ObjectId,
    refPath: 'model',
  },
  caminho:{
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
    enum: ['Servico', 'Salao'],
  },
  
  dataCadastro: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Arquivo', arquivo);
