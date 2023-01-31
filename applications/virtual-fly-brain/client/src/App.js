import logo from './logo.svg';
import './App.css';
import { VFBMain } from './components/Main'
import React, {useSearchParams} from 'react';
import { termInfoById } from './reducers/actions/loadQuery';

function App() {

  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id")

  if (id) termInfoById(id);

  return (
    <div className="App">
      <VFBMain />
    </div>
  );
}

export default App;
