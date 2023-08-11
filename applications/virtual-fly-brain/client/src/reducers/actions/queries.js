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
    console.log("instance ", instance);
    response = await get_queries(instance.short_form);
    console.log("response ", response);
    newInstance.queries = response
  } catch (error) {
    store.dispatch(getQueriesFailure(error.message))
    console.log("error ", error);
  }
  console.log("newInstance ", newInstance);

  store.dispatch(getQueriesSuccess(newInstance))
}

export const deleteQuery = async (instance) => {
  store.dispatch(deleteQuerySuccess(instance))
}
