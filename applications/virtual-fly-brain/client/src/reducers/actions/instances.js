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

export const InstancesById = async (queryId) => {

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