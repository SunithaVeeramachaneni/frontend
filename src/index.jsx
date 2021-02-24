import React, { Suspense } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './_helpers';
import { App } from './_pages/App';
import "./_components/i18n";
import "./assets/css/material-dashboard-react.css?v=1.9.0";

import { I18nextProvider } from "react-i18next";
import i18n from "./_components/i18n";

render(
	<Provider store={store}>
       <Suspense fallback={<div>Loading...</div>}>
           <I18nextProvider i18n={i18n}>
              <App />
            </I18nextProvider>
        </Suspense>
    </Provider>,
    document.getElementById('app')
);


