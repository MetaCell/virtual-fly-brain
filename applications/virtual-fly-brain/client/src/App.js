import './App.css';
import { VFBMain } from './components/Main'
import React from 'react';
import { termInfoById } from './reducers/actions/termInfo';
import { queryString } from './utils/queryString';

function App() {

  const id = queryString("id")
  if (id) 
    termInfoById(id);

  return (
    <div className="App">
      <VFBMain />
    </div>
  );
}

export default Object.freeze(App);
