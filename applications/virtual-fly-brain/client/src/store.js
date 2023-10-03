import { legacy_createStore as createStore, combineReducers } from 'redux'
import './index.css';

import TermInfoReducer, { initialStateTermInfoReducer } from './reducers/TermInfoReducer';
import ThreeDCanvasReducer, { initialStateThreeDCanvasReducer } from './reducers/ThreeDCanvasReducer';
import GlobalReducer, { initialStateGlobalReducer } from './reducers/GlobalReducer';
import CircuitReducer, { initialStateCircuitReducer } from './reducers/CircuitReducer';
import GraphReducer, { initialStateGraphReducer } from './reducers/GraphReducer';

import { layout as baseLayout } from './components/layout/layout'; 
import componentMap from './components/layout/componentMap'; 

const INIT_STATE = {
  termInfo: initialStateTermInfoReducer,
  threeD: initialStateThreeDCanvasReducer,
  globalInfo: initialStateGlobalReducer,
  circuit: initialStateCircuitReducer,
  graph: initialStateGraphReducer
};

const reducers = combineReducers({
  termInfo: TermInfoReducer,
  threeD: ThreeDCanvasReducer,
  globalInfo : GlobalReducer,
  circuit: CircuitReducer,
  graph: GraphReducer
});

const store = createStore(
  reducers,
  INIT_STATE,
  [],
  { baseLayout, componentMap }
)

export default store; 