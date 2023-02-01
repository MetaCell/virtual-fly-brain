import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import './index.css';
import App from './App';
import {Provider} from 'react-redux'
import store from './store';
const appContext = React.createContext();
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store} context={appContext}>
    <App/>
  </Provider>,
);

reportWebVitals();
