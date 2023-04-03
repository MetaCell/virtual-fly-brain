import { getTermInfoTypes } from './actions/types/getInstancesTypes';

const initialState = {
  termInfoData: undefined,
  isLoading: false,
  error: false
};

const TermInfoReducer = (state = initialState, response) => {
  switch (response.type) {
     case getTermInfoTypes.GET_INSTANCES_STARTED:
        return Object.assign({}, state, {
           isLoading: true
        })
     case getTermInfoTypes.GET_INSTANCES_SUCCESS:
        return Object.assign({}, state, {
          termInfoData: response.payload,
          isLoading: false
        })
      case getTermInfoTypes.GET_INSTANCES_FAILURE:
        return Object.assign({}, state, {
          termInfoData: response.payload.error,
          error: true
        })
     default:
        return state;
  }
}

export default TermInfoReducer;