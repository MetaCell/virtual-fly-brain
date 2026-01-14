import store from '../../store';
import { get_query_results, get_queries } from "../../network/query"
import { getQueriesTypes } from './types/getQueriesTypes';

const getQueriesSuccess = (query, short_form, type) => ({
  type: getQueriesTypes.GET_QUERIES_SUCCESS,
  payload: {
    query: query,
    short_form: short_form,
    type: type
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


export const getQueriesFailure = (error, id) => ({
  type: getQueriesTypes.GET_QUERIES_FAILURE,
  payload: {
    error: error,
    id: id
  }
});

export const getQueries = async (short_form, type) => {

  store.dispatch(_getQueriesStarted())

  const state = store.getState();
  const allLoadedInstances = state.instances.allLoadedInstances;

  let response;
  try {
    // When type is provided - execute the specific query
    if (type) {
      response = await get_query_results(short_form, type);
      store.dispatch(getQueriesSuccess(response, short_form, type))
    }
    // When type is not provided - load available queries list
    else {
      // Check if instance already loaded (CACHE CHECK)
      const existingInstance = allLoadedInstances?.find(
        i => i.metadata?.Id === short_form
      );

      let queriesData;
      if (existingInstance?.metadata?.Queries) {
        // Use cached instance data - no network call needed!
        queriesData = {
          queries: existingInstance.metadata.Queries,
          name: existingInstance.metadata.Name
        };
      } else {
        // Instance not loaded, fetch queries from backend using get_queries
        queriesData = await get_queries(short_form);
      }

      // Format response to match what reducer expects
      response = {
        queries: queriesData.queries, // Array of all available queries
        name: queriesData.name
      };

      store.dispatch(getQueriesSuccess(response, short_form, undefined))
    }
  } catch (error) {
    store.dispatch(getQueriesFailure(error.message, short_form))
  }
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
