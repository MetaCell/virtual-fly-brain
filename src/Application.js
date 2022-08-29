import { combineReducers, applyMiddleware } from 'redux';
import { configureStore } from "@reduxjs/toolkit";
import LayoutReducer from './reducers/LayoutReducer';
import QueryReducer from './reducers/QueryReducer';
import thunk from 'redux-thunk'

export function Application(){

  const rootReducer = combineReducers({
    Layout: LayoutReducer,
    Query: QueryReducer
  });

  return configureStore({ reducer: rootReducer }) ;
}