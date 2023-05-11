import { combineReducers } from 'redux';
import { createStore } from '@metacell/geppetto-meta-client/common';
import './index.css';
import TermInfoReducer from './reducers/TermInfoReducer';
import ThreeDCanvasReducer from './reducers/ThreeDCanvasReducer';
import GlobalReducer from './reducers/GlobalReducer';
import { layout as baseLayout } from './components/layout/layout'; 
import componentMap from './components/layout/componentMap'; 

const INIT_STATE = {
};

const reducers = combineReducers({
  termInfo: TermInfoReducer,
  threeD: ThreeDCanvasReducer,
  globalInfo : GlobalReducer
});

const store = createStore(
  reducers,
  INIT_STATE,
  null,
  { baseLayout, componentMap }
)

export default store; 