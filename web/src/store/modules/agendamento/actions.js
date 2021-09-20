import types from './types';

export function filterAgendamentos(start, end) {
  return {
    type:'@agendamento/FILTER',
    start,
    end,
  };
}


export function updateAgendamento(agendamentos) {
  return { type: types.UPDATE_AGENDAMENTO, agendamentos };
}