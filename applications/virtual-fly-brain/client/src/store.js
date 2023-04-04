import { legacy_createStore as createStore, combineReducers } from 'redux'
import './index.css';
import TermInfoReducer from './reducers/TermInfoReducer';
import GlobalReducer from './reducers/GlobalReducer';

const rootReducer = combineReducers({
  termInfo : TermInfoReducer,
  globalInfo : GlobalReducer
});

const store = createStore(rootReducer);

export default store; 