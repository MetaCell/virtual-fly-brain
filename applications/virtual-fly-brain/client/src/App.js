// import './App.css';
import Main from './components/Main'
import React from 'react';
import { getInstanceByID, show3D } from './reducers/actions/instances';
import { queryString } from './utils/queryString';
import { useSelector } from 'react-redux'
import { termInfoSchemma } from './schemma/termInfoSchemma';
import { initFileWithoutReading } from './reducers/actions/readFile';
import Ajv from 'ajv';

const App = () => {
  const [templateLoaded, setTemplateLoaded] = React.useState(false);

  const focusedInstance = useSelector(state => state.instances.focusedInstance)
  const allLoadedInstances = useSelector(state => state.instances.allLoadedInstances)
  const templateID = "VFB_00101567";
  if ( !focusedInstance ){
    getInstanceByID(templateID, true);
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

  React.useEffect( () => {
    if ( allLoadedInstances?.find( i => i?.metadata?.IsTemplate ) && !templateLoaded) {
      setTemplateLoaded(true);
      const id = queryString("id");
      if ( id != templateID && id != undefined && id != "" ){
        getInstanceByID(id, true);
      }
    }
  }, [allLoadedInstances])

  return (
    <Main />
  );
}

export default App;