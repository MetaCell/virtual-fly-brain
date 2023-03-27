import { getStackViewerTypes } from './actions/types/getStackViewerTypes';

const initialState = {
  stackViewerData: undefined,
  isLoading: false,
  error: false
};

const StackViewerReducer = (state = initialState, response) => {
  switch (response.type) {
     case getStackViewerTypes.GET_TERM_INFO_STARTED:
        return Object.assign({}, state, {
           isLoading: true
        })
     case getStackViewerTypes.GET_TERM_INFO_SUCCESS:
        return Object.assign({}, state, {
          stackViewerData: response.payload,
          isLoading: false
        })
      case getStackViewerTypes.GET_TERM_INFO_FAILURE:
        return Object.assign({}, state, {
          stackViewerData: response.payload.error,
          error: true
        })
     default:
        return state;
  }
}

export default StackViewerReducer;