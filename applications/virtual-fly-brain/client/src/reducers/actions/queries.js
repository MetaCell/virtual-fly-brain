import store from '../../store';
import { get_queries, get_queries_function } from "../../network/query"
import { getQueriesTypes } from './types/getQueriesTypes';

const getQueriesSuccess = (query, short_form) => ({
  type: getQueriesTypes.GET_QUERIES_SUCCESS,
  payload: {
    ...query,
    short_form
  }
});

const deleteQuerySuccess = id => ({
  type: getQueriesTypes.DELETE_QUERY,
  payload: {
    id
  }
});

const updateQuerySuccess = queries => ({
  type: getQueriesTypes.UPDATE_QUERIES,
  payload: [
    ...queries
  ]
});


const getQueriesStarted = () => ({
  type: getQueriesTypes.GET_QUERIES_STARTED
});

const getQueriesFailure = error => ({
  type: getQueriesTypes.GET_QUERIES_FAILURE,
  payload: {
    error
  }
});

export const getQueries = async (instance) => {

  store.dispatch(getQueriesStarted())
  let response;
  try {
    response = await get_queries(instance.short_form);
  } catch (error) {
    store.dispatch(getQueriesFailure(error.message))
  }

  store.dispatch(getQueriesSuccess(response, instance.short_form))
}

export const getQueriesFunction = async (short_form, func) => {

  store.dispatch(getQueriesStarted())
  let response;
  try {
    response = await get_queries_function(short_form, func);
  } catch (error) {
    store.dispatch(getQueriesFailure(error.message))
  }

  store.dispatch(getQueriesSuccess(response, short_form))
}

export const deleteQuery = async (instance) => {
  store.dispatch(deleteQuerySuccess(instance))
}

export const updateQueries = async (instance) => {
  store.dispatch(updateQuerySuccess(instance))
}
