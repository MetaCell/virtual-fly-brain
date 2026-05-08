import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

// Suppress legacy childContextTypes warning from griddle-react/recompose (third-party, no fix available)
const _origConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('childContextTypes')) return;
  _origConsoleError(...args);
};
import './index.css';
import App from './App';
import { Provider } from 'react-redux'
import store from './store';
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from './theme/index';

const root = ReactDOM.createRoot(document.getElementById('root'));

function clearAppStorage() {
  Object.keys(localStorage).forEach(key => {
    localStorage.removeItem(key);
  });
  Object.keys(sessionStorage).forEach(key => {
    sessionStorage.removeItem(key);
  });
}

clearAppStorage();

root.render(
  <Provider store={store} >
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Provider>,
);

reportWebVitals();
