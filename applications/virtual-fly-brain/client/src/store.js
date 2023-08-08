import { legacy_createStore as createStore, combineReducers } from 'redux'
import './index.css';
import TermInfoReducer from './reducers/TermInfoReducer';
import ThreeDCanvasReducer from './reducers/ThreeDCanvasReducer';
import GlobalReducer from './reducers/GlobalReducer';
import InstancesReducer from './reducers/InstancesReducer';

const rootReducer = combineReducers({
  termInfo: TermInfoReducer,
  instances: InstancesReducer,
  threeD: ThreeDCanvasReducer,
  globalInfo : GlobalReducer
});

const store = createStore(rootReducer);

export default store; 