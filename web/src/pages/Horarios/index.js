import { useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Drawer,TagPicker,DatePicker,Button,Modal,Icon,Notification } from 'rsuite';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { allHorarios,allServicos,updateHorario,filterColaboradores,addHorario,removeHorario } from '../../store/modules/horario/actions';
import { useDispatch, useSelector} from 'react-redux';
import util from '../../services/util';
import moment from 'moment';
import 'moment/locale/pt-br';
moment.locale('pt-br');
const localizer = momentLocalizer(moment);


const Horarios = () => {

const dispatch = useDispatch();
const { horarios, form, servicos ,colaboradores, behavior, components,horario} = useSelector((state) => state.horario);


const diasSemanaData = [
        new Date(2021, 3, 11, 0, 0, 0, 0),
        new Date(2021, 3, 12, 0, 0, 0, 0),
        new Date(2021, 3, 13, 0, 0, 0, 0),
        new Date(2021, 3, 14, 0, 0, 0, 0),
        new Date(2021, 3, 15, 0, 0, 0, 0),
        new Date(2021, 3, 16, 0, 0, 0, 0),
        new Date(2021, 3, 17, 0, 0, 0, 0),
];


const diasDaSemana = [
    'domingo',
    'segunda-feira',
    'terça-feira',
    'quarta-feira',
    'quinta-feira',
    'sexta-feira',
    'sábado',
  ];


const formatEvents = horarios.map((horario, index) => horario.dias.map((dia)=> ({
    resource: horario,
    title: `${horario.especialidades.length} espec. e ${horario.colaboradores.length} colab.`,
    start: new Date(
        diasSemanaData[dia].setHours(
            parseInt(moment(horario.inicio).format('HH')),
            parseInt(moment(horario.inicio).format('mm'))
        )
    ),
    end: new Date(
        diasSemanaData[dia].setHours(
            parseInt(moment(horario.fim).format('HH')),
            parseInt(moment(horario.fim).format('mm'))
        )
    ),
}))
).flat();



const setComponent = (component, state) => {
    dispatch(
        updateHorario({
            components: { ...components, [component]: state },
        })
    );
};
const setHorario = (key, value) => {
    dispatch(
        updateHorario({
        horario: { ...horario, [key]: value },
        })
    );
};
const save = () => {
if (
    !util.allFields(horario, [
        'dias',
        'inicio',
        'fim',
        'especialidades',
        'colaboradores',
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
    dispatch(addHorario());
};

const remove = () =>{
    dispatch(removeHorario());
}

useEffect(()=>{
    dispatch(allHorarios());
    dispatch(allServicos());
},[]);

useEffect(()=>{
    dispatch(filterColaboradores());
},[horario.especialidades])


    return (
        <div className="col p-5 overflow-auto h-100">
            <Drawer
                show={components.drawer}
                size="sm"
                onHide={() => setComponent('drawer', false)}
            >
                <Drawer.Body>
                <h3>{behavior === "create" ? "Criar novo" : "Atualizar"}horario de atendimento</h3>
                <div className="row mt-3">
                    <div className="col-12">
                    <b>Dias da semana</b>
                    <TagPicker
                        size="lg"
                        block
                        value={horario.dias}
                        data={diasDaSemana.map((label, value) => ({ label, value }))}
                        onChange={(value) => {
                        setHorario('dias', value);
                        }}
                    />
                    </div>
                    <div className="col-6 mt-3">
                    <b className="d-block">Horário Inicial</b>
                    <DatePicker
                        block
                        format="HH:mm"
                        hideMinutes={(min) => ![0, 30].includes(min)}
                        value={horario.inicio}
                        onChange={(e) => {
                        setHorario('inicio', e);
                        }}
                    />
                    </div>
                    <div className="col-6 mt-3">
                    <b className="d-block">Horário Final</b>
                    <DatePicker
                        block
                        format="HH:mm"
                        hideMinutes={(min) => ![0, 30].includes(min)}
                        value={horario.fim}
                        onChange={(e) => {
                        setHorario('fim', e);
                        }}
                    />
                    </div>
                    <div className="col-12 mt-3">
                    <b>Especialidades disponíveis</b>
                    <TagPicker
                        size="lg"
                        block
                        data={servicos}
                        value={horario.especialidades}
                        onChange={(e) => {
                        setHorario('especialidades', e);
                        }}
                    />
                    </div>
                    <div className="col-12 mt-3">
                    <b>Colaboradores disponíveis</b>
                    <TagPicker
                        size="lg"
                        block
                        data={colaboradores}
                        value={horario.colaboradores}
                        onChange={(e) => {
                        setHorario('colaboradores', e);
                        }}
                    />
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
                    Salvar Horário de Atendimento
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
                    Remover Horário de Atendimento
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
                <div className="col-12 calendario">
                    <div className="w-100 d-flex justify-content-between">
                        <h2 className="mb-4 mt-0">Horario de Atendimento</h2>
                        <div>
                            <button 
                                className="btn btn-primary btn-lg"
                                onClick={() => {
                                  dispatch(
                                      updateHorario({
                                          behavior: 'create',
                                      })
                                  );
                                  setComponent('drawer', true);
                                }}
                            >
                            <span className="mdi mdi-plus">Novo Horario</span>
                            </button>
                        </div>
                    </div>
                    <Calendar
                    onSelectEvent={ e => {
                        dispatch(
                            updateHorario({
                                behavior: 'update',
                            })
                        );
                        dispatch(
                            updateHorario({
                                horario: e.resource,
                            })
                        );
                        setComponent('drawer',true);
                    }}
                    localizer={localizer}
                    toolbar={false}
                    popup
                    selectable
                    formats={{
                        dateFormat: 'dd',
                        dayFormat: (date,culture,localizer) => localizer.format(date, 'dddd',culture)
                    }}
                    onSelectSlot={(slotInfo) =>{
                        const { start, end } = slotInfo;
                        dispatch(
                            updateHorario({
                                behavior: 'crate',
                                horario: {
                                    ...horario,dias:[moment(start).day()],
                                    inicio: start,
                                    fim: end,
                                },
                            })
                        );
                        setComponent('drawer', true);
                    }}
                    events={formatEvents}
                    date={diasSemanaData[moment().day()]}
                    view="week"
                    style={{ height:600 }}
                    />            
                </div>
            </div>
        </div>


        
    );
}

export default Horarios;