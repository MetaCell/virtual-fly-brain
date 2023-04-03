import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'
import store from './store';
console.log(store)

require('./css/base.less');
require('./css/VFBMain.less');
// initGeppetto(false, true);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store} >
    <App/>
  </Provider>,
);

reportWebVitals();

