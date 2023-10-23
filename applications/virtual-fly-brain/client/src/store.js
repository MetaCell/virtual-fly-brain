import { combineReducers } from 'redux';
import { createStore } from '@metacell/geppetto-meta-client/common';
import './index.css';

import TermInfoReducer, { initialStateTermInfo } from './reducers/TermInfoReducer';
import ThreeDCanvasReducer, { initialStateThreeDCanvas } from './reducers/ThreeDCanvasReducer';
import GlobalReducer, { initialStateGlobalReducer } from './reducers/GlobalReducer';
import InstancesReducer, { initialStateInstancesReducer }  from './reducers/InstancesReducer';
import QueriesReducer from './reducers/QueriesReducer';
import layout from './components/layout/layout'; 
import componentMap from './components/layout/componentMap'; 
import CircuitReducer, { initialStateCircuitReducer} from './reducers/CircuitReducer';
import GraphReducer, { initialStateGraphReducer} from './reducers/GraphReducer';

const INIT_STATE = {
  termInfo: initialStateTermInfo,
  threeD: initialStateThreeDCanvas,
  globalInfo: initialStateGlobalReducer,
  instances: initialStateInstancesReducer,
  graph: initialStateGraphReducer,
  circuit: initialStateCircuitReducer
};

const reducers = {
  termInfo: TermInfoReducer,
  threeD: ThreeDCanvasReducer,
  globalInfo: GlobalReducer,
  instances: InstancesReducer,
  queries: QueriesReducer,
  graph: GraphReducer,
  circuit: CircuitReducer
};

const isMinimizeEnabled = true;

const store = createStore(
  reducers,
  INIT_STATE,
  [],
  { layout, componentMap, isMinimizeEnabled }
)

export default store; 
