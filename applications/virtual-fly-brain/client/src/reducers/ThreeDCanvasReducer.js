import { getOBJ3DTypes } from './actions/types/getOBJ3DTypes';
import { loadFileType } from './actions/readFile';

export const initialStateThreeDCanvasReducer = {
  modelUrl: undefined,
  isLoading: false,
  error: false
};

const ThreeDCanvasReducer = (state = initialState, response) => {
  switch (response.type) {
    case loadFileType.FILE_READ_INITED:
      return Object.assign({}, state, {
        modelUrl: response.payload.url
      })
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
    default:
      return state;
  }
}

export default ThreeDCanvasReducer;