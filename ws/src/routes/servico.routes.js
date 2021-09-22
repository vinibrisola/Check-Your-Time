const express = require('express');
const router = express.Router();
const Busboy = require('busboy');
const aws = require('../services/aws');
const Servico = require('../models/servico');
const Arquivo = require('../models/arquivo');



router.post('/', async (req, res) => {
    let busboy = new Busboy({ headers: req.headers });
    busboy.on(`finish`, async () => {
      try{
        const { salaoId, servico } = req.body;
        let errors = [];
        let arquivos = [];

        if (req.files && Object.keys(req.files).length > 0) {
          for (let key of Object.keys(req.files)){
            const file = req.files[key];

            const nameParts = file.nome.split('.');
            const fileName = `${new Date().getTime()};.${nameParts[nameParts.length - 1]}`;

            const path = `servicos/${salaoId}/${fileName}`;


            const response = await aws.uploadToS3( file, path);

            if (response.error) {
              errors.push({ error : true, message: response.message})
            } else {
              arquivos.push(path);
            }

          }
        }
        if (errors.length > 0) {
          res.json(errors[0]);
          return false;
        }

        let jsonServico = JSON.parse(servico);
        const servicoCadastrado = await Servico(jsonServico).save();

        arquivos = arquivos.map(arquivo => ({
          referenciaId: servicoCadastrado.id ,
          model: 'Servico',
          caminho: arquivo ,
        }));

        await Arquivo.insertMany(arquivos);
        res.json( servico, servicoCadastrado, arquivos);
      }catch (err) {
        res.json({ error: true, message: err.message });
      }
    });
  req.pipe(busboy);
});

router.put('/:id', async (req, res) => {
  var busboy = new Busboy({ headers: req.headers });
  busboy.on('finish', async () => {
    try {
      let errors = [];
      let arquivos = [];

      if (req.files && Object.keys(req.files).length > 0) {
        for (let key of Object.keys(req.files)) {
          const file = req.files[key];

          const nameParts = file.name.split('.');
          const fileName = `${new Date().getTime()}.${
            nameParts[nameParts.length - 1]
          }`;
          const path = `servicos/${req.body.salaoId}/${fileName}`;

          const response = await aws.uploadToS3(
            file,
            path
            //, acl = https://docs.aws.amazon.com/pt_br/AmazonS3/latest/dev/acl-overview.html
          );

          if (response.error) {
            errors.push({ error: true, message: response.message.message });
          } else {
            arquivos.push(path);
          }
        }
      }

      if (errors.length > 0) {
        res.json(errors[0]);
        return false;
      }

      //  ATUALIZAR SERVIÇO
      let jsonServico = JSON.parse(req.body.servico);
      await Servico.findByIdAndUpdate(req.params.id, jsonServico);

      // CRIAR ARQUIVO
      arquivos = arquivos.map((arquivo) => ({
        referenciaId: req.params.id,
        model: 'Servico',
        caminho: arquivo,
      }));
      await Arquivos.insertMany(arquivos);

      res.json({ error: false });
    } catch (err) {
      res.json({ error: true, message: err.message });
    }
  });
  req.pipe(busboy);
});


router.get('/salao/:salaoId', async (req, res) => {
    try {
      let servicosSalao = [];
      const servicos = await Servico.find({
        salaoId: req.params.salaoId,
        status: { $ne: 'E' },
      });
  
      for (let servico of servicos) {
        const arquivos = await Arquivos.find({
          model: 'Servico',
          referenciaId: servico._id,
        });
        servicosSalao.push({ ...servico._doc, arquivos });
      }
  
      res.json({
        error: false,
        servicos: servicosSalao,
      });
    } catch (err) {
      res.json({ error: true, message: err.message });
    }
  });
  
  /*
    FAZER NA #01
  */
router.post('/remove-arquivo', async (req, res) => {
    try {
      const { arquivo } = req.body;
  
      // EXCLUIR DA AWS
      await aws.deleteFileS3(arquivo);
  
      // EXCLUIR DO BANCO DE DADOS
      await Arquivos.findOneAndDelete({
        arquivo,
      });
  
      res.json({ error: false, message: 'Erro ao excluir o arquivo!' });
    } catch (err) {
      res.json({ error: true, message: err.message });
    }
  });
  
  /*
    FAZER NA #01
  */
router.delete('/:id', async (req, res) => {
    try {
      await Servico.findByIdAndUpdate(req.params.id, { status: 'E' });
      res.json({ error: false });
    } catch (err) {
      res.json({ error: true, message: err.message });
    }
  });
  
  module.exports = router;