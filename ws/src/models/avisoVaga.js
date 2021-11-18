const mongoose = require('mongoose')
const Schema = mongoose.Schema

const avisoVaga = new Schema({
	salaoId: {
		type: Schema.Types.Object,
		required: true	
	},
	descricaoVaga: {
		type: String,
		required: true
	},
	Salario:{
		type: Number,
	},
	especialidades:{
		type: String,
    enum: ['barbeiro', 'manicure', 'pedecure'],
	},
	cargaHoraria:{
		type:Date,
	},
	dataCriacao: {
		type: Date,
		default: Date.now
	}
})


module.exports = mongoose.model('AvisoVaga', avisoVaga)
