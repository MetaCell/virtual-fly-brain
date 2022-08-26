import { combineReducers, configureStore } from 'redux';
import { LayoutReducer } from './reducers/LayoutReducer';

const RootState = {
  Layout: LayoutReducer
}

export function Application(){

  const rootReducer = combineReducers({
    App: AppReducer
  });

  return createStore(rootReducer, applyMiddleware(thunk)) ;
}