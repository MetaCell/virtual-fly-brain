import { queryById } from "../../network/query"
import { requestStarted, requestSucceeded  } from "./base"

export const loadQuery = (queryId) => {
  return async (dispatch, getState) => {
    dispatch(requestStarted())

    let response

    try {
      response = await queryById(queryId);
    } catch (error) {
      dispatch(requestFailed(error.message))
      return
    }

    dispatch(requestSucceeded(response.data))
  }
}