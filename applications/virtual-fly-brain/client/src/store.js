import { legacy_createStore as createStore, combineReducers } from 'redux'
import './index.css';
import TermInfoReducer from './reducers/TermInfoReducer';
import GlobalReducer from './reducers/GlobalReducer';
import InstancesReducer from './reducers/InstancesReducer';

const rootReducer = combineReducers({
  termInfo : TermInfoReducer,
  globalInfo : GlobalReducer,
  instancesReducer : InstancesReducer
});

const store = createStore(rootReducer);

export default store; 