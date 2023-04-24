import { getInstancesTypes } from './actions/types/getInstancesTypes';

const initialState = {
<<<<<<< HEAD
  allPotentialInstances : [],
=======
  termInfoData: undefined,
>>>>>>> feature/vfb11
  isLoading: false,
  error: false
};

<<<<<<< HEAD
const InstancesReducer = (state = initialState, response) => {
  switch (response.type) {
     case getInstancesTypes.GET_INSTANCES_STARTED:
        return Object.assign({}, state, {
           isLoading: true
        })
     case getInstancesTypes.GET_INSTANCES_SUCCESS:
        return Object.assign({}, state, {
          allPotentialInstances: response.payload,
          isLoading: false
        })
      case getInstancesTypes.GET_INSTANCES_FAILURE:
        return Object.assign({}, state, {
          termInfoData: [],
=======
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
>>>>>>> feature/vfb11
          error: true
        })
     default:
        return state;
  }
}

<<<<<<< HEAD
export default InstancesReducer;
=======
export default TermInfoReducer;
>>>>>>> feature/vfb11
