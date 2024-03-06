// import './App.css';
import Main from './components/Main'
import React, { useEffect, useState } from 'react';

function clearAppStorage() {
  Object.keys(localStorage).forEach(key => {
    localStorage.removeItem(key);
  });
  Object.keys(sessionStorage).forEach(key => {
    sessionStorage.removeItem(key);
  });
}

const App = () => {
  const [loadedOnce, setLoadedOnce] = useState(false);

  useEffect(() => {
    if (!loadedOnce) {
      setLoadedOnce(true);
      clearAppStorage();
    }
  }, []); 

  return (
    <Main />
  );
}

export default App;