import { combineReducers } from 'redux';
import { urlUpdaterMiddleware } from './reducers/middleware/urlUpdaterMiddleware';
import { createStore } from '@metacell/geppetto-meta-client/common';
import './index.css';

import GlobalReducer, { initialStateGlobalReducer } from './reducers/GlobalReducer';
import InstancesReducer, { initialStateInstancesReducer }  from './reducers/InstancesReducer';
import QueriesReducer from './reducers/QueriesReducer';
import baseLayout from './components/layout/layout';
import componentMap from './components/layout/componentMap';
import GraphReducer, { initialStateGraphReducer} from './reducers/GraphReducer';

import vfbMiddleware from './reducers/middleware/vfbMiddleware';

const INIT_STATE = {
  globalInfo: initialStateGlobalReducer,
  instances: initialStateInstancesReducer,
  graph: initialStateGraphReducer,
};

const reducers = {
  globalInfo: GlobalReducer,
  instances: InstancesReducer,
  queries: QueriesReducer,
  graph: GraphReducer
};

const isMinimizeEnabled = true;

const store = createStore(
  reducers,
  INIT_STATE,
  [vfbMiddleware, urlUpdaterMiddleware],
  { undefined, baseLayout, componentMap, isMinimizeEnabled }
)

export default store; 
