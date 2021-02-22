import React, { Suspense } from 'react';
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import { store } from './_helpers';
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import "./_components/i18n";


import Admin from "./layouts/Admin";
import {Login} from "./pages/Login";
import {Register} from './pages/Register'

import "./assets/css/material-dashboard-react.css?v=1.9.0";

import { I18nextProvider } from "react-i18next";

import i18n from "./_components/i18n";

const hist = createBrowserHistory();

ReactDOM.render(
  <Provider store={store}>
  <Suspense fallback={<div>Loading...</div>}>
  <I18nextProvider i18n={i18n}>
  <Router history={hist}>
    <Switch>
      <Route path="/admin" component={Admin} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Redirect from="/" to="/admin/dashboard" />
    </Switch>
  </Router>
  </I18nextProvider>
  </Suspense>
  </Provider>,
  document.getElementById("root")
);

{/* <React.StrictMode>
    <Provider store={store}>
        <Suspense fallback={<div>Loading...</div>}>
              <Router history={hist}>
              <Switch>
                <Route path="/admin" component={Admin} />
                <Route path="/login" component={Login} />
                <Redirect from="/" to="/admin/dashboard" />
              </Switch>
            </Router>
        </Suspense>
    </Provider>
</React.StrictMode>,
    document.getElementById('app') */}

