import { combineReducers } from "redux";

import cliente from './modules/cliente/reducer';
import agendamento from './modules/agendamento/reducer';
import colaborador from './modules/colaborador/reducer';
import servico from './modules/servico/reducer';
import horario from './modules/horario/reducer';
import avisoVaga from "./modules/avisoVaga/reducer";
export default combineReducers({
    agendamento, cliente, colaborador, servico, horario, avisoVaga
});