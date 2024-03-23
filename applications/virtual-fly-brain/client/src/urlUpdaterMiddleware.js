import { getInstancesTypes } from './reducers/actions/types/getInstancesTypes';
import { getQueriesTypes } from './reducers/actions/types/getQueriesTypes';
import { getInstanceByID, selectInstance, focusInstance } from './reducers/actions/instances';
import { getQueries } from './reducers/actions/queries';
import { addRecentSearch } from './reducers/actions/globals'
import { setQueryComponentOpened, setFirstIDLoaded, setAlignTemplates, setTemplateID } from './reducers/actions/globals';

function updateUrlParameterWithCurrentUrl(param, value) {
  const urlObj = new URL(window.location.href);
  if (urlObj.searchParams.has(param)) {
    const existingValue = urlObj.searchParams.get(param);
    const existingValuesArray = existingValue.split(',');
    const newValuesArray = value?.split(',');
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
    
    getInstance(allLoadedInstances,idToUpdate, true);
  }
};

const loaded = (store, firstIDLoaded, allLoadedInstances) => {
  if ( !firstIDLoaded ) {
    const iFromUrl = getUrlParameter("i");

    if (iFromUrl) {
      const idList = iFromUrl.split(',')
      idList?.forEach( m => getInstance(allLoadedInstances,m, false));
    }
    // Load q parameter from URL and dispatch action
    const qFromUrl = getUrlParameter("q");
    if (qFromUrl) {
      const queryList = qFromUrl.split(';')
      if ( queryList?.length > 0 ) {
        queryList?.forEach( q => {
          const query = q.split(",");
          getQueries({ short_form : query[0], type : query[1]})
        })
      } else {
        store.dispatch(setFirstIDLoaded())
      }
    } else {
      store.dispatch(setFirstIDLoaded())
    }

    const id = getUrlParameter("id")?.split(",")?.[0];
    selectInstance(id);
  }
}

const getUrlParameter = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

const getInstance = (allLoadedInstances, id, focus) => {
  if ( !allLoadedInstances?.find( i => i.metadata?.Id === id ) ){
    getInstanceByID(id, true, focus);
  }
}

export const urlUpdaterMiddleware = store => next => (action) => {
  next(action);

  const allLoadedInstances = store.getState().instances.allLoadedInstances;
  isFirstTimeLoad(allLoadedInstances)

  const firstIDLoaded = store.getState().globalInfo.firstIDLoaded;
  switch (action.type) {
    case getInstancesTypes.GET_3D_OBJ_TYPE_SUCCESS : {
      const idFromUrl = getUrlParameter("id")?.split(',')?.[0];
      if ( action.payload.id === idFromUrl ){
        focusInstance(idFromUrl);
        selectInstance(idFromUrl)
      }
      break;
    }
    case getInstancesTypes.GET_INSTANCES_SUCCESS : {
        const launchTemplate = store.getState().instances.launchTemplate;
        const templateLookup = action.payload?.Images || {} ;

        if ( !action.payload?.IsClass ) {
          if ( !action.payload.IsTemplate && !firstIDLoaded ){
            let template = Object.keys(templateLookup)?.[0];
            getInstanceByID(template, true, false)
            store.dispatch(setTemplateID(template))
            updateUrlParameterWithCurrentUrl("i", template);
            selectInstance(action.payload.Id)
            focusInstance(idFromUrl);
          } else if ( !action.payload.IsTemplate && Object.keys(templateLookup)?.[0] != launchTemplate?.metadata?.Id ) {
            store.dispatch(setAlignTemplates(false, action.payload.Id))
            break;
          } else if ( action.payload.IsTemplate && launchTemplate?.metadata?.Id !== action.payload.Id ) {
            store.dispatch(setAlignTemplates(false, action.payload.Id))
            break;
          }
        }

        loaded(store, firstIDLoaded, allLoadedInstances)
        break;
    }
    case getQueriesTypes.UPDATE_QUERIES:
    case getQueriesTypes.GET_QUERIES_SUCCESS : {
      const globalRecentSearches = store.getState().globalInfo.recentSearches;

      if ( !globalRecentSearches?.find( recent => recent.id === action.payload.Id ) &&  action.payload.Id != undefined){
        store.dispatch(addRecentSearch(action.payload, true));
      }  
      if ( !firstIDLoaded ){
          store.dispatch(setFirstIDLoaded())
          store.dispatch(setQueryComponentOpened(true));
        }
        break;
    }
    default:
        break;
    }
};
