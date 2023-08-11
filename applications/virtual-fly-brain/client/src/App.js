// import './App.css';
import Main from './components/Main'
import React from 'react';
import { getInstanceByID } from './reducers/actions/instances';
import { queryString } from './utils/queryString';
import { termInfoById } from './reducers/actions/termInfo';
import { useSelector } from 'react-redux'
import { termInfoSchemma } from './schemma/termInfoSchemma';
import { initFileWithoutReading } from './reducers/actions/readFile';
import Ajv from 'ajv';

const App = () => {

  const isLoading = useSelector(state => state.termInfo.isLoading)
  const termInfoData = useSelector(state => state.termInfo.termInfoData)

  if (!isLoading && !termInfoData) {
    const id = queryString("id")

    if (id)
    {
      // TODO : Combine calls
      getInstanceByID(id);
      termInfoById(id);
    }
  }
  if ( termInfoData ) // load initial 3d model TODO: proper instance, class treatement
  {
    //validate schemma
    console.log("Term info data ", termInfoData)
    const ajv = new Ajv(); // create an Ajv instance
    const validate = ajv.compile(termInfoSchemma); // compile the schema

    const isValid = validate(termInfoData); // validate the data against the schema

    if (!isValid)
      console.log('Failed to validate schemma.');

    let key = 0;
    if ( termInfoData?.Images ) key = Object.keys(termInfoData?.Images)[0];
    let obj = null;
    if ( termInfoData?.Images ) obj = termInfoData?.Images[key][0].obj
    obj && initFileWithoutReading({ url: obj });
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