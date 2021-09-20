import { all, takeLatest, call, put } from 'redux-saga/effects';
import types from './types';
import { updateAgendamento } from './actions';
import api from '../../../services/api';
import consts from '../../../consts';

export function* filterAgendamento({ start, end }) {
    try{
        const {date: res } = yield call(api.post, '/agendamento/filter',{
            salaoId: consts.salaoId,
            periodo: {
                inicio: start, 
                final: end,
            },
        });
        console.log(res);
        if(res.error){
            alert(res.message);
            return false;
        }
        yield put(updateAgendamento({ agendamentos: res.agendamentos }));

    } catch (err) {
        alert(err.message);
    }
}

export default all([takeLatest(types.FILTER_AGENDAMENTOS, filterAgendamento)]);