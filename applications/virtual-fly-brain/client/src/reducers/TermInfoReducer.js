import { getTermInfoTypes } from './actions/types/getTermInfoTypes';

const initialState = {
  termInfoData: undefined,
  isLoading: false,
  errorLoading: false
};

const TermInfoReducer = (state = initialState, response) => {
  switch (response.type) {
     case getTermInfoTypes.GET_TERM_INFO_STARTED:
        return Object.assign({}, state, {
           isLoading: true
        })
     case getTermInfoTypes.GET_TERM_INFO_SUCCESS:
        return Object.assign({}, state, {
          termInfoData: response.payload,
          isLoading: false,
          errorLoading: false
        })
      case getTermInfoTypes.GET_TERM_INFO_FAILURE:
        return Object.assign({}, state, {
          termInfoData: response.payload.error,
          isLoading: false,
          errorLoading: true
        })
     default:
        return state;
  }
}

export default TermInfoReducer;