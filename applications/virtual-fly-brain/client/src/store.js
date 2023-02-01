import { legacy_createStore as createStore } from 'redux'
import './index.css';
import TermInfoReducer from './reducers/TermInfoReducer';

const store = createStore(TermInfoReducer)

export default store; 