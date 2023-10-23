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

const showInstanceMessage = id => ({
  type: getInstancesTypes.SHOW_INSTANCE,
  payload: {
    id
  }
});

const hideInstanceMessage = id => ({
  type: getInstancesTypes.HIDE_INSTANCE,
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

export const showInstance = async (id) => {
  store.dispatch(showInstanceMessage(id))
}

export const hideInstance = async (id) => {
  store.dispatch(hideInstanceMessage(id))
}

export const changeColor = async (id, color) => {
  store.dispatch(changeColorMessage(id, color))
}
