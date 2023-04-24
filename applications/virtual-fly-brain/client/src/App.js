import './App.css';
import Main from './components/Main'
import React from 'react';
import { termInfoById } from './reducers/actions/termInfo';
import { queryString } from './utils/queryString';
import { blue, orange } from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';
import {useSelector} from 'react-redux'
import { initFileWithoutReading } from './reducers/actions/readFile';
import Ajv from 'ajv'
import { termInfoSchemma } from './schemma/termInfo';
import {
  createTheme,
  responsiveFontSizes,
  MuiThemeProvider,
} from '@material-ui/core/styles';

const App = () => { 

  const isLoading = useSelector(state => state.termInfo.isLoading)
  const termInfoData = useSelector(state => state.termInfo.termInfoData)

  if(!isLoading && !termInfoData)
  {
    const id = queryString("id")

    if (id) 
      termInfoById(id);
  }
  if ( termInfoData ) // load initial 3d model TODO: proper instance, class treatement
  {
    //validate schemma

    const ajv = new Ajv(); // create an Ajv instance
    const validate = ajv.compile(termInfoSchemma); // compile the schema

    const isValid = validate(termInfoData); // validate the data against the schema

    if (!isValid)
      console.log('Failed to validate schemma.');

    const key = Object.keys(termInfoData.Examples)[0];
    const obj = termInfoData.Examples[key][0].obj
    initFileWithoutReading({ url: obj });
  }

  let theme = createTheme({
    typography: { fontFamily: 'Roboto, Helvetica, Arial, sans-serif' },
    palette: {
      type: 'dark',
      primary: { main: orange[500] },
      secondary: { main: blue[500] },
      button: { main: '#fc6320' },
      toolbarBackground: { main: 'rgb(0,0,0,0.5)' },
    },
  });
  theme = responsiveFontSizes(theme);

  return (
    <div className="App">
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Main />
      </MuiThemeProvider>
    </div>
  );
}

export default App;
