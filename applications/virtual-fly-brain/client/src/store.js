import { legacy_createStore as createStore, combineReducers } from 'redux'
import './index.css';
import TermInfoReducer from './reducers/TermInfoReducer';
import ThreeDCanvasReducer from './reducers/ThreeDCanvasReducer';
import GlobalReducer from './reducers/GlobalReducer';
import CircuitReducer from './reducers/CircuitReducer';
import GraphReducer from './reducers/GraphReducer';

const rootReducer = combineReducers({
  termInfo: TermInfoReducer,
  threeD: ThreeDCanvasReducer,
  globalInfo : GlobalReducer,
  circuit: CircuitReducer,
  graph: GraphReducer
});

const store = createStore(rootReducer);

export default store; 