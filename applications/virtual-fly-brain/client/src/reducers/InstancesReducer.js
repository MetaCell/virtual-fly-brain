import { getInstancesTypes } from './actions/types/getInstancesTypes';
import {SELECTED_COLOR, DESELECTED_COLOR, TEMPLATE_COLOR} from './../utils/constants';
import SimpleInstance from "@metacell/geppetto-meta-core/model/SimpleInstance";
import { augmentInstancesArray } from '@metacell/geppetto-meta-core/Instances';
import SharkViewer, { swcParser } from '@janelia/sharkviewer';
import * as THREE from 'three';

export const initialStateInstancesReducer = {
  allPotentialInstances : [],
  allLoadedInstances : [],
  simpleInstances : [],
  focusedInstance : "",
  event : {},
  isLoading: false,
  launchTemplate : null,
  error: false
};

//TODO : Refactor into reducer
const loadInstances = (instance, simpleInstances) =>{
  const instance1 = new SimpleInstance(instance)
  instance1.color = instance.color;
  let instances = window.Instances;
  if ( instances === undefined ){
    instances = [];
  }
  instances?.find( i => i.wrappedObj?.id === instance.id ) ? null : window.Instances = [...instances, instance1]
  let that = this;
  window.Instances.forEach( inst => {
    inst.color = simpleInstances?.find( i => inst.wrappedObj.id === i.Id )?.color;
  })
  augmentInstancesArray(window.Instances);
}


//TODO : Refactor into reducer
const showSkeleton = (targetInstance, mode, visible) => {
  let that = this;
  let allLoadedInstances = props.allLoadedInstances;
  let match = allLoadedInstances?.find ( inst => inst.metadata?.Id === targetInstance?.metadata?.Id );

  if ( targetInstance?.skeleton?.[mode] === undefined ) {
      // Initialize shark viewer to load SWC
      let sharkviewer = new SharkViewer({ dom_element: "canvas" });
      sharkviewer.mode = mode;
      sharkviewer.three_colors = [];
      Object.keys(sharkviewer.colors).forEach(color => {
        sharkviewer.three_colors.push(new THREE.Color(sharkviewer.colors[color]));
      })
      sharkviewer.three_materials = [];
      Object.keys(sharkviewer.colors).forEach(color => {
        sharkviewer.three_materials.push(
          new THREE.MeshBasicMaterial({
            color: sharkviewer.colors[color],
            wireframe: false
          })
        );
      });
      fetch(match.metadata?.Images?.[Object.keys(match.metadata?.Images)[0]][0].swc)
        .then(response => response.text())
        .then(base64Content => {
          const swcJSON = swcParser(base64Content);
          let neuron = sharkviewer.createNeuron(swcJSON, targetInstance?.metadata?.Id, that?.canvasRef?.current?.threeDEngine?.renderer);
          match.skeleton = { ...match.skeleton, visible : true, [mode] : { visible : true, neuron : neuron }};
          neuron.name = targetInstance?.metadata?.Id + mode;
      })
  } else {
    match.skeleton.visible = visible;
    match.skeleton[mode].visible = visible;
  }
}

//TODO : Refactor into reducer
const getProxyInstances = (simpleInstances) => {
  return window.Instances.map(i => (
    { ...i,
      instancePath: i.getId(),
      visibility : simpleInstances?.find( cd => cd.instancePath === i.getId())?.visibility,
      color : i.color
    }
  ))
}

//TODO : Refactor into reducer
const updateColors = ( inst) => {
  let match = state.simpleInstances?.find( m => m.instancePath === inst?.metadata?.Id )
  let color = inst.color;
  let colorMatch = match?.color?.b === color?.b && match?.color?.r === color?.r && match?.color?.g === color?.g;
  if ( !colorMatch && inst?.color && match ){
      match.color = color;
  }
}

const InstancesReducer = (state = initialStateInstancesReducer, response) => {
  switch (response.type) {
    case getInstancesTypes.LAUNCH_TEMPLATE:{
      if ( !response.payload.openTemplate ) {
        let loadedInstances = state.allLoadedInstances?.find( i => i?.metadata?.Id === response.payload.id ) ? [...state.allLoadedInstances] : [...state.allLoadedInstances, state.launchTemplate]
        return Object.assign({}, state, {
            allLoadedInstances: loadedInstances,
            launchTemplate : null,
            focusedInstance : loadedInstances?.find( i => i?.metadata?.Id === response.payload.id ),
            event : { action : getInstancesTypes.ADD_INSTANCE, id : response.payload.id, trigger : Date.now()},
            isLoading: false
        })
      } else {
        return Object.assign({}, state, {
            launchTemplate : null
        })
      }
    } 
    case getInstancesTypes.GET_INSTANCES_STARTED: {
        return Object.assign({}, state, {
           isLoading: true
        })
      }
     case getInstancesTypes.GET_INSTANCES_SUCCESS:{
      const newInstance = { metadata : response.payload };
      newInstance.visible = true;
      if ( newInstance.metadata?.IsTemplate ){
        newInstance.color = TEMPLATE_COLOR;
      } else {
        newInstance.color = DESELECTED_COLOR;
      }
      if ( newInstance.IsTemplate && state.allLoadedInstances?.find( i => i?.metadata?.IsTemplate )) {
        return Object.assign({}, state, {
          launchTemplate: newInstance
        })
      }
      let loadedInstances = state.allLoadedInstances?.find( i => i?.metadata?.Id === response.payload.Id ) ? [...state.allLoadedInstances] : [...state.allLoadedInstances, newInstance]
      return Object.assign({}, state, {
          allLoadedInstances: loadedInstances,
          focusedInstance : loadedInstances?.find( i => i?.metadata?.Id === response.payload.Id ),
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
        let loadedInstances = [...state.allLoadedInstances.filter(i => i.metadata?.Id !== response.payload.query)];
        let focusedInstance = state.focusedInstance;
        if ( loadedInstances.length === 1 && loadedInstances[0]?.metadata.IsTemplate ){
          focusedInstance = loadedInstances[0];
        }
        return Object.assign({}, state, {
          allLoadedInstances: loadedInstances,
          focusedInstance : focusedInstance,
          event : { action : getInstancesTypes.REMOVE_INSTANCES_SUCCESS, id : response.payload.query, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.SHOW_3D_MESH:{
        const updateInstances = [...state.allLoadedInstances]
        const instance = state.allLoadedInstances?.find( i => i.metadata?.Id === response.payload.id );
        instance.visible = true;
        return Object.assign({}, state, {
          allLoadedInstances:updateInstances,
          event : { action : getInstancesTypes.SHOW_3D_MESH, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.HIDE_3D_MESH:{
        const updateInst = [...state.allLoadedInstances]
        const match = state.allLoadedInstances?.find( i => i.metadata?.Id === response.payload.id );
        match.visible = false;
        return Object.assign({}, state, {
          allLoadedInstances: updateInst,
          event : { action : getInstancesTypes.HIDE_3D_MESH, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.CHANGE_COLOR:{
        const updateInst = [...state.allLoadedInstances]
        const match = state.allLoadedInstances?.find( i => i.metadata?.Id === response.payload.id );
        match.color = response.payload.color;
        return Object.assign({}, state, {
          allLoadedInstances: updateInst,
          event : { action : getInstancesTypes.CHANGE_COLOR, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.FOCUS_INSTANCE:{
        const findInstance = state.allLoadedInstances?.find( i => i.metadata?.Id === response.payload.id );
        return Object.assign({}, state, {
          focusInstance: findInstance,
          event : { action : getInstancesTypes.FOCUS_INSTANCE, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.SELECT_INSTANCE:{
        const updateInstances = [...state.allLoadedInstances]
        updateInstances?.forEach( i => { 
          if ( i.metadata?.Id === response.payload.id ) {
            i.selected = !i.selected;
            if ( i.selected ) i.color = SELECTED_COLOR;
            else if ( !i.selected && i.metadata?.IsTemplate ) i.color = TEMPLATE_COLOR;
            else {
              i.color = DESELECTED_COLOR;
            } 
          }
        });
        return Object.assign({}, state, {
          allLoadedInstances:updateInstances,
          event : { action : getInstancesTypes.SELECT_INSTANCE, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.GET_3D_OBJ_TYPE_STARTED:
        return Object.assign({}, state, {
        isLoading: true
      })
      case getInstancesTypes.GET_3D_OBJ_TYPE_SUCCESS:{
        const matchLoadedInstance = state.allLoadedInstances.find( i => i.metadata?.Id === response.payload.Id );
        const simpleInstance = response.payload;
        const simpleInstances = [...state.simpleInstances]
        simpleInstance.color = matchLoadedInstance?.color;
        loadInstances(simpleInstance, simpleInstances)
        const data = getProxyInstances(simpleInstances);
        const newData = data.map((item) => {
          return {
            color: item.color,
            instancePath: item.instancePath,
            visibility : true
          };
        });
        simpleInstance.setGeometryType && simpleInstance.setGeometryType('cylinders')
      
        return Object.assign({}, state, {
          simpleInstances : newData,
          event : { action : getInstancesTypes.UPDATE_INSTANCES, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })}
      case getInstancesTypes.GET_3D_OBJ_TYPE_FAILURE:
        return Object.assign({}, state, {
          instanceOnFocus: response.payload.error,
          error: true
        })
      case getInstancesTypes.ADD_SKELETON:{
        const updateInstances = [...state.allLoadedInstances]
        const instance = state.allLoadedInstances?.find( i => i.metadata?.Id === response.payload.id );
        if ( instance?.skeleton ) instance.skeleton.visible = true;
        return Object.assign({}, state, {
          allLoadedInstances:updateInstances,
          event : { action : getInstancesTypes.ADD_SKELETON, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.SHOW_SKELETON:{
        const updateInstances = [...state.allLoadedInstances]
        const match = state.allLoadedInstances?.find( i => i.metadata?.Id === response.payload.id );
        if ( match?.skeleton ) match.skeleton.visible = true;
        return Object.assign({}, state, {
          allLoadedInstances:updateInstances,
          event : { action : getInstancesTypes.SHOW_SKELETON, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.HIDE_SKELETON:{
        const updateInstances = [...state.allLoadedInstances]
        const instance = state.allLoadedInstances?.find( i => i.metadata?.Id === response.payload.id );
        if ( instance?.skeleton ) instance.skeleton.visible = false;
        return Object.assign({}, state, {
          allLoadedInstances:updateInstances,
          event : { action : getInstancesTypes.HIDE_SKELETON, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.SHOW_CYLINDERS:{
        const updateInstances = [...state.allLoadedInstances]
        const instance = state.allLoadedInstances?.find( i => i.metadata?.Id === response.payload.id );
        instance.skeleton.visible = true;
        return Object.assign({}, state, {
          allLoadedInstances:updateInstances,
          event : { action : getInstancesTypes.SHOW_CYLINDERS, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.SHOW_LINES:{
        const updateInstances = [...state.allLoadedInstances]
        const instance = state.allLoadedInstances?.find( i => i.metadata?.Id === response.payload.id );
        instance.skeleton.visible = true;
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
