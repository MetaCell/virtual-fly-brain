import { getQueriesTypes } from './actions/types/getQueriesTypes';

export const initialStateQueriesReducer = {
  queries : [],
  isLoading: false,
  error: false,
  errorMessage: undefined
};

const QueriesReducer = (state = initialStateQueriesReducer, response) => {
  switch (response.type) {
     case getQueriesTypes.GET_QUERIES_STARTED:
        return Object.assign({}, state, {
           isLoading: true
        })
     case getQueriesTypes.GET_QUERIES_SUCCESS:
        return Object.assign({}, state, {
          queries: !state.queries?.find( i => i.short_form === response.payload.short_form ) !== undefined && [...state.queries, response.payload],
          isLoading: false
        })
      case getQueriesTypes.UPDATE_QUERIES:
        return Object.assign({}, state, {
          queries: response.payload,
          isLoading: false
        })
      case getQueriesTypes.DELETE_QUERY:
        return Object.assign({}, state, {
          queries: state.queries?.filter( i => i.short_form !== response.payload.short_form ),
          isLoading: false,
          error: false,
          errorMessage: undefined
        })
      case getQueriesTypes.GET_QUERIES_FAILURE:
        return Object.assign({}, state, {
          error: true,
          errorMessage: response.payload.error,
        })
     default:
        return state;
  }
}

export default QueriesReducer;
