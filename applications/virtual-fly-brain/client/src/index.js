import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {Application} from './Application';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux'
import { loadQuery } from './reducers/actions/loadQuery';

const store = Application();

const root = ReactDOM.createRoot(document.getElementById('root'));
store.dispatch(loadQuery('VFB_00101567'));

root.render(
  <Provider store={store}>
    <App/>
  </Provider>,
);

reportWebVitals();
