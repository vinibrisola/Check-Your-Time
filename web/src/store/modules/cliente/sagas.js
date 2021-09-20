import { takeLatest, all, call, put, select } from 'redux-saga/effects';
import { updateCliente, allClientes as allClientesAction, resetCliente} from './actions';
import types from './types';
import api from '../../../services/api';
import consts from '../../../consts';

export function* allClientes(){
    
    const { form } = yield select (state => state.cliente)
    try {    
        yield put(updateCliente({ form: { ... form, filtering: true} }));
        const { data: res } = yield call(api.get,`/cliente/salao/${consts.salaoId}`);
        yield put(updateCliente({ form: { ... form, filtering: false} }));
        if(res.err){
            alert(res.message);
            return false;
        }

        yield put(updateCliente({ clientes: res.clientes }));

    } catch(err) {
        yield put(updateCliente({ form: { ... form, filtering: false} }));
        alert(err.message);
    }
}

export function* filterClientes(){
    
    const { form,cliente } = yield select (state => state.cliente)
    try {    
        yield put(updateCliente({ form: { ... form, filtering: true} }));
        const { data: res } = yield call(api.post,`/cliente/filter`,{ filters:{ email: cliente.email, status : 'A',}});
        yield put(updateCliente({ form: { ... form, filtering: false} }));
        if(res.err){
            alert(res.message);
            return false;
        }
        if(res.clientes.length > 0){
            yield put(updateCliente({ 
            cliente: res.clientes[0],    
            form: { ... form, filtering: false, disable: true} }));
        }else {
            yield put(updateCliente({ form: { ... form, disable: false} }));
            
        }

        yield put(updateCliente({ clientes: res.clientes }));

    } catch(err) {
        yield put(updateCliente({ form: { ... form, filtering: false} }));
        alert(err.message);
    }
}

export function* addCliente(){
    
    const { form,cliente,components } = yield select (state => state.cliente)
    try {    
        yield put(updateCliente({ form: { ... form, saving: true} }));
        const { data: res } = yield call(api.post,`/cliente`,{
            salaoId: consts.salaoId,
            cliente
        });
        yield put(updateCliente({ form: { ... form, saving: false} }));
        if(res.err){
            alert(res.message);
            return false;
        }
        

        yield put(allClientesAction());
        yield put(allClientesAction(updateCliente({ components: { ... form, drawer: false, confirmDelete:false} })));
        yield put(resetCliente());
    } catch(err) {
        yield put(updateCliente({ form: { ... form, saving: false} }));
        alert(err.message);
    }
}

export function* unlinkCliente(){
    
    const { form,cliente,components } = yield select (state => state.cliente)
    try {    
        yield put(updateCliente({ form: { ... form, saving: true} }));
        const { data: res } = yield call(api.delete,`/cliente/vinculo/${cliente.vinculoId}`);
        yield put(updateCliente({ form: { ... form, saving: false} }));

        if(res.err){
            alert(res.message);
            return false;
        }
        

        yield put(allClientesAction());
        yield put(allClientesAction(updateCliente({ components: { ... form, drawer: false} })));
        yield put(resetCliente());
    } catch(err) {
        yield put(updateCliente({ form: { ... form, saving: false} }));
        alert(err.message);
    }
}

export default all([
    takeLatest(types.ALL_CLIENTES, allClientes),
    takeLatest(types.FILTER_CLIENTES, filterClientes),
    takeLatest(types.ADD_CLIENTE, addCliente),
    takeLatest(types.UNLINK_CLIENTE, unlinkCliente)
    

]);