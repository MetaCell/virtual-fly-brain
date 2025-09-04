import store from '../../store';
import { get_query_results } from "../../network/query"
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


const _getQueriesStarted = () => ({
  type: getQueriesTypes.GET_QUERIES_STARTED
});


export const getQueriesFailure = ( error, id) => ({
  type: getQueriesTypes.GET_QUERIES_FAILURE,
  payload: {
    error : error,
    id : id
  }
});

export const getQueries = async (short_form, type) => {

  store.dispatch(_getQueriesStarted())
  let response;
  try {
    response = await get_query_results(short_form, type);
  } catch (error) {
    store.dispatch(getQueriesFailure(error.message, short_form))
  }

  store.dispatch(getQueriesSuccess(response, short_form, type))
}

export const deleteQuery = async (instance) => {
  store.dispatch(deleteQuerySuccess(instance))
}

export const updateQueries = async (instance) => {
  store.dispatch(updateQuerySuccess(instance))
}

export const getQueriesStarted = () => {
  store.dispatch(_getQueriesStarted())
}

export const getQueriesFinished = () => {
  // This function may be used to dispatch a finished action
  // Currently no implementation needed as the success/failure actions handle completion
}
