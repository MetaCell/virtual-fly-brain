import { getGlobalTypes } from './actions/types/GlobalTypes';
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
        response.payload.query.active = true;
        if ( Array.isArray(response.payload.query) ) {
          response.payload?.query.forEach( query => {
            query.active = true;
            let findQuery = updatedQueries?.find( i => i.short_form === response.payload.short_form );
            if ( findQuery === undefined ){
              const newQuery = { short_form : response.payload.short_form, queries : { [query["query"]] : query }}
              updatedQueries.push(newQuery)
            } else {
              if ( findQuery.queries?.[response.payload.type] ) {
                findQuery.queries[response.payload.type] = Object.assign(findQuery.queries[response.payload.type], response.payload.query) 
              }
            }
          })
        } else {
          let findQuery = updatedQueries?.find( i => i.short_form === response.payload.short_form );
          if ( findQuery === undefined ){
            const newQuery = { short_form : response.payload.short_form, queries : { [response.payload.type] : response.payload.query }}
            updatedQueries.push(newQuery)
          } else {
            if ( findQuery.queries?.[response.payload.type] ) {
              findQuery.type = response.payload.type;
              findQuery.queries[response.payload.type] = response.payload.query 
            }
          }
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
          queries: state.queries?.filter( i => i.Id !== response.payload.id ),
          isLoading: false,
          error: false,
          errorMessage: undefined
        })
      case getQueriesTypes.GET_QUERIES_FAILURE:
        return Object.assign({}, state, {
          error: true,
          errorMessage: response.payload.error,
        })
      case getGlobalTypes.RESET_ERRORS: {
        return Object.assign({}, state, {
          error: false,
          errorMessage: undefined
        })
      }
      default:
        return state;
  }
}

export default QueriesReducer;
