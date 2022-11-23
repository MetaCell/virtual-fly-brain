import { loadQueryTypes } from "./actions/loadQuery";

const initialState = {
  isLoading: false,
  anatomy_image_query: undefined,
  datasets_query: undefined
};

const QueryReducer = (state = initialState, action) => {
  switch (action.type) {
     case loadQueryTypes.LOAD_QUERY_STARTED:
        return Object.assign({}, state, {
           isLoading: true
        })
     case loadQueryTypes.LOAD_QUERY_SUCCESS:
        return Object.assign({}, state, {
          anatomy_image_query: JSON.parse(action.payload.docs[0].anat_image_query[0]), 
          datasets_query: JSON.parse(action.payload.docs[0].template_2_datasets_query[0]),
          isLoading: false
        })
     default:
        return state;
  }
}
export default QueryReducer;