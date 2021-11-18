import { takeLatest, all, call, put, select } from 'redux-saga/effects';
import { updateAvisoVaga,allAvisoVagas as allAvisoVagasAction,resetAvisoVaga } from './actions';
import types from './types';
import api from '../../../services/api';
import consts from '../../../consts';
import { notification } from '../../../services/rsuite';



export function* allAvisoVagas(){
  const { form } = yield select((state) => state.avisoVaga);
  try{
    yield put(updateAvisoVaga({ form: {...form, filtering: true}}));
    const { data: res } = yield call(api.get,`/avisoVaga/salao/${consts.salaoId}`);
    yield put(updateAvisoVaga({ form: {...form, filtering: false}}));
    
    
    if (res.error) {
      // ALERT DO RSUITE
      notification('error', {
        placement: 'topStart',
        title: 'Ops...',
        description: res.message,
      });
      return false;
    }

    yield put(updateAvisoVaga({ avisoVagas: res.avisoVaga}));

  } catch (err) {
    yield put(updateAvisoVaga({ form: {...form, filtering: false}}));
    notification('error', {
      placement: 'topStart',
      title: 'Ops...',
      description: err.message,
    });


  }
}
export function* addAvisoVaga(){
  const { form,avisoVaga,components, behavior } = yield select((state) => state.avisoVaga);
  try{
    yield put(updateAvisoVaga({ form: {...form, saving: true}}));
    let res = {};
    if(behavior === "create") {
      const response = yield call(api.post,`/avisoVaga`,{ ...avisoVaga,salaoId: consts.salaoId});
      res = response.data;
    } else {
      const response = yield call(api.put,`/avisoVaga/${avisoVaga._id}`,avisoVaga);
      res = response.data;
    }
    yield put(updateAvisoVaga({ form: {...form, saving: false}}));
    if (res.error) {
      // ALERT DO RSUITE
      notification('error', {
        placement: 'topStart',
        title: 'Ops...',
        description: res.message,
      });
      return false;
    }
    
    yield put(allAvisoVagasAction());
    yield put(updateAvisoVaga({ components: {...components, drawer: false}}));
    yield put(resetAvisoVaga());
    notification('success', {
      placement: 'topStart',
      title: 'Tudo certo',
      description: 'O Aviso de vaga foi cadastrado com sucesso!',
    });
  } catch (err) {
    yield put(updateAvisoVaga({ form: {...form, saving: false}}));
    notification('error', {
      placement: 'topStart',
      title: 'Ops...',
      description: err.message,
    });
  }
}
export function* removeAvisoVaga(){
  const { form, avisoVaga ,components } = yield select((state) => state.avisoVaga);
  try{
    yield put(updateAvisoVaga({ form: {...form, saving: true}}));
    const { data: res } = yield call(api.delete,`/avisoVaga/${avisoVaga._id}`);
    yield put(updateAvisoVaga({ form: {...form, saving: false}}));
    
    if (res.error) {
      // ALERT DO RSUITE
      notification('error', {
        placement: 'topStart',
        title: 'Ops...',
        description: res.message,
      });
      return false;
    }
    
    yield put(allAvisoVagasAction());
    yield put(updateAvisoVaga({ components: {...components, drawer: false, confirmDelete: false}}));
    yield put(resetAvisoVaga());
    notification('success', {
      placement: 'topStart',
      title: 'Tudo certo',
      description: 'O aviso de vaga foi excluido com sucesso!',
    });
  } catch (err) {
    yield put(updateAvisoVaga({ form: {...form, saving: false}}));
    notification('error', {
      placement: 'topStart',
      title: 'Ops...',
      description: err.message,
    });
  }
}



export default all([
  takeLatest(types.ALL_AVISOVAGAS,allAvisoVagas),
  takeLatest(types.ADD_AVISOVAGA,addAvisoVaga),
  takeLatest(types.REMOVE_AVISOVAGA,removeAvisoVaga),
]);