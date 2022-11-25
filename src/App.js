import logo from './logo.svg';
import './App.css';
import { VFBMain } from './components/VFBMain'

import CssBaseline from '@material-ui/core/CssBaseline';
import '@metacell/geppetto-meta-ui/flex-layout/style/dark.scss'
import './styles/cameraControls.css';

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <VFBMain />
    </div>
  );
}

export default App;
