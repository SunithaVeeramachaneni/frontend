import React, { useEffect, useState } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { history } from '../../_helpers';
import { alertActions } from '../../_actions';
import { PrivateRoute } from '../../_components';
import { Home } from '../Home';
import { Login } from '../Login';
import { Register } from '../Register';
import Admin from "../../layouts/Admin"
import { createBrowserHistory } from "history";

const hist = createBrowserHistory();

function App() {
    const alert = useSelector(state => state.alert);
    const dispatch = useDispatch();

    useEffect(() => {
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });
    }, []);



    return (
        <div>
            {/* <div className="container">
                <div className="col-md-8 offset-md-2"> */}
                    {alert.message &&
                        <div className={`alert ${alert.type}`}>{alert.message}</div>
                    }
                    {/* <Router history={history}>
                        <Switch>
                            <PrivateRoute exact path="/" component={Admin} />
                            <Route path="/login" component={Login} />
                            <Route path="/register" component={Register} />
                            <Route path="/layout" component={Admin} />
                            <Redirect from="*" to="/" />
                        </Switch>
                    </Router> */}
                    <Router history={history}>
                        <Switch>
                        <PrivateRoute exact path="/admin/dashboard" component={Admin} />
                        <Route path="/admin/dashboard" component={Admin} />
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <Redirect from="/" to="/admin/dashboard" />
                        </Switch>
                    </Router>
                {/* </div>
            </div> */}
        </div>
    );
}

export { App };
