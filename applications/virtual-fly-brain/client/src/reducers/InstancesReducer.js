import { getInstancesTypes } from './actions/types/getInstancesTypes';

export const initialStateInstancesReducer = {
  allPotentialInstances : [],
  allLoadedInstances : [],
  focusInstance : "",
  triggerFocus : null,
  isLoading: false,
  error: false
};

const InstancesReducer = (state = initialStateInstancesReducer, response) => {
  switch (response.type) {
     case getInstancesTypes.GET_INSTANCES_STARTED: {
        return Object.assign({}, state, {
           isLoading: true
        })
      }
     case getInstancesTypes.GET_INSTANCES_SUCCESS:{
      const newInstance = response.payload;
      newInstance.visible = true;
      let loadedInstances = state.allLoadedInstances?.find( i => i.Id === response.payload.Id ) ? [...state.allLoadedInstances] : [...state.allLoadedInstances, newInstance]
      return Object.assign({}, state, {
          allLoadedInstances: loadedInstances,
          isLoading: false
        })
      }
      case getInstancesTypes.GET_INSTANCES_FAILURE:{
        return Object.assign({}, state, {
          error: true
        })
      }
      case getInstancesTypes.REMOVE_INSTANCES_SUCCESS:{
        return Object.assign({}, state, {
          allLoadedInstances: state.allLoadedInstances?.find( i => i.Id === response.payload.query ) ? [...state.allLoadedInstances.filter(i => i.Id !== response.payload.query)] : [...state.allLoadedInstances],
          isLoading: false
        })
      }
      case getInstancesTypes.SHOW_INSTANCE:{
        const updateInstances = [...state.allLoadedInstances]
        const instance = state.allLoadedInstances?.find( i => i.Id === response.payload.id );
        instance.visible = true;
        return Object.assign({}, state, {
          allLoadedInstances:updateInstances,
          isLoading: false
        })
      }
      case getInstancesTypes.HIDE_INSTANCE:{
        const updateInst = [...state.allLoadedInstances]
        const match = state.allLoadedInstances?.find( i => i.Id === response.payload.id );
        match.visible = false;
        return Object.assign({}, state, {
          allLoadedInstances: updateInst,
          isLoading: false
        })
      }
      case getInstancesTypes.CHANGE_COLOR:{
        const updateInst = [...state.allLoadedInstances]
        const match = state.allLoadedInstances?.find( i => i.Id === response.payload.id );
        match.color = response.payload.color;
        return Object.assign({}, state, {
          allLoadedInstances: updateInst,
          isLoading: false
        })
      }
      case getInstancesTypes.FOCUS_INSTANCE:{
        const findInstance = state.allLoadedInstances?.find( i => i.Id === response.payload.id );
        return Object.assign({}, state, {
          focusInstance: findInstance,
          triggerFocus : response.payload.timeStamp,
          isLoading: false
        })
      }
      case getInstancesTypes.SELECT_INSTANCE:{
        const updateInstances = [...state.allLoadedInstances]
        updateInstances?.forEach( i => i.Id === response.payload.id ? i.selected = !i.selected : i.selected = false );
        return Object.assign({}, state, {
          allLoadedInstances:updateInstances,
          isLoading: false
        })
      }
     default:
        return state;
  }
}

export default InstancesReducer;
