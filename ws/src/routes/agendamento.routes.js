const express = require('express');
const router = express.Router();
const Horario = require('../models/horario');
const Agendamento = require('../models/agendamento');
const Cliente = require('../models/cliente');
const Salao = require('../models/salao');
const Servico = require('../models/servico');
const Colaborador = require('../models/colaborador');
const moment = require('moment');
const mongoose = require('mongoose');
const _ = require('lodash');
const pagarme = require('../services/pagarme');
const keys = require('../data/keys.json');
const util = require('../util');

router.post('/filter', async (req, res) => {
  try {
    const { periodo, salaoId } = req.body;

    const agendamentos = await Agendamento.find({
      
      salaoId,
      data: {
        $gte: moment(periodo.start).startOf('day'),
        $lte: moment(periodo.end).endOf('day'),
      },
    }).populate([
      { path: 'servicoId', select: 'titulo duracao' },
      { path: 'colaboradorId', select: 'nome' },
      { path: 'clienteId', select: 'nome' },
    ]);

    res.json({ error: false, agendamentos });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.post('/', async (req, res) => {
  const db = mongoose.connection;
  const session = await db.startSession();
  session.startTransaction();

  try {
    const { clienteId, salaoId, servicoId, colaboradorId } = req.body;

    const cliente = await Cliente.findById(clienteId).select(
      'nome endereco customerId'
    );
    const salao = await Salao.findById(salaoId).select('recipientId');

    const servico = await Servico.findById(servicoId).select(
      'preco titulo comissao'
    );
    const colaborador = await Colaborador.findById(colaboradorId).select(
      'recipientId'
    );

    // PREÇO TOTAL DA TRANSAÇÃO
    const precoFinal = util.toCents(servico.preco) * 100;

    // REGRAS DE SPLIT DO COLABORADOR
    const colaboradoreSplitRule = {
      recipient_id: colaborador.recipientId,
      amount: parseInt(precoFinal * (servico.comissao / 100)),
    };

    // CRIANDO PAGAMENTO MESTRE
    const createPayment = await pagarme('/transactions', {
      amount: precoFinal,
      card_number: '4111111111111111',
      card_cvv: '123',
      card_expiration_date: '0922',
      card_holder_name: 'Morpheus Fishburne',
     
      customer: {
        id: cliente.customerId,
      },
      billing: {
        // SUBISTITUIR COM OS DADOS DO CLIENTE
        name: cliente.nome,
        address: {
          country: cliente.endereco.pais,
          state: cliente.endereco.uf,
          city: cliente.endereco.cidade,
          street: cliente.endereco.logradouro,
          street_number: cliente.endereco.numero,
          zipcode: cliente.endereco.cep,
        },
      },
      items: [
        {
          id: servicoId,
          title: servico.titulo,
          unit_price: precoFinal,
          quantity: 1,
          tangible: false,
        },
      ],
      split_rules: [
        // TAXA DO SALÃO
        {
          recipient_id: salao.recipientId,
          amount: precoFinal - keys.app_fee - colaboradoreSplitRule.amount,
        },
        // TAXAS DOS ESPECIALISTAS / COLABORADORES
        colaboradoreSplitRule,
        // TAXA DO APP
        {
          recipient_id: keys.recipient_id,
          amount: keys.app_fee,
          charge_processing_fee: false,
        },
      ],
    });

    if (createPayment.error) {
      throw { message: createPayment.message };
    }

    // CRIAR O AGENDAMENTOS E AS TRANSAÇÕES
    // TRANSFORMAR EM INSERT MANY
    let agendamento = req.body;
    agendamento = {
      ...agendamento,
      transactionId: createPayment.data.id,
      comissao: servico.comissao,
      valor: servico.preco,
    };
    await new Agendamento(agendamento).save();

    await session.commitTransaction();
    session.endSession();
    res.json({ error: false, agendamento: createPayment.data });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.json({ error: true, message: err.message });
  }
});

router.post('/dias-disponiveis', async (req, res) => {
  try {
    const { data, salaoId, servicoId } = req.body;
    const horarios = await Horario.find({ salaoId });
    const servico = await Servico.findById(servicoId).select('duracao');
    let colaboradores = [];
    let agenda = [];
    let lastDay = moment(data);

    // DURAÇÃO DO SERVIÇO
    const servicoMinutos = util.hourToMinutes(
      moment(servico.duracao).format('HH:mm')
    );
    const servicoSlots = util.sliceMinutes(
      servico.duracao,
      moment(servico.duracao).add(servicoMinutos, 'minutes'),
      util.SLOT_DURATION,
    ).length;

    for (let i = 0; i <= 365 && agenda.length <= 7; i++) {
      const espacosValidos = horarios.filter((horario) => {
        // VERIFICAR DIA DA SEMANA
        const diaSemanaDisponivel = horario.dias.includes(moment(lastDay).day());

        // VERIFICAR ESPECIALIDADE DISPONÍVEL
        const servicosDisponiveil = horario.especialidades.includes(servicoId);

        return diaSemanaDisponivel && servicosDisponiveil;
      });

      if (espacosValidos.length > 0) {
        let todosHorariosDia = {};
        for (let espaco of espacosValidos) {
          for (let colaboradorId of espaco.colaboradores) {
            if (!todosHorariosDia[colaboradorId]) {
              todosHorariosDia[colaboradorId] = [];
            }
            todosHorariosDia[colaboradorId] = [
              ...todosHorariosDia[colaboradorId],
              ...util.sliceMinutes(
                util.mergeDateTime(lastDay, espaco.inicio),
                util.mergeDateTime(lastDay, espaco.fim),
                util.SLOT_DURATION
              ),
            ];
          }
        }

        // SE TODOS OS ESPECIALISTAS DISPONÍVEIS ESTIVEREM OCUPADOS NO HORÁRIO, REMOVER
        for (let colaboradorId of Object.keys(todosHorariosDia)) {
          // LER AGENDAMENTOS DAQUELE ESPECIALISTA NAQUELE DIA
          const agendamentos = await Agendamento.find({
            colaboradorId,
            data: {
              $gte: moment(lastDay).startOf('day'),
              $lte: moment(lastDay).endOf('day'),
            },
          }).select('data servicoId -_id').populate('servicoId', 'duracao');

          // RECUPERANDO HORÁRIOS OCUPADOS
          let horariosOcupado = agendamentos.map((agendamento) => ({
            inicio: moment(agendamento.data),
            fim: moment(agendamento.data).add(util.hourToMinutes(moment(agendamento.servicoId.duracao).format('HH:mm')), 'minutes'),
          }));

          horariosOcupado = horariosOcupado
            .map((horario) =>
              util.sliceMinutes(horario.inicio, horario.final, util.SLOT_DURATION)).flat();

          // REMOVENDO TODOS OS HORÁRIOS QUE ESTÃO OCUPADOS
          let horariosLivres = util.splitByValue(
            _.uniq(
              todosHorariosDia[colaboradorId].map((horarioLivre) => {
                return horariosOcupado.includes(horarioLivre) ? '-' : horarioLivre;
              })
            ),
            '-'
          ).filter((space) => space.length > 0);

          // VERIFICANDO SE NOS HORÁRIOS CONTINUOS EXISTE SPAÇO SUFICIENTE NO SLOT
          horariosLivres = horariosLivres
            .filter((horarios) => horarios.length >= servicoSlots);

          /* VERIFICANDO OS HORÁRIOS DENTRO DO SLOT 
            QUE TENHAM A CONTINUIDADE NECESSÁRIA DO SERVIÇO
          */
          horariosLivres = horariosLivres.map((slot) =>
            slot.filter(
              (horario, index) => slot.length - index >= servicoSlots
            )
          ).flat();

          // SEPARANDO 2 EM 2
          horariosLivres = _.chunk(horariosLivres, 2);

          // REMOVENDO O COLABORADOR DO DIA, CASO NÃO TENHA ESPAÇOS NA AGENDA
          if (horariosLivres.length === 0) {
            todosHorariosDia = _.omit(todosHorariosDia, colaboradorId);
          } else {
            todosHorariosDia[colaboradorId] = horariosLivres;
          }
        }

        // VERIFICANDO SE TEM ESPECIALISTA COMA AGENDA NAQUELE DIA
        const totalEspecialistas = Object.keys(todosHorariosDia).length;

        if (totalEspecialistas > 0) {
          colaboradores.push(Object.keys(todosHorariosDia));
          agenda.push({
            [moment(lastDay).format('YYYY-MM-DD')]: todosHorariosDia,
          });
        }
      }

      lastDay = moment(lastDay).add(1, 'day');
    }

    colaboradores = _.uniq(colaboradores.flat());
    
    colaboradores = await Colaborador.find({
      _id: { $in: colaboradores },
    }).select('nome foto');

    colaboradores = colaboradores.map((c) => ({
      ...c._doc,
      nome: c.nome.split(' ')[0],
    }));

    res.json({ error: false, colaboradores, agenda });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

module.exports = router;
