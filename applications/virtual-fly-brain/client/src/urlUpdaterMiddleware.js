import { getInstancesTypes } from './reducers/actions/types/getInstancesTypes';
import { getQueriesTypes } from './reducers/actions/types/getQueriesTypes';
import { getInstanceByID, selectInstance, focusInstance } from './reducers/actions/instances';
import { getQueries } from './reducers/actions/queries';
import { setQueryComponentOpened, setFirstIDLoaded } from './reducers/actions/globals';

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

const DEFAULT_ID = "VFB_00101567"; 
const APP_LOADED_FLAG_KEY = "CURRENT_LOADED_URL";

const isFirstTimeLoad = (allLoadedInstances) => {
  const appLoadedUrl = localStorage.getItem(APP_LOADED_FLAG_KEY);
  const currentUrl = window.location.href ;
  if ( currentUrl != appLoadedUrl )
  {
    localStorage.setItem(APP_LOADED_FLAG_KEY, currentUrl);
    // Load id parameter from URL and dispatch action
    const idFromUrl = getUrlParameter("id");
    let idToUpdate = DEFAULT_ID;
    
    if (idFromUrl) {
      idToUpdate = idFromUrl?.split(',')?.[0];
    }
    
    getInstance(allLoadedInstances,idToUpdate);
  }
};

const getUrlParameter = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

const getInstance = (allLoadedInstances, id) => {
  if ( !allLoadedInstances?.find( i => i.metadata?.Id === id ) ){
    getInstanceByID(id, true);
  }
}

export const urlUpdaterMiddleware = store => next => (action) => {
  next(action);
  const allLoadedInstances = store.getState().instances.allLoadedInstances;

  isFirstTimeLoad(allLoadedInstances)

  switch (action.type) {
    case getInstancesTypes.GET_3D_OBJ_TYPE_SUCCESS : {
        const threeDMeshId = action.payload.id ;
        updateUrlParameterWithCurrentUrl("i", threeDMeshId);
        break;
    }
    case getInstancesTypes.GET_INSTANCES_SUCCESS : {
        const threeDMeshId = action.payload.Id ;
        const firstIDLoaded = store.getState().globalInfo.firstIDLoaded;
        const singleInstanceLoaded = allLoadedInstances?.length === 1;

        if ( !action.payload.IsTemplate && !firstIDLoaded && singleInstanceLoaded){
          getInstanceByID(Object.keys(action.payload.Images)?.[0], true)
          updateUrlParameterWithCurrentUrl("i", Object.keys(action.payload.Images)?.[0]);
        }

        if ( !firstIDLoaded && singleInstanceLoaded) {
            const iFromUrl = getUrlParameter("i");

            if (iFromUrl) {
              const idList = iFromUrl.split(',')
              idList?.forEach( m => getInstance(allLoadedInstances,m));
            }
            // Load q parameter from URL and dispatch action
            const qFromUrl = getUrlParameter("q");
            if (qFromUrl) {
              const queryList = qFromUrl.split(';')
              queryList?.forEach( q => {
                const query = q.split(",");
                getQueries({ short_form : query[0], type : query[1]})
              })
            }
            store.dispatch(setFirstIDLoaded())
            selectInstance(threeDMeshId)
        }
        const id = getUrlParameter("id")?.split(",")?.[0];
        allLoadedInstances?.find( a => a.metadata?.Id === id ) && focusInstance(id)
        break;
    }
    case getQueriesTypes.UPDATE_QUERIES:
    case getQueriesTypes.GET_QUERIES_SUCCESS : {
        store.dispatch(setQueryComponentOpened(true));
        break;
    }
    default:
        break;
    }
};
