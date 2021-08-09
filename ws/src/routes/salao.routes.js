const express = require('express');
const router = express.Router();
const Salao = require('../models/salao');
const Servico = require('../models/servico');

router.post('/', async (req, res ) => {
    try{
        const salao = await new Salao(req.body).save();
        res.json({ salao })
    }catch(err){
        res.json({ error: true, message: err.message })
    }
});

router.get('/servicos/:salão', async (req,res) =>{
    try{
        const{ salaoId } = req.params;
        const servicos = await Servico.find({
            salaoId,
            status: 'A'
        }).selet('_id titulo');
        res.json({
            servicos:servicos.map(s => ({label:s.titulo, value:s._id}))
        });

    }catch(err){
        res.json({ error: true, message: err.message })
    }
});

module.exports = router;