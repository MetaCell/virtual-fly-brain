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
     case getQueriesTypes.GET_QUERIES_SUCCESS:{
        let updatedQueries = [...state.queries]
        let findQuery = updatedQueries?.find( i => i.Id === response.payload.Id );
        if ( findQuery === undefined ){
          updatedQueries.push(response.payload)
        }
        return Object.assign({}, state, {
          queries: updatedQueries,
          isLoading: false
        })
      }
      case getQueriesTypes.UPDATE_QUERIES:
        return Object.assign({}, state, {
          queries: response.payload,
          isLoading: false
        })
      case getQueriesTypes.DELETE_QUERY:
        return Object.assign({}, state, {
          queries: state.queries?.filter( i => i.Id !== response.payload.Id ),
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
