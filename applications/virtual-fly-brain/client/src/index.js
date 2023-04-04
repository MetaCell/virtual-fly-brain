import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import reportWebVitals from './reportWebVitals';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'
import store from './store';
import theme from './theme';

// const { initGeppetto } = require('@metacell/geppetto-meta-client/GEPPETTO');
// initGeppetto(false, true);
require('./css/base.less');
require('./css/VFBMain.less');

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <div>
    <React.StrictMode>
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </Provider>
  </React.StrictMode>,
  </div>,
);

reportWebVitals();

