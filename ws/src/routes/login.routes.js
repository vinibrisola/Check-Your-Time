const express = require('express');
const router = express.Router();
const Salao = require('../models/salao');

router.post('/login', async (req,res)=>{
    try{

        const credenciais = req.body;
        const salaoUsuario = await Salao.findOne(credenciais);


        if(salaoUsuario) {
            res.json({ error: false, salaoUsuario});
        }else {
            res.json({ error: true, message: 'Nenhum Salao encontrado.'});
        }
    }catch (err){
        res.json({ error: true, message: err.message });
    }
})



module.exports =router;