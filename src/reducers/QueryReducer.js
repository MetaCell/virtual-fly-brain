const initialState = {
  isLoading: false,
  json: unfefined //this will evolve into separate reducers
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
     case 'LOAD_QUERY_START':
        return Object.assign({}, state, {
           isLoading: action.payload.isLoading
        })
     case 'LOAD_QUERY_SUCCESS':
        return Object.assign({}, state, {
           items: state.items.concat(action.items),
           isLoading: action.isLoading
        })
     default:
        return state;
  }
}
export default reducer;