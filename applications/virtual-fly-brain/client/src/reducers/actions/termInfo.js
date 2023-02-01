import store from '../../store';
import { get_term_info } from "../../network/query"

export const getTermInfoTypes = {
  GET_TERM_INFO_SUCCESS : 'GET_TERM_INFO_SUCCESS',
  GET_TERM_INFO_STARTED : 'GET_TERM_INFO_STARTED',
  GET_TERM_INFO_FAILURE : 'GET_TERM_INFO_FAILURE'
}

const getTermInfoSuccess = query => ({
  type: getTermInfoTypes.GET_TERM_INFO_SUCCESS,
  payload: {
    ...query
  }
});

const getTermInfoStarted = () => ({
  type: getTermInfoTypes.GET_TERM_INFO_STARTED
});

const getTermInfoFailure = error => ({
  type: getTermInfoTypes.GET_TERM_INFO_FAILURE,
  payload: {
    error
  }
});

export const termInfoById = async (queryId) => {

  store.dispatch(getTermInfoStarted())

  let response

  try {
    response = await get_term_info(queryId);
  } catch (error) {
    store.dispatch(getTermInfoFailure(error.message))
    return
  }

  store.dispatch(getTermInfoSuccess(response.response))
}