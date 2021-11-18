
import { Link, withRouter } from "react-router-dom";
import logo from '../../assets/logopreto.png';


const Sidebar = ({location}) => {
    return (
      <sidebar className="col-md-2 col-2" >
        <img src={logo} class="img-fluid px-5 py-6" />
        <ul className="p-0 m-0">
          <li>
            <Link
              to="/"
              className={location.pathname === '/' ? 'active' : ''}
            >
              <span class="mdi mdi-calendar-check"></span>
              <text>Agendamentos</text>
            </Link>
          </li>
          <li>
            <Link
              to="/clientes"
              className={location.pathname === '/clientes' ? 'active' : ''}
            >
              <span class="mdi mdi-account-multiple"></span>
              <text>Clientes</text>
            </Link>
          </li>
          <li>
            <Link
              to="/colaboradores"
              className={location.pathname === '/colaboradores' ? 'active' : ''}
            >
              <span class="mdi mdi-card-account-details-outline"></span>
              <text>Colaboradores</text>
            </Link>
          </li>
          <li>
            <Link
              to="/servicos"
              className={
                location.pathname === '/servicos' ? 'active' : ''
              }
            >
              <span class="mdi mdi-auto-fix"></span>
              <text>Serviços</text>
            </Link>
          </li>
          <li>
            <Link
              to="/horarios"
              className={
                location.pathname === '/horarios'
                  ? 'active'
                  : ''
              }
            >
              <span class="mdi mdi-clock-check-outline"></span>
              <text>Horarios</text>
            </Link>
          </li>
          <li>
            <Link
              to="/vagas"
              className={
                location.pathname === '/vagas'
                  ? 'active'
                  : ''
              }
            >
              <span class="mdi mdi-newspaper"></span>
              <text>Aviso de vagas</text>
            </Link>
          </li>
          
        </ul>
      </sidebar>
    );
  };
  
  export default withRouter(Sidebar);