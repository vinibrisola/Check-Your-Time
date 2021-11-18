const express = require('express');
const mongoose = require('mongoose');
const pagarme = require('../services/pagarme');
const Cliente = require('../models/cliente');
const SalaoCliente = require('../models/relationship/salaoCliente')

const router = express.Router();

router.post('/', async (req, res) => {
  const db = mongoose.connection;
  const session = await db.startSession();
  session.startTransaction();

  try {
    const { cliente, salaoId } = req.body;
    let newCliente = null;

    const existentCliente = await Cliente.findOne({
      $or: [
        { email: cliente.email },
        { telefone: cliente.telefone },
        
      ],
    });

    if (!existentCliente) {


      const _id = mongoose.Types.ObjectId();
      

      // CRIANDO customer
      const pagarmeCustomer = await pagarme('/customers', {
        external_id: _id,
        name: cliente.nome,
        type:cliente.documento.tipo === 'cpf' ? 'individual' : 'corporation',
        country: cliente.endereco.pais,
        email: cliente.email,
        documents: [
          {
            type: cliente.documento.tipo,
            number:cliente.documento.numero
          },
        ],
        phone_numbers: ['+55' + cliente.telefone],
        birthday: cliente.dataNascimento,
      });

      if (pagarmeCustomer.error) {
        throw pagarmeCustomer;
      }

      newCliente = await Cliente({
        _id,
        ...cliente,
        customerId: pagarmeCustomer.data.id,
      }).save({ session });
    }

    const clienteId = existentCliente
      ? existentCliente._id
      : newCliente._id;

    // RELAÇÃO COM O SALÃO
    const existentRelationship = await SalaoCliente.findOne({
      salaoId,
      clienteId,
      status: {$ne: 'E'},
    });

    if (!existentRelationship) {
      await new SalaoCliente({
        salaoId,
        clienteId,
      }).save({ session });
    }

    if (existentCliente) {
      await SalaoCliente.findOneAndUpdate(
        {
          salaoId,
          clienteId,
        },
        { status: 'A' },
        { session }
      );
    }

   
    await session.commitTransaction();
    session.endSession();

    if (existentRelationship && existentCliente) {
      res.json({ error: true, message: 'Cliente já cadastrado!' });
    } else {
      res.json({ error: false });
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.json({ error: true, message: err.message });
  }
});

router.post('/filter', async (req, res) => {
  try {
    
    const clientes = await Cliente.find(req.body.filters);
    res.json({ error: false, clientes });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.get('/salao/:salaoId', async (req, res) => {
  try {
    const { salaoId } = req.params;

    const clientes = await SalaoCliente.find({
      salaoId,
      status: { $ne: 'E' },
    })
      .populate('clienteId')
      .select('clienteId dataCadastro');
    
    res.json({
      error: false,
      clientes: clientes.map((vinculo) => ({
        ...vinculo.clienteId._doc,
        vinculoId: vinculo._id,
        dataCadastro: vinculo.dataCadastro,
      })),
    });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.delete('/vinculo/:id', async (req, res) => {
  try {
    await SalaoCliente.findByIdAndUpdate(req.params.id, { status: 'E' });
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

module.exports = router;