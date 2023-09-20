import { combineReducers } from 'redux';
import { createStore } from '@metacell/geppetto-meta-client/common';
import './index.css';

import TermInfoReducer, { initialStateTermInfo } from './reducers/TermInfoReducer';
import ThreeDCanvasReducer, { initialStateThreeDCanvas } from './reducers/ThreeDCanvasReducer';
import GlobalReducer, { initialStateGlobalReducer } from './reducers/GlobalReducer';
import InstancesReducer from './reducers/InstancesReducer';
import QueriesReducer from './reducers/QueriesReducer';
import { layout as baseLayout } from './components/layout/layout'; 
import componentMap from './components/layout/componentMap'; 

const INIT_STATE = {
  termInfo: initialStateTermInfo,
  threeD: initialStateThreeDCanvas,
  globalInfo: initialStateGlobalReducer
};

const reducers = {
  termInfo: TermInfoReducer,
  instances: InstancesReducer,
  queries: QueriesReducer,
  globalInfo : GlobalReducer
};

const store = createStore(
  reducers,
  INIT_STATE,
  [],
  { baseLayout, componentMap }
)

export default store; 