import { useEffect } from 'react';
import { Button, Drawer, Modal,Icon,Notification } from 'rsuite';
import Table from '../../components/Table';
import 'rsuite/dist/styles/rsuite-default.css';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { allAvisoVagas, updateAvisoVaga, addAvisoVaga, removeAvisoVaga } from '../../store/modules/avisoVaga/actions';
import util from '../../services/util';

const AvisoVagas = () => {
  
  const dispatch = useDispatch();
  const { avisoVagas, form, behavior, components,avisoVaga } = useSelector((state) => state.avisoVaga);

  const setComponent = (component,state) => {
      dispatch(updateAvisoVaga({
        components: { ...components, [component]: state },
      })
    )
  }
  const setAvisoVaga = (key, value) => {
    dispatch(
      updateAvisoVaga({
        avisoVaga: { ...avisoVaga, [key]: value },
      })
    );
    
  }


  const save = () => {
    if (
      !util.allFields(avisoVaga, [
          'descricao',
          
      ])
      ) {
      // DISPARAR O ALERTA
      Notification.error({
          placement: 'topStart',
          title: 'Calma lá!',
          description: 'Antes de prosseguir, preencha todos os campos!',
      });
      return false;
      }
    dispatch(addAvisoVaga());
  }; 

  const remove = () => {
    dispatch(removeAvisoVaga());
  }



  useEffect(()=>{
    dispatch(allAvisoVagas());
  },[])

  return(
    <div className="col p-5 overflow-auto h-100">
      <Drawer show={components.drawer} size="sm" onHide={() => setComponent('drawer', false)}>
        <Drawer.Body>
          <h3>{behavior === "create" ? "Criar Novo" : "Atualizar"} Aviso Vaga</h3>
          <div className="form-group col-12">
              <b className="">Descrição</b>
              <textarea
                rows="5"
                className="form-control"
                placeholder="Descrição do serviço..."
                value={avisoVaga.descricaoVaga}
                onChange={(e) => setAvisoVaga('descricaoVaga', e.target.value)}
              ></textarea>
            </div>
            <div className="row">
              <div className="form-group col-6">
                <b className="">R$ Salario</b>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Salario"
                  value={avisoVaga.salario}
                  onChange={(e) => setAvisoVaga('salario', e.target.value)}
                />
              </div>
              <div className="form-group col-6">
                <b>especialidades</b>
                <select
                  className="form-control"
                  value={avisoVaga.especialidades}
                  onChange={(e) => setAvisoVaga('especialidades', e.target.value)}
                >
                <option value="barbeiro">barbeiro</option>
                <option value="manicure">manicure</option>
                <option value="pedecure">pedecure</option>
                </select>
              </div>
            </div>
            <Button
            loading={form.saving}
            color={behavior === 'create' ? 'green' : 'primary'}
            size="lg"
            block
            onClick={() => save()}
            className="mt-3"
          >
            {behavior === 'create'? " Salvar" : "Atualizar"} Aviso Vaga
          </Button>
          {behavior === 'update' && (
            <Button
              loading={form.saving}
              color="red"
              size="lg"
              block
              onClick={() => setComponent('confirmDelete', true)}
              className="mt-1"
            >
              Remover Aviso
            </Button>
          )}  
        </Drawer.Body>
      </Drawer>

      <Modal
        show={components.confirmDelete}
        onHide={() => setComponent('confirmDelete', false)}
        size="xs"
      >
        <Modal.Body>
          <Icon
            icon="remind"
            style={{
              color: '#ffb300',
              fontSize: 24,
            }}
          />
          {'  '} Tem certeza que deseja excluir? Essa ação será irreversível!
        </Modal.Body>
        <Modal.Footer>
          <Button loading={form.saving} onClick={() => remove()} color="red">
            Sim, tenho certeza!
          </Button>
          <Button
            onClick={() => setComponent('confirmDelete', false)}
            appearance="subtle"
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>



      <div className="row">
        <div className="col-12">
          <div className="w-100 d-flex justify-content-between">
            <h2 className="mb-4 mt-0">Aviso vaga</h2>
            <div>
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => {
                  dispatch(
                    updateAvisoVaga({
                      behavior: 'create',
                    })
                  );
                  setComponent('drawer',true);
                }}
              >
                <span className="mdi mdi-plus">Novo Aviso Vaga</span>
              </button>
            </div>
          </div>
          
          <Table
            loading={form.filtering}
            data={avisoVagas} 
            config={[
              {
                label: 'Descricao da Vaga',
                key: 'descricaoVaga',
                fixed: true,
                width: 800
              },
            ]}
            actions={(avisoVaga)=> (
              <Button color="blue" size="xs">Ver informações</Button>
            )}
            onRowClick={(avisoVaga)=>{
              dispatch(updateAvisoVaga({
                behavior: 'update',
                })
              );
              dispatch(updateAvisoVaga({
                avisoVaga,
              })
            );
            setComponent('drawer',true);
            }}
          />
        </div>
      </div>
    </div>
  );
  
};

export default AvisoVagas;