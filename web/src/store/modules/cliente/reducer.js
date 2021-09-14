import produce from 'immer';
import types from './types';

const INITIAL_STATE = {
    behavior: 'create',
    components:{
        drawer:false,
        confirmDelete:false,
    },
    form:{
        filtering: false,
        disable: true,
        saving: false,
    },
    clientes: [],
    cliente:{
        email: '',
        nome: '',
        telefone: '',
        dataNascimento: '',
        sexo: 'M',
        documento: {
        tipo: 'cpf',
        numero: '',
        },
        endereco: {
        cidade: '',
        uf: '',
        cep: '',
        logradouro: '',
        numero: '',
        pais: 'BR',
        },
    },
}

function cliente(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.UPDATE_CLIENTE:{
            return produce(state, (draft) => {
                draft = { ...draft, ...action.payload };
                return draft;
            });
        }
        default: return state;
    }
};

export default cliente