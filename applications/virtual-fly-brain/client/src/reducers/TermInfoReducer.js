import { getTermInfoTypes } from './actions/types/getTermInfoTypes';

export const initialStateTermInfo = {
  termInfoData: undefined,
  isLoading: false,
  error: false
};

const TermInfoReducer = (state = initialStateTermInfo, response) => {
  switch (response.type) {
     case getTermInfoTypes.GET_TERM_INFO_STARTED:
        return Object.assign({}, state, {
           isLoading: true
        })
     case getTermInfoTypes.GET_TERM_INFO_SUCCESS:
        return Object.assign({}, state, {
          termInfoData: response.payload,
          isLoading: false
        })
      case getTermInfoTypes.GET_TERM_INFO_FAILURE:
        return Object.assign({}, state, {
          termInfoData: response.payload.error,
          error: true
        })
     default:
        return state;
  }
}

export default TermInfoReducer;