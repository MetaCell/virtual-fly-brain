// import './App.css';
import Main from './components/Main'
import React from 'react';
import { getInstanceByID } from './reducers/actions/instances';
import { queryString } from './utils/queryString';
import { useSelector } from 'react-redux'
import { termInfoSchemma } from './schemma/termInfoSchemma';
import { initFileWithoutReading } from './reducers/actions/readFile';
import Ajv from 'ajv';

const App = () => {

  const focusedInstance = useSelector(state => state.instances.focusedInstance)

  if (!focusedInstance) {
    const id = queryString("id") || "VFB_00101567";
    if (id)
    {
      getInstanceByID(id);
    }
  }
  if ( focusedInstance ) // load initial 3d model TODO: proper instance, class treatement
  {
    //validate schemma
    const ajv = new Ajv(); // create an Ajv instance
    const validate = ajv.compile(termInfoSchemma); // compile the schema

    const isValid = validate(focusedInstance); // validate the data against the schema

    if (!isValid)
      console.log('Failed to validate schemma.');

    let key = 0;
    if ( focusedInstance?.metadata?.Images ) key = Object.keys(focusedInstance?.metadata?.Images)[0];
    let obj = null;
    // if ( focusedInstance?.metadata?.Images ) obj = focusedInstance?.metadata?.Images[key][0].obj
    // obj && initFileWithoutReading({ url: obj });
  }

  // let theme = createMuiTheme({
  //   typography: { fontFamily: 'Roboto, Helvetica, Arial, sans-serif' },
  //   palette: {
  //     type: 'dark',
  //     primary: { main: orange[500] },
  //     secondary: { main: blue[500] },
  //     button: { main: '#fc6320' },
  //     toolbarBackground: { main: 'rgb(0,0,0,0.5)' },
  //   },
  // });
  // theme = responsiveFontSizes(theme);

  return (
    <Main />
  );
}

export default App;