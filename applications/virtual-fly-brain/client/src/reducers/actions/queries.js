import store from '../../store';
import { get_queries, get_query_results } from "../../network/query"
import { getQueriesTypes } from './types/getQueriesTypes';

const getQueriesSuccess = (query, short_form, type) => ({
  type: getQueriesTypes.GET_QUERIES_SUCCESS,
  payload: {
    query : query,
    short_form : short_form,
    type : type
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

export const getQueriesFailure = error => ({
  type: getQueriesTypes.GET_QUERIES_FAILURE,
  payload: {
    error
  }
});

export const getQueries = async (short_form, type) => {

  store.dispatch(getQueriesStarted())
  let response;
  try {
    response = await get_query_results(short_form, type);
  } catch (error) {
    store.dispatch(getQueriesFailure(error.message))
  }

  store.dispatch(getQueriesSuccess(response, short_form, type))
}

export const deleteQuery = async (instance) => {
  store.dispatch(deleteQuerySuccess(instance))
}

export const updateQueries = async (instance) => {
  store.dispatch(updateQuerySuccess(instance))
}
