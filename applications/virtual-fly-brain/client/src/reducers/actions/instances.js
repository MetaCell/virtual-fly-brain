import store from '../../store';
import { get_3d_mesh, get_instance } from "../../network/query"
import { getInstancesTypes } from './types/getInstancesTypes';

const getInstancesSuccess = ( query, mesh, focus, select, stackInstance) => ({
  type: getInstancesTypes.GET_INSTANCES_SUCCESS,
  payload: {
    ...query,
    get3DMesh : mesh,
    focus : focus,
    select : select,
    stackInstance : stackInstance
  }
});

const getInstancesStarted = () => ({
  type: getInstancesTypes.GET_INSTANCES_STARTED
});

const getInstancesFailure = error => ({
  type: getInstancesTypes.GET_INSTANCES_FAILURE,
  payload: {
    error
  }
});

const get3DOBJSuccess = query => ({
  type: getInstancesTypes.GET_3D_OBJ_TYPE_SUCCESS,
  payload: {
    ...query
  }
});

const get3DOBJStarted = () => ({
  type: getInstancesTypes.GET_3D_OBJ_TYPE_STARTED
});

const get3DOBJFailure = error => ({
  type: getInstancesTypes.GET_3D_OBJ_TYPE_FAILURE,
  payload: {
    error
  }
});

const removeInstancesSuccess = query => ({
  type: getInstancesTypes.REMOVE_INSTANCES_SUCCESS,
  payload: {
    query
  }
});

const removeAllInstancesSuccess = () => ({
  type: getInstancesTypes.REMOVE_ALL_INSTANCES_SUCCESS,
  payload: {}
});

const selectInstanceMessage = id => ({
  type: getInstancesTypes.SELECT_INSTANCE,
  payload: {
    id
  }
});

const augmentedInstances = instancesList => ({
  type: getInstancesTypes.AUGMENTED_INSTANCES,
  payload: {
    instancesList
  }
});

const showInstanceSkeletonMessage = id => ({
  type: getInstancesTypes.SHOW_SKELETON,
  payload: {
    id
  }
});

const addInstanceSkeletonMessage = (skeleton, mode, id) => ({
  type: getInstancesTypes.ADD_SKELETON,
  payload: {
    id,
    mode,
    skeleton
  }
});

const hideInstanceSkeletonMessage = id => ({
  type: getInstancesTypes.HIDE_SKELETON,
  payload: {
    id
  }
});

const show3DSkeletonCylindersMessage = id => ({
  type: getInstancesTypes.SHOW_CYLINDERS,
  payload: {
    id
  }
});

const show3DSkeletonLinesMessage = id => ({
  type: getInstancesTypes.SHOW_LINES,
  payload: {
    id
  }
});

const showInstanceCylinderMessage = id => ({
  type: getInstancesTypes.SHOW_CYLINDER,
  payload: {
    id
  }
});

const show3DMeshMessage = id => ({
  type: getInstancesTypes.SHOW_3D_MESH,
  payload: {
    id
  }
});

const hide3DMeshMessage = id => ({
  type: getInstancesTypes.HIDE_3D_MESH,
  payload: {
    id
  }
});

const show3DMessage = id => ({
  type: getInstancesTypes.SHOW_3D,
  payload: {
    id
  }
});

const hide3DMessage = id => ({
  type: getInstancesTypes.HIDE_3D,
  payload: {
    id
  }
});

const changeColorMessage = (id, color) => ({
  type: getInstancesTypes.CHANGE_COLOR,
  payload: {
    id,
    color
  }
});

const focusInstanceMessage = (id) => ({
  type: getInstancesTypes.FOCUS_INSTANCE,
  payload: {
    id
  }
});

const zoomToInstanceMessage = (id) => ({
  type: getInstancesTypes.ZOOM_TO_INSTANCE,
  payload: {
    id
  }
});

const removeInstancesFailure = error => ({
  type: getInstancesTypes.REMOVE_INSTANCES_FAILURE,
  payload: {
    error
  }
});

const templateLoadedMessage = (id, openTemplate) => ({
  type: getInstancesTypes.LAUNCH_TEMPLATE,
  payload: {
    id,
    openTemplate
  }
});

export const triggerInstanceFailure = (error) => {
  store.dispatch(getInstancesFailure(error));
  return;
}

export const getInstanceByID = async (queryId, get3DMesh, focus, select, stackInstance) => {
  store.dispatch(getInstancesStarted())
  let response
  try {
    response = await get_instance(queryId);
  } catch (error) {
    store.dispatch(getInstancesFailure(error.message))
    return
  }

  if ( response === undefined || response === null ) {
    store.dispatch(getInstancesFailure("ID not found : " + queryId))
    return
  }

  const _get3DMesh = response?.IsIndividual ? true : false;
  const _stackInstance = response?.IsIndividual ? true : false;
  const _focus = focus !== undefined ? focus : true;
  const _select = select !== undefined ? select : true;

  store.dispatch(getInstancesSuccess(response, _get3DMesh, _focus, _select , _stackInstance))
}

export const get3DMesh = async (instance) => {
  let mesh_response;
  try {
    let objURL = instance?.Images?.[Object.keys(instance?.Images)[0]][0].obj;
    if ( objURL ) {
      mesh_response = await get_3d_mesh(instance, objURL);
    }
  } catch (error) {
    store.dispatch(get3DOBJFailure(error.message))
    return
  }

  if ( mesh_response === undefined ) {
    store.dispatch(get3DOBJFailure("ID not found : " + queryId))
    return
  }
  store.dispatch(get3DOBJSuccess(mesh_response))
}

export const removeInstanceByID = async (queryId) => {
  try {
    store.dispatch(removeInstancesSuccess(queryId))
  } catch (error) {
    store.dispatch(removeInstancesFailure(error.message))
    return
  }
}

export const removeAllInstances = async () => {
  try {
    store.dispatch(removeAllInstancesSuccess())
  } catch (error) {
    store.dispatch(removeInstancesFailure(error.message))
    return
  }
}

export const selectInstance = async (id) => {
  store.dispatch(selectInstanceMessage(id))
}

export const add3DSkeleton = async (skeleton,mode, id) => {
  store.dispatch(addInstanceSkeletonMessage(skeleton, mode, id))
}

export const show3DSkeleton = async (id) => {
  store.dispatch(showInstanceSkeletonMessage(id))
}

export const hide3DSkeleton = async (id) => {
  store.dispatch(hideInstanceSkeletonMessage(id))
}

export const show3DSkeletonLines = async (id) => {
  store.dispatch(show3DSkeletonLinesMessage(id))
}

export const show3DSkeletonCylinders = async (id) => {
  store.dispatch(show3DSkeletonCylindersMessage(id))
}

export const selecteInstanceCylinder = async (id) => {
  store.dispatch(showInstanceCylinderMessage(id))
}

export const show3DMesh = async (id) => {
  store.dispatch(show3DMeshMessage(id))
}

export const hide3DMesh = async (id) => {
  store.dispatch(hide3DMeshMessage(id))
}

export const show3D = async (id) => {
  store.dispatch(show3DMessage(id))
}

export const hide3D = async (id) => {
  store.dispatch(hide3DMessage(id))
}

export const changeColor = async (id, color) => {
  store.dispatch(changeColorMessage(id, color))
}

export const focusInstance = async (id) => {
  store.dispatch(focusInstanceMessage(id))
}

export const zoomToInstance = async (id) => {
  store.dispatch(zoomToInstanceMessage(id))
}

export const templateLoaded = async (id, openTemplate) => {
  store.dispatch(templateLoadedMessage(id, openTemplate))
}
