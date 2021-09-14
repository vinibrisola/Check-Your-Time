import { combineReducers } from "redux";

import cliente from './modules/cliente/reducer';
import agendamento from './modules/agendamento/reducer';

export default combineReducers({
    agendamento,cliente
});