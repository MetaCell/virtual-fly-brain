import { combineReducers, applyMiddleware } from 'redux';
import { configureStore } from "@reduxjs/toolkit";
import { LayoutReducer } from './reducers/LayoutReducer';
import thunk from 'redux-thunk'

export function Application(){

  const rootReducer = combineReducers({
    Layout: LayoutReducer
  });

  return configureStore(rootReducer, applyMiddleware(thunk)) ;
}