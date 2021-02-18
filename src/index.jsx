import React, { Suspense } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './_helpers';
import { App } from './_pages/App';
import "./_components/i18n";

render(
	<React.StrictMode>
    <Provider store={store}>
    <Suspense fallback={<div>Loading...</div>}>
        <App />
    </Suspense>
    </Provider>
    </React.StrictMode>,
    document.getElementById('app')
);


