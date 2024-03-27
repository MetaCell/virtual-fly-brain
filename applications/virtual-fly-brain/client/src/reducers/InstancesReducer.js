import { getInstancesTypes } from './actions/types/getInstancesTypes';
import {SELECTED_COLOR, DESELECTED_COLOR, TEMPLATE_COLOR, SKELETON, CYLINDERS } from './../utils/constants';
import { loadInstances } from './../utils/instancesHelper'

export const initialStateInstancesReducer = {
  allPotentialInstances : [],
  allLoadedInstances : [],
  focusedInstance : undefined,
  threeDObjects : [],
  mappedCanvasData : [],
  stackViewerData : null,
  focusedInstance : "",
  event : {},
  isLoading: false,
  launchTemplate : null,
  error: false,
  errorMessage: undefined
};

const getMappedCanvasData = (loadedInstances) => {
  let updatedCanvasData = loadedInstances?.filter( m => m.meshCreated)?.map( instance => {
    let { color, visibleMesh, metadata } = instance;
    return {
      instancePath : metadata?.Id,
      visibility : visibleMesh || false,
      color,
      selected : instance.selected || false
    }
  })

  return updatedCanvasData;
}

const InstancesReducer = (state = initialStateInstancesReducer, response) => {
  switch (response.type) {
    case getInstancesTypes.LAUNCH_TEMPLATE:{
      if ( !response.payload.openTemplate ) {
        let loadedInstances = [...state.allLoadedInstances]
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
      let stackViewerData = state.stackViewerData;
      if ( newInstance.metadata?.IsTemplate ){
        newInstance.color = TEMPLATE_COLOR;
        newInstance.userSetColor = TEMPLATE_COLOR;
        stackViewerData = newInstance;
      } else {
        newInstance.color = DESELECTED_COLOR;
      }
      let launchTemplate = state.launchTemplate
      if ( newInstance.metadata.IsTemplate && !state.allLoadedInstances?.find( i => i?.metadata?.IsTemplate )) {
        launchTemplate = newInstance
      }
      
      let loadedInstances = state.allLoadedInstances?.find( i => i?.metadata?.Id === response.payload.Id ) ? [...state.allLoadedInstances] : [...state.allLoadedInstances, newInstance]
      let focused = state.focusedInstance;
      if ( response.payload.focus ) {
        focused = loadedInstances?.find( i => i?.metadata?.Id === response.payload.Id )
      }
      if ( response.payload.select ) {
        focused = loadedInstances?.find( i => i?.metadata?.Id === response.payload.Id )
        focused.selected = true;
        focused.color = SELECTED_COLOR
        loadedInstances?.forEach( i => { 
          if ( i.metadata?.Id !== focused.metadata?.Id ) {
            i.color = i.userSetColor || DESELECTED_COLOR
            i.selected = false;
          }
        })
      }
      
      return Object.assign({}, state, {
          allLoadedInstances: loadedInstances,
          stackViewerData : stackViewerData,
          launchTemplate : launchTemplate,
          focusedInstance : focused,
          event : { action : getInstancesTypes.ADD_INSTANCE, id : response.payload.Id, trigger : Date.now()},
          isLoading: false,
          error: false,
          errorMessage: undefined
        })
      }
      case getInstancesTypes.GET_INSTANCES_FAILURE:{
        return Object.assign({}, state, {
          error: true,
          errorMessage: response.payload.error,
        })
      }
      case getInstancesTypes.REMOVE_INSTANCES_SUCCESS:{
        let loadedInstances = [...state.allLoadedInstances.filter(i => i.metadata?.Id !== response.payload.query)];
        let focusedInstance = loadedInstances?.find( i => i?.metadata?.IsTemplate );

        const threeDObjects = [...state.threeDObjects];
        const matchObjects = threeDObjects.filter( o => !o.name.includes(response.payload.query));

        return Object.assign({}, state, {
          allLoadedInstances: loadedInstances,
          mappedCanvasData : getMappedCanvasData(loadedInstances),
          threeDObjects : matchObjects,
          focusedInstance : focusedInstance,
          event : { action : getInstancesTypes.UPDATE_INSTANCES, id : response.payload.query, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.REMOVE_ALL_INSTANCES_SUCCESS:{
        let loadedInstances = state.allLoadedInstances.filter( i => i?.metadata?.IsTemplate );

        return Object.assign({}, state, {
          allLoadedInstances: loadedInstances,
          mappedCanvasData : getMappedCanvasData(loadedInstances),
          threeDObjects : [],
          focusedInstance : loadedInstances[0],
          event : { action : getInstancesTypes.UPDATE_INSTANCES, id : response.payload.query, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.SHOW_3D:{
        const allLoadedInstances = [...state.allLoadedInstances]
        const matchInstance = allLoadedInstances?.find( i => i.metadata?.Id === response.payload.id );
        matchInstance.visible = true;
        matchInstance.visibleMesh = true;
        return Object.assign({}, state, {
          allLoadedInstances: allLoadedInstances,
          mappedCanvasData : getMappedCanvasData(allLoadedInstances),
          event : { action : getInstancesTypes.UPDATE_INSTANCES, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.HIDE_3D:{
        const allLoadedInstances = [...state.allLoadedInstances]
        const matchInstance = allLoadedInstances?.find( i => i.metadata?.Id === response.payload.id );
        matchInstance.visible = false;
        matchInstance.visibleMesh = false;
        return Object.assign({}, state, {
          allLoadedInstances: allLoadedInstances,
          mappedCanvasData : getMappedCanvasData(allLoadedInstances),
          event : { action : getInstancesTypes.UPDATE_INSTANCES, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.SHOW_3D_MESH:{
        const allLoadedInstances = [...state.allLoadedInstances]
        const matchInstance = allLoadedInstances?.find( i => i.metadata?.Id === response.payload.id );
        matchInstance.visibleMesh = true;
        return Object.assign({}, state, {
          allLoadedInstances: allLoadedInstances,
          mappedCanvasData : getMappedCanvasData(allLoadedInstances),
          event : { action : getInstancesTypes.UPDATE_INSTANCES, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.HIDE_3D_MESH:{
        const allLoadedInstances = [...state.allLoadedInstances]
        const matchInstance = allLoadedInstances?.find( i => i.metadata?.Id === response.payload.id );
        matchInstance.visibleMesh = false;
        return Object.assign({}, state, {
          allLoadedInstances: allLoadedInstances,
          mappedCanvasData : getMappedCanvasData(allLoadedInstances),
          event : { action : getInstancesTypes.UPDATE_INSTANCES, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.CHANGE_COLOR:{
        const allLoadedInstances = [...state.allLoadedInstances]
        let matchInstance = allLoadedInstances?.find( i => i.metadata?.Id === response.payload.id );
        matchInstance.color = response.payload.color;
        matchInstance.userSetColor = response.payload.color;
        const threeDObjects = [...state.threeDObjects];
        const matchObjects = threeDObjects.filter( o => o.name.includes(response.payload.id));
        if ( matchObjects?.length > 0 ) {
          matchObjects?.forEach( mo => 
            mo.children[0].material.color = response.payload.color
          )
        }

        return Object.assign({}, state, {
          allLoadedInstances : allLoadedInstances,
          threeDObjects : threeDObjects, 
          mappedCanvasData : getMappedCanvasData(allLoadedInstances),
          event : { action : getInstancesTypes.UPDATE_INSTANCES, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.FOCUS_INSTANCE:{
        const loadedInstances = [...state.allLoadedInstances]
        const findInstance = loadedInstances?.find( i => i.metadata?.Id === response.payload.id );
        return Object.assign({}, state, {
          focusedInstance: findInstance,
          event : { action : getInstancesTypes.FOCUS_INSTANCE, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.ZOOM_TO_INSTANCE:{
        const loadedInstances = [...state.allLoadedInstances]
        const findInstance = loadedInstances?.find( i => i.metadata?.Id === response.payload.id );
        return Object.assign({}, state, {
          focusedInstance: findInstance,
          event : { action : getInstancesTypes.ZOOM_TO_INSTANCE, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.SELECT_INSTANCE:{
        const allLoadedInstances = [...state.allLoadedInstances]
        const findInstance = allLoadedInstances?.find( i => i.metadata?.Id === response.payload.id );
        if ( findInstance ){
          findInstance.selected = !findInstance.selected;
          if ( findInstance.selected ) {
            findInstance.color = SELECTED_COLOR
            allLoadedInstances?.forEach( i => { 
              if ( i.metadata?.Id !== findInstance.metadata?.Id ) {
                i.color = i.userSetColor || DESELECTED_COLOR
                i.selected = false;
              }
            })
          } else {
            findInstance.color = findInstance.userSetColor || DESELECTED_COLOR
          }
        }

        const threeDObjects = [...state.threeDObjects];
        const matchObject = threeDObjects.find( o => o.name === response.payload.id );
        if ( matchObject ) {
          matchObject.selected = !matchObject.selected;
          if ( matchObject.selected ) matchObject.color = SELECTED_COLOR;
          else {
            matchObject.color = DESELECTED_COLOR;
          }
        }

        return Object.assign({}, state, {
          allLoadedInstances:allLoadedInstances,
          threeDObjects : threeDObjects,
          mappedCanvasData : getMappedCanvasData(allLoadedInstances),
          event : { action : getInstancesTypes.UPDATE_INSTANCES, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.GET_3D_OBJ_TYPE_STARTED:
        return Object.assign({}, state, {
        isLoading: true
      })
      case getInstancesTypes.GET_3D_OBJ_TYPE_SUCCESS:{
        const loadedInstances = [...state.allLoadedInstances];
        const matchLoadedInstance = loadedInstances.find( i => i.metadata?.Id === response.payload.id );
        const simpleInstance = response.payload;
        simpleInstance.color = matchLoadedInstance?.color;
        if ( matchLoadedInstance ) {
          matchLoadedInstance.visible = true;
          matchLoadedInstance.visibleMesh = true;
          matchLoadedInstance.meshCreated = true;
        }

        loadInstances(simpleInstance, state.allLoadedInstances)

        return Object.assign({}, state, {
          allLoadedInstances : loadedInstances,
          mappedCanvasData : getMappedCanvasData(loadedInstances),
          event : { action : getInstancesTypes.UPDATE_INSTANCES, id : response.payload.id, trigger : Date.now()},
          isLoading: false
        })}
      case getInstancesTypes.GET_3D_OBJ_TYPE_FAILURE:
        return Object.assign({}, state, {
          instanceOnFocus: response.payload.error,
          error: true
        })
      case getInstancesTypes.ADD_SKELETON:{
        const allLoadedInstances = [...state.allLoadedInstances]
        const instance = allLoadedInstances?.find( i => i.metadata?.Id === response.payload.id );
        const mode = response.payload.mode;
        const objectName = response.payload.id + mode;

        let skeleton = response.payload.skeleton;
        skeleton.visible = true;
        skeleton.name = objectName;

        const threeDObjects = [...state.threeDObjects];
        let matchMode = SKELETON;
        if ( mode === SKELETON ) matchMode = CYLINDERS;
        const matchObject = threeDObjects.find( o => o.name === response.payload.id  + matchMode );
        if ( matchObject ) {
          matchObject.visible = false;
          instance.skeleton[matchMode].visible = false;
        }

        if ( instance.skeleton ) {
          instance.skeleton[mode] = skeleton;
        } else {
          instance.skeleton = {};
          instance.skeleton[mode] = skeleton;
        }

        if ( !threeDObjects?.find( o => o.name === objectName) ) {
          threeDObjects.push(skeleton);
        }

        return Object.assign({}, state, {
          threeDObjects : threeDObjects,
          allLoadedInstances : allLoadedInstances,
          mappedCanvasData : getMappedCanvasData(allLoadedInstances),
          event : { 
            action : getInstancesTypes.UPDATE_INSTANCES,
            id : response.payload.id,
            mode : SKELETON,
            trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.SHOW_SKELETON:{
        const allLoadedInstances = [...state.allLoadedInstances]
        const instance = allLoadedInstances?.find( i => i.metadata?.Id === response.payload.id );

        if ( instance.skeleton?.skeleton ) {
          instance.skeleton.skeleton.visible = true;
        }

        const threeDObjects = [...state.threeDObjects];
        const matchObject = threeDObjects.find( o => o.name === response.payload.id  + SKELETON );
        if ( matchObject ) {
          matchObject.visible = true;
        }
        return Object.assign({}, state, {
          threeDObjects : threeDObjects,
          allLoadedInstances : allLoadedInstances,
          event : { 
            action : getInstancesTypes.UPDATE_SKELETON,
            id : response.payload.id,  
            mode : SKELETON,
            visible : true, 
            trigger : Date.now()
          },
          isLoading: false
        })
      }
      case getInstancesTypes.HIDE_SKELETON:{
        const allLoadedInstances = [...state.allLoadedInstances]
        const instance = allLoadedInstances?.find( i => i.metadata?.Id === response.payload.id );

        if ( instance.skeleton?.[SKELETON] ) {
          instance.skeleton[SKELETON].visible = false;
        }

        const threeDObjects = [...state.threeDObjects];
        
        const matchObject = threeDObjects.find( o => o.name === response.payload.id + SKELETON );
        if ( matchObject ){
          matchObject.visible = false;
        }
        return Object.assign({}, state, {
          threeDObjects : threeDObjects,
          allLoadedInstances : allLoadedInstances,
          event : { action : getInstancesTypes.UPDATE_SKELETON, mode : SKELETON, id : response.payload.id, visible : false, trigger : Date.now()},
          isLoading: false
        })
      }
      case getInstancesTypes.SHOW_CYLINDERS:{
        const allLoadedInstances = [...state.allLoadedInstances]
        const instance = allLoadedInstances?.find( i => i.metadata?.Id === response.payload.id );

        if ( instance.skeleton?.[CYLINDERS] ) {
          instance.skeleton[CYLINDERS].visible = true;
        }

        if ( instance.skeleton?.skeleton ) {
          instance.skeleton.skeleton.visible = false;
        }
        
        const threeDObjects = [...state.threeDObjects];
        const matchObject = threeDObjects.find( o => o.name === response.payload.id  + CYLINDERS );
        if ( matchObject ) {
          matchObject.visible = true;
        }
        const matchSkeleton = threeDObjects.find( o => o.name === response.payload.id  + SKELETON );
        if ( matchSkeleton ) {
          matchSkeleton.visible = false;
        }

        return Object.assign({}, state, {
          threeDObjects : threeDObjects,
          allLoadedInstances : allLoadedInstances, 
          event : { 
            action : getInstancesTypes.UPDATE_SKELETON, 
            id : response.payload.id,  
            mode : CYLINDERS,
            visible : true, 
            trigger : Date.now()
          },
          isLoading: false
        })
      }
      case getInstancesTypes.SHOW_LINES:{
        const allLoadedInstances = [...state.allLoadedInstances]
        const instance = allLoadedInstances?.find( i => i.metadata?.Id === response.payload.id );

        if ( instance.skeleton?.[CYLINDERS] ) {
          instance.skeleton[CYLINDERS].visible = false;
        }

        if ( instance.skeleton?.[SKELETON] ) {
          instance.skeleton[SKELETON].visible = true;
        }
        
        const threeDObjects = [...state.threeDObjects];
        const matchObject = threeDObjects.forEach( o => o.name.includes(response.payload.id) ? matchObject.visible = true : null );
        if ( matchObject ) {
          matchObject.visible = true;
        }
        const matchLines = threeDObjects.find( o => o.name === response.payload.id  + CYLINDERS );
        if ( matchLines ) {
          matchLines.visible = false;
        }
        return Object.assign({}, state, {
          threeDObjects : threeDObjects,
          allLoadedInstances : allLoadedInstances, 
          event : { 
            action : getInstancesTypes.UPDATE_SKELETON, 
            id : response.payload.id,  
            mode : SKELETON,
            visible : true, 
            trigger : Date.now()
          },
          isLoading: false
        })
      }
     default:
        return state;
  }
}

export default InstancesReducer;
