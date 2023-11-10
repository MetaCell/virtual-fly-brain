import store from '../../store';
import { get_instance } from "../../network/query"
import { getInstancesTypes } from './types/getInstancesTypes';

const getInstancesSuccess = query => ({
  type: getInstancesTypes.GET_INSTANCES_SUCCESS,
  payload: {
    ...query
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

const removeInstancesSuccess = query => ({
  type: getInstancesTypes.REMOVE_INSTANCES_SUCCESS,
  payload: {
    query
  }
});

const selectInstanceMessage = id => ({
  type: getInstancesTypes.SELECT_INSTANCE,
  payload: {
    id
  }
});

const showInstanceSkeletonMessage = id => ({
  type: getInstancesTypes.SHOW_SKELETON,
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

const show3DVolumeMessage = id => ({
  type: getInstancesTypes.SHOW_3D_VOLUME,
  payload: {
    id
  }
});

const hide3DVolumeMessage = id => ({
  type: getInstancesTypes.HIDE_3D_VOLUME,
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

const removeInstancesFailure = error => ({
  type: getInstancesTypes.REMOVE_INSTANCES_FAILURE,
  payload: {
    error
  }
});

export const getInstanceByID = async (queryId) => {

  store.dispatch(getInstancesStarted())

  let response

  try {
    response = await get_instance(queryId);
  } catch (error) {
    store.dispatch(getInstancesFailure(error.message))
    return
  }

  store.dispatch(getInstancesSuccess(response))
}

export const removeInstanceByID = async (queryId) => {
  try {
    store.dispatch(removeInstancesSuccess(queryId))
  } catch (error) {
    store.dispatch(removeInstancesFailure(error.message))
    return
  }
}

export const selectInstance = async (id) => {
  store.dispatch(selectInstanceMessage(id))
}

export const selectInstanceSkeleton = async (id) => {
  store.dispatch(showInstanceSkeletonMessage(id))
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

export const show3DVolume = async (id) => {
  store.dispatch(show3DVolumeMessage(id))
}

export const hide3DVolume = async (id) => {
  store.dispatch(hide3DVolumeMessage(id))
}

export const changeColor = async (id, color) => {
  store.dispatch(changeColorMessage(id, color))
}

export const focusInstance = async (id) => {
  store.dispatch(focusInstanceMessage(id))
}
