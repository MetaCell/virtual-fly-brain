import './App.css';
import Main from './components/Main'
import React from 'react';
import { termInfoById } from './reducers/actions/termInfo';
import { queryString } from './utils/queryString';
import {useSelector} from 'react-redux'

const App = () => { 

  const isLoading = useSelector(state => state.termInfo.isLoading)
  const termInfoData = useSelector(state => state.termInfo.termInfoData)

  if(!isLoading && !termInfoData)
  {
    const id = queryString("id")

    if (id) 
      termInfoById(id);
  }

  return (
    <div className="App">
      <Main />
    </div>
  );
}

export default App;
