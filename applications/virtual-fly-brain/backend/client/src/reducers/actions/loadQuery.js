import { queryById } from "../../network/query"

export const loadQueryTypes = {
  LOAD_QUERY_SUCCESS : 'LOAD_QUERY_SUCCESS',
  LOAD_QUERY_STARTED : 'LOAD_QUERY_STARTED',
  LOAD_QUERY_FAILURE : 'LOAD_QUERY_FAILURE'
}

const loadQuerySuccess = query => ({
  type: loadQueryTypes.LOAD_QUERY_SUCCESS,
  payload: {
    ...query
  }
});

const loadQueryStarted = () => ({
  type: loadQueryTypes.LOAD_QUERY_STARTED
});

const loadQueryFailure = error => ({
  type: loadQueryTypes.LOAD_QUERY_FAILURE,
  payload: {
    error
  }
});

export const loadQuery = (queryId) => {
  return async (dispatch, getState) => {
    dispatch(loadQueryStarted())

    let response

    try {
      response = await queryById(queryId);
    } catch (error) {
      dispatch(loadQueryFailure(error.message))
      return
    }

    dispatch(loadQuerySuccess(response.response))
  }
}