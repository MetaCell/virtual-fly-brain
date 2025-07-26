import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
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
