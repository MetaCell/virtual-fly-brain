import { getInstancesTypes } from './actions/types/getInstancesTypes';
import {SELECTED_COLOR, DESELECTED_COLOR} from './../utils/constants';

export const initialStateInstancesReducer = {
  allPotentialInstances : [],
  allLoadedInstances : [],
  focusInstance : "",
  event : {},
  isLoading: false,
  augmentedInstances: "",
  error: false
};

const InstancesReducer = (state = initialStateInstancesReducer, response) => {
  switch (response.type) {
    case getInstancesTypes.AUGMENTED_INSTANCES: {
      return Object.assign({}, state, {
         augmentedInstances: response.payload.instancesList
      })
    }
     case getInstancesTypes.GET_INSTANCES_STARTED: {
        return Object.assign({}, state, {
           isLoading: true
        })
      }
     case getInstancesTypes.GET_INSTANCES_SUCCESS:{
      const newInstance = response.payload;
      newInstance.visible = true;
      newInstance.color = DESELECTED_COLOR;
      let loadedInstances = state.allLoadedInstances?.find( i => i.Id === response.payload.Id ) ? [...state.allLoadedInstances] : [...state.allLoadedInstances, newInstance]
      return Object.assign({}, state, {
          allLoadedInstances: loadedInstances,
          event : { action : getInstancesTypes.ADD_INSTANCE, id : response.payload.Id, trigger : Date.now()},
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
      case getInstancesTypes.SHOW_3D_MESH:{
        const updateInstances = [...state.allLoadedInstances]
        const instance = state.allLoadedInstances?.find( i => i.Id === response.payload.id );
        instance.visible = true;
        return Object.assign({}, state, {
          allLoadedInstances:updateInstances,
          event : { action : getInstancesTypes.SHOW_3D_MESH, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.HIDE_3D_MESH:{
        const updateInst = [...state.allLoadedInstances]
        const match = state.allLoadedInstances?.find( i => i.Id === response.payload.id );
        match.visible = false;
        return Object.assign({}, state, {
          allLoadedInstances: updateInst,
          event : { action : getInstancesTypes.HIDE_3D_MESH, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.CHANGE_COLOR:{
        const updateInst = [...state.allLoadedInstances]
        const match = state.allLoadedInstances?.find( i => i.Id === response.payload.id );
        match.color = response.payload.color;
        return Object.assign({}, state, {
          allLoadedInstances: updateInst,
          event : { action : getInstancesTypes.CHANGE_COLOR, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.FOCUS_INSTANCE:{
        const findInstance = state.allLoadedInstances?.find( i => i.Id === response.payload.id );
        return Object.assign({}, state, {
          focusInstance: findInstance,
          event : { action : getInstancesTypes.FOCUS_INSTANCE, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.SELECT_INSTANCE:{
        const updateInstances = [...state.allLoadedInstances]
        updateInstances?.forEach( i => { 
          if ( i.Id === response.payload.id ) {
            i.selected = !i.selected;
            if ( i.selected ) i.color = SELECTED_COLOR;
            else if ( !i.selected ) i.color = DESELECTED_COLOR;
           } else {
            i.selected = false;
            i.color = DESELECTED_COLOR;
           } 
        });
        return Object.assign({}, state, {
          allLoadedInstances:updateInstances,
          event : { action : getInstancesTypes.SELECT_INSTANCE, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.ADD_SKELETON:{
        const updateInstances = [...state.allLoadedInstances]
        const instance = state.allLoadedInstances?.find( i => i.Id === response.payload.id );
        instance.visible = true;
        return Object.assign({}, state, {
          allLoadedInstances:updateInstances,
          event : { action : getInstancesTypes.ADD_SKELETON, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.SHOW_SKELETON:{
        const updateInstances = [...state.allLoadedInstances]
        const instance = state.allLoadedInstances?.find( i => i.Id === response.payload.id );
        instance.visible = true;
        return Object.assign({}, state, {
          allLoadedInstances:updateInstances,
          event : { action : getInstancesTypes.SHOW_SKELETON, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.HIDE_SKELETON:{
        const updateInstances = [...state.allLoadedInstances]
        const instance = state.allLoadedInstances?.find( i => i.Id === response.payload.id );
        instance.visible = false;
        return Object.assign({}, state, {
          allLoadedInstances:updateInstances,
          event : { action : getInstancesTypes.HIDE_SKELETON, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.SHOW_CYLINDERS:{
        const updateInstances = [...state.allLoadedInstances]
        const instance = state.allLoadedInstances?.find( i => i.Id === response.payload.id );
        instance.visible = true;
        return Object.assign({}, state, {
          allLoadedInstances:updateInstances,
          event : { action : getInstancesTypes.SHOW_CYLINDERS, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.SHOW_LINES:{
        const updateInstances = [...state.allLoadedInstances]
        const instance = state.allLoadedInstances?.find( i => i.Id === response.payload.id );
        instance.visible = true;
        return Object.assign({}, state, {
          allLoadedInstances:updateInstances,
          event : { action : getInstancesTypes.SHOW_LINES, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
     default:
        return state;
  }
}

export default InstancesReducer;
