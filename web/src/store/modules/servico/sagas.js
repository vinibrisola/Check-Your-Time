import { takeLatest, all, call, put, select } from 'redux-saga/effects';
import { updateServico,allServicos as allServicosAction,resetServico, } from './actions';
import types from './types';
import api from '../../../services/api';
import consts from '../../../consts';
import { notification } from '../../../services/rsuite';



export function* allServicos(){
  const { form } = yield select((state) => state.servico);
  try{
    yield put (updateServico({ form: {...form, filtering: true}}));
    const { data: res } = yield call(api.get,`/servico/salao/${consts.salaoId}`);
    yield put (updateServico({ form: {...form, filtering: false}}));
    if (res.error) {
      // ALERT DO RSUITE
      notification('error', {
        placement: 'topStart',
        title: 'Ops...',
        description: res.message,
      });
      return false;
    }

    yield put (updateServico({ servicos: res.servicos}));

  } catch (err) {
    yield put (updateServico({ form: {...form, filtering: false}}));
    notification('error', {
      placement: 'topStart',
      title: 'Ops...',
      description: err.message,
    });
  }
}

export function* addServico(){
  const { form, servico,components, behavior } = yield select((state) => state.servico);
  try{
    yield put (updateServico({ form: {...form, saving: true}}));
    
   
    const formData = new FormData();
    formData.append('servico', JSON.stringify({ ...servico, salaoId: consts.salaoId }));
    formData.append('salaoId', consts.salaoId);
    servico.arquivos.map((a,i)=>{
      formData.append(`arquivo_${i}`, a);
    });

    const { data: res } = yield call(
      api[behavior === "create" ? "post" : "put"], 
      behavior === "create" ? `/servico` : `/servico/${servico._id}`,formData); 
    
    
    
    yield put (updateServico({ form: {...form, saving: false}}));
    
    if (res.error) {
      // ALERT DO RSUITE
      notification('error', {
        placement: 'topStart',
        title: 'Ops...',
        description: res.message,
      });
      return false;
    }
    
    yield put(allServicosAction());
    yield put (updateServico({ components: {...components, drawer: false}}));
    yield put(resetServico());

    notification('success', {
      placement: 'topStart',
      title: 'Feitoooo!!',
      description: 'Serviço salvo com sucesso!',
    });
  } catch (err) {
    yield put (updateServico({ form: {...form, saving: false}}));
    notification('error', {
      placement: 'topStart',
      title: 'Ops...',
      description: err.message,
    });
  }
}
export function* removeServico(){
  const { form, servico,components } = yield select((state) => state.servico);
  try{
    yield put (updateServico({ form: {...form, saving: true}}));
    const { data: res } = yield call(api.delete,`/servico/${servico._id}`);
    yield put (updateServico({ form: {...form, saving: false}}));
    
    if (res.error) {
      // ALERT DO RSUITE
      notification('error', {
        placement: 'topStart',
        title: 'Ops...',
        description: res.message,
      });
      return false;
    }
    
    yield put(allServicosAction());
    yield put (updateServico({ components: {...components, drawer: false, confirmDelete: false}}));
    yield put(resetServico());
    notification('success', {
      placement: 'topStart',
      title: 'Feitoooo!!',
      description: 'Serviço salvo com sucesso!',
    });
  } catch (err) {
    yield put (updateServico({ form: {...form, saving: false}}));
    notification('error', {
      placement: 'topStart',
      title: 'Ops...',
      description: err.message,
    });
  }
}
export function* removeArquivo({key}){
  const { form } = yield select((state) => state.servico);
  try{
    yield put (updateServico({ form: {...form, saving: true}}));
    const { data: res } = yield call(api.post,`/servico/delete-arquivo/`, {key});
    yield put (updateServico({ form: {...form, saving: false}}));
    
    if (res.error) {
      // ALERT DO RSUITE
      notification('error', {
        placement: 'topStart',
        title: 'Ops...',
        description: res.message,
      });
      return false;
    }
    
  } catch (err) {
    yield put (updateServico({ form: {...form, saving: false}}));
    notification('error', {
      placement: 'topStart',
      title: 'Ops...',
      description: err.message,
    });
  }
}


export default all([
  takeLatest(types.ALL_SERVICOS,allServicos),
  takeLatest(types.ADD_SERVICO,addServico),
  takeLatest(types.REMOVE_SERVICO,removeServico),
  takeLatest(types.REMOVE_ARQUIVO, removeArquivo),
]);