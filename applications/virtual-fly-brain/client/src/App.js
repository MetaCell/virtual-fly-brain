// import './App.css';
import Main from './components/Main'
import React from 'react';
import { termInfoById } from './reducers/actions/termInfo';
import { queryString } from './utils/queryString';
import { useSelector } from 'react-redux'
import { termInfoSchemma } from './schemma/termInfoSchemma';
import { initFileWithoutReading } from './reducers/actions/readFile';
import 'font-awesome/css/font-awesome.min.css';
import Ajv from 'ajv';

const App = () => {

  const isLoading = useSelector(state => state.termInfo.isLoading)
  const termInfoData = useSelector(state => state.termInfo.termInfoData)

  if (!isLoading && !termInfoData) {
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

  return (
    <Main />
  );
}

export default App;