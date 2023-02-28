import { legacy_createStore as createStore, combineReducers } from 'redux'
import './index.css';
import TermInfoReducer from './reducers/TermInfoReducer';
import OBJ3DReducer from './reducers/OBJ3DReducer';

const rootReducer = combineReducers({
  termInfo: TermInfoReducer,
  obj3D: OBJ3DReducer
});

const store = createStore(rootReducer);

export default store; 