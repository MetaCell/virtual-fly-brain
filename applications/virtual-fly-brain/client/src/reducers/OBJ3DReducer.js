import { getOBJ3DTypes } from './actions/types/getOBJ3DTypes';
import { getTermInfoTypes } from './actions/types/getTermInfoTypes';

const initialState = {
  modelUrl: undefined,
  isLoading: false,
  error: false
};

const OBJ3DReducer = (state = initialState, response) => {
  switch (response.type) {
     case getOBJ3DTypes.GET_3D_OBJ_TYPE_STARTED:
        return Object.assign({}, state, {
           isLoading: true
        })
     case getOBJ3DTypes.GET_3D_OBJ_TYPE_SUCCESS:
        return Object.assign({}, state, {
          termInfoData: response.payload,
          isLoading: false
        })
      case getOBJ3DTypes.GET_3D_OBJ_TYPE_FAILURE:
        return Object.assign({}, state, {
          termInfoData: response.payload.error,
          error: true
        })
      case getTermInfoTypes.GET_TERM_INFO_SUCCESS: 
        return Object.assign({}, state, {
          modelUrl: response.payload,
          isLoading: false
        })
     default:
        return state;
  }
}

export default OBJ3DReducer;