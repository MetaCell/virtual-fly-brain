import { getInstancesTypes } from './actions/types/getInstancesTypes';

export const initialStateInstancesReducer = {
  allPotentialInstances : [],
  allLoadedInstances : [],
  isLoading: false,
  error: false
};

const InstancesReducer = (state = initialStateInstancesReducer, response) => {
  switch (response.type) {
     case getInstancesTypes.GET_INSTANCES_STARTED:
        return Object.assign({}, state, {
           isLoading: true
        })
     case getInstancesTypes.GET_INSTANCES_SUCCESS:
        return Object.assign({}, state, {
          allLoadedInstances: state.allLoadedInstances?.find( i => i.Id === response.payload.Id ) ? [...state.allLoadedInstances] : [...state.allLoadedInstances, response.payload],
          isLoading: false
        })
      case getInstancesTypes.GET_INSTANCES_FAILURE:
        return Object.assign({}, state, {
          error: true
        })
     default:
        return state;
  }
}

export default InstancesReducer;
