import { legacy_createStore as createStore, combineReducers } from 'redux'
import './index.css';
import TermInfoReducer from './reducers/TermInfoReducer';

const rootReducer = combineReducers({
  termInfo: TermInfoReducer,
});

const store = createStore(rootReducer);

export default store; 