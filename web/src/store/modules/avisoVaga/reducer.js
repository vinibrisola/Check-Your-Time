import produce from 'immer';
import types from './types';

const INITIAL_STATE = {
  behavior: "create",
  components: {
    drawer: false,
    confirmDelete: false
  },
  form: {
    filtering: false,
    disabled: true,
    saving: false,
  },
  avisoVagas: [],
  avisoVaga: {
    descricaoVaga: '',
    especialidades: 'barbeiro'
  },
}

function avisovaga(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.UPDATE_AVISOVAGA: {
      return produce(state, (draft) => {
        draft = { ...draft, ...action.payload };
        return draft;
      })
    }
    case types.RESET_AVISOVAGA: {
      return produce(state, (draft) => {
        draft.avisovaga = INITIAL_STATE.avisovaga;
        return draft;
      })
    }
    default: return state;
  }
}


export default avisovaga;