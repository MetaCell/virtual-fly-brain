import { loadQueryTypes } from "./actions/loadQuery";

const initialState = {
  isLoading: false,
  json: undefined //this will evolve into separate reducers
};

const QueryReducer = (state = initialState, action) => {
  switch (action.type) {
     case loadQueryTypes.LOAD_QUERY_STARTED:
        return Object.assign({}, state, {
           isLoading: action.payload.isLoading
        })
     case loadQueryTypes.LOAD_QUERY_SUCCESS:
        return Object.assign({}, state, {
           items: state.items.concat(action.items),
           isLoading: action.isLoading
        })
     default:
        return state;
  }
}
export default QueryReducer;