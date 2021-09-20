import { useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import util from '../../util';
import { filterAgendamentos } from '../../store/modules/agendamento/actions'

const localizer =momentLocalizer(moment);



const Agendamentos = () => {
  const dispatch = useDispatch();
  const { agendamentos } = useSelector((state) => state.agendamento );


  const formatEventos = agendamentos.map((agendamento) => ({
    title: `${agendamento.servicoId.titulo} - ${agendamento.clienteId.nome} - ${agendamento.colaboradorId.nome}`,
    start: moment(agendamento.data).toDate(),
     end: moment(agendamento.data).add(util.hourToMinutes(moment(agendamento.servicoId.ducaracao).format('HH:mm')), 'minutes').toDate
  }));

  const formatRange = (periodo) => {
    let finalRange = {};
    if (Array.isArray(periodo)){
      finalRange = {
        start: moment(periodo[0]).format('YYYY-MM-DD'),
        end: moment(periodo[periodo.length -1]).format('YYYY-MM-DD'),
      };
    } else{
      finalRange = {
        start: moment(periodo.start).formart('YYYY-MM-DD'),
        end: moment(periodo.end).format('YYYY-MM-DD'),
      }
    }

    return finalRange;
  }

  useEffect(() => {
    dispatch(filterAgendamentos( )
    );
  },[]);

  return (
    <div className="col p-5 overflow-auto h-100">
      <div className="row">
        <div className="calendario col-12">
          <h2 className="mb-4 mt-0">Agendamentos</h2>
          <Calendar
            localizer={localizer}
            onRangeChange={(periodo) => {
              const { start, end } = formatRange(periodo)
              dispatch(filterAgendamentos(start, end )
              );
            }}
            events={formatEventos}
            defaultView="week"
            selectable
            popup
            style={{ height: 600 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Agendamentos;
