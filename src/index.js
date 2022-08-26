import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {app} from './initApp';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
const store = app.getReduxStore();

root.render(
  <Provider store={store}>
    <App/>
  </Provider>,
);

reportWebVitals();
