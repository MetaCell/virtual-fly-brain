import { getInstancesTypes } from './reducers/actions/types/getInstancesTypes';
import { getQueriesTypes } from './reducers/actions/types/getQueriesTypes';
import { getInstanceByID } from './reducers/actions/instances';
import { get3DMesh } from './reducers/actions/instances';
import { show3DMesh } from './reducers/actions/instances';
import { get_instance } from './network/query';

function updateUrlParameterWithCurrentUrl(param, value) {
  const urlObj = new URL(window.location.href);
  if (urlObj.searchParams.has(param)) {
    const existingValue = urlObj.searchParams.get(param);
    const existingValuesArray = existingValue.split(',');
    const newValuesArray = value.split(',');
    const mergedValuesArray = [...new Set(existingValuesArray.concat(newValuesArray))];
    const updatedValue = mergedValuesArray.join(',');
    urlObj.search = urlObj.search.replace(new RegExp(`${param}=[^&]*`), `${param}=${updatedValue}`);
  } else {
    urlObj.searchParams.set(param, value);
  }
  window.history.replaceState(null, '', urlObj.toString());
}

async function fetchAndDispatchMeshes(threeDMeshes) {
  for (const id of threeDMeshes) {
    const instance = await get_instance(id);
    get3DMesh(instance);
  }
}

const DEFAULT_ID = "VFB_00101567"; 
const APP_LOADED_FLAG_KEY = "CURRENT_LOADED_URL";

const isFirstTimeLoad = () => {
  const appLoadedUrl = localStorage.getItem(APP_LOADED_FLAG_KEY);
  const currentUrl = window.location.href ;
  if ( currentUrl != appLoadedUrl )
  {
    localStorage.setItem(APP_LOADED_FLAG_KEY, currentUrl);
    return true ;
  }
  return false ;
};

const getUrlParameter = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

export const urlUpdaterMiddleware = store => next => action => {
  next(action);

  if (isFirstTimeLoad()) {
    // Load id parameter from URL and dispatch action
    const idFromUrl = getUrlParameter("id");
    let idToUpdate = undefined;

    if (idFromUrl) {
      if (typeof idFromUrl === 'string' && idFromUrl.includes(',')) {
        const firstIdToUpdate = idFromUrl.split(',')[0];
        idToUpdate = firstIdToUpdate;
      } else {
        idToUpdate = idFromUrl;
      }
    }
    if (!idToUpdate) {
      idToUpdate = DEFAULT_ID;
    }

    getInstanceByID(idToUpdate);

    // Load i parameter from URL and dispatch action
    const iFromUrl = getUrlParameter("i");
    let threeDMeshes = [];

    if (iFromUrl) {
      if (typeof iFromUrl === 'string' && iFromUrl.includes(',')) {
        threeDMeshes = iFromUrl.split(',');
      } else {
        threeDMeshes.push(iFromUrl);
      }
    }

    if ((threeDMeshes.length == 0 && idToUpdate) || (threeDMeshes.length > 0 && threeDMeshes.indexOf(idToUpdate) == -1))
      threeDMeshes.push(idToUpdate);
    
    fetchAndDispatchMeshes(threeDMeshes);

    // Load q parameter from URL and dispatch action
    // const qFromUrl = getUrlParameter("q");
    // if (qFromUrl) {

    // }
  }

  if (action.type === getInstancesTypes.GET_INSTANCES_SUCCESS) {
    let idToUpdate = action.payload.Id;
    updateUrlParameterWithCurrentUrl("id", idToUpdate);
  }

  if (action.type === getInstancesTypes.GET_3D_OBJ_TYPE_SUCCESS) {
    const threeDMeshId = action.payload.id ;
    updateUrlParameterWithCurrentUrl("i", threeDMeshId);
    show3DMesh(threeDMeshId);
  }

  if (action.type === getQueriesTypes.UPDATE_QUERIES || action.type === getQueriesTypes.GET_QUERIES_SUCCESS) {
    updateUrlParameterWithCurrentUrl("q", action.payload.shortform);
  }
};