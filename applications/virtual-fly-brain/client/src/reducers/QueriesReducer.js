import { getQueriesTypes } from './actions/types/getQueriesTypes';

const initialState = {
  queries : [],
  isLoading: false,
  error: false
};

const QueriesReducer = (state = initialState, response) => {
  switch (response.type) {
     case getQueriesTypes.GET_QUERIES_STARTED:
        return Object.assign({}, state, {
           isLoading: true
        })
     case getQueriesTypes.GET_QUERIES_SUCCESS:
        return Object.assign({}, state, {
          queries: !state.queries?.find( i => i.short_form === response.payload.short_form ) && [...state.queries, response.payload],
          isLoading: false
        })
      case getQueriesTypes.DELETE_QUERY:
        return Object.assign({}, state, {
          queries: state.queries?.filter( i => i.short_form !== response.payload.short_form ),
          isLoading: false
        })
      case getQueriesTypes.GET_QUERIES_FAILURE:
        return Object.assign({}, state, {
          error: true
        })
     default:
        return state;
  }
}

export default QueriesReducer;
