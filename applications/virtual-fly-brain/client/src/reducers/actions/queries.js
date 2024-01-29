import store from '../../store';
import { get_queries } from "../../network/query"
import { getQueriesTypes } from './types/getQueriesTypes';

const getQueriesSuccess = query => ({
  type: getQueriesTypes.GET_QUERIES_SUCCESS,
  payload: {
    ...query
  }
});

const deleteQuerySuccess = query => ({
  type: getQueriesTypes.DELETE_QUERY,
  payload: {
    ...query
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
  let newInstance = instance;

  let response;
  try {
    response = await get_queries(instance.short_form);
    newInstance.queries = response
    console.log("queries ", newInstance.queries)
  } catch (error) {
    store.dispatch(getQueriesFailure(error.message))
  }

  store.dispatch(getQueriesSuccess(newInstance))
}

export const deleteQuery = async (instance) => {
  store.dispatch(deleteQuerySuccess(instance))
}

export const updateQueries = async (instance) => {
  store.dispatch(updateQuerySuccess(instance))
}
