import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import "./styles.css";

import Header from './components/Header';
import Sidebar from './components/Sidebar';

import Agendamentos from "./pages/Agendamentos";
import Clientes from './pages/Clientes';


const Routes = () => {
    return(
    <>
        <Header />
        <div className="container-fluid h-100">
            <div className="row h-100">
                <Router>
                    <Sidebar />
                    <Switch>
                        <Route path="/" exact components={Agendamentos}>
                            <Agendamentos />
                        </Route>
                        <Route path="/clientes" exact components={Clientes} >
                            <Clientes />
                        </Route>
                    </Switch>
                </Router>
            </div>
        </div>
    </>
    );
};

export default Routes;