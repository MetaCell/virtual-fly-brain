import { getInstancesTypes } from './reducers/actions/types/getInstancesTypes';
import { getQueriesTypes } from './reducers/actions/types/getQueriesTypes';

function updateUrlParameterWithCurrentUrl(param, value) {
  const urlObj = new URL(window.location.href);
  urlObj.searchParams.set(param, value);
  window.history.replaceState(window.history.state, '', urlObj.toString());
}

export const urlUpdaterMiddleware = store => next => action => {
  next(action);

// id= specify the focus term we should have when the ui loads
// id= supports only 1 id
// if the user gives us an array of ids (comma separated) just parse the first
// if the first does not exist just go to the template id and set this one as the focus term
// the default id that we load is VFB_00101567, so if we try to load something and we don’t get anything in return just load the default template.
// this paramater circle back to the url

  if (action.type === getInstancesTypes.GET_INSTANCES_SUCCESS) {
    updateUrlParameterWithCurrentUrl("id", action.payload.Id);
  }

  // i= specify the list of ids that we should have in the scene when the ui is loaded
  // this could be an array of ids
  // all the ids that are passed to this parameter are part of the scene upon loding the url.
  // this paramater circle back to the url

  if (action.type === getInstancesTypes.GET_3D_OBJ_TYPE_SUCCESS) {
    updateUrlParameterWithCurrentUrl("i", action.payload.id);
  }

  // q= specify which query results we want to have opened by default for a certain id
  // when using q= the query results component should be opened by default, even if the results to display are 0.
  // q= needs to support the query type that we use in the vfbqueries library (e.g. ListAllAvailableImages, SimilarMorphologyTo, etc), and comma separated the id instance for which
  if (action.type === getQueriesTypes.UPDATE_QUERIES || action.type === getQueriesTypes.GET_QUERIES_SUCCESS) {
    updateUrlParameterWithCurrentUrl("q", action.payload.shortform);
  }
};