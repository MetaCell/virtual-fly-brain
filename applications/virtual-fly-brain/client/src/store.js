import { legacy_createStore as createStore, combineReducers } from 'redux'
import './index.css';
import TermInfoReducer from './reducers/TermInfoReducer';
import GlobalReducer from './reducers/GlobalReducer';
import StackViewerReducer from './reducers/StackViewerReducer';

const rootReducer = combineReducers({
  termInfo : TermInfoReducer,
  globalInfo : GlobalReducer,
  stackViewerInfo : StackViewerReducer
});

const store = createStore(rootReducer);

export default store; 