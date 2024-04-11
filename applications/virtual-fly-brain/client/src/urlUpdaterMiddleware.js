import { getInstancesTypes } from './reducers/actions/types/getInstancesTypes';
import { getQueriesTypes } from './reducers/actions/types/getQueriesTypes';
import { getInstanceByID, get3DMesh } from './reducers/actions/instances';
import { getQueries, getQueriesFailure } from './reducers/actions/queries';
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
          let type = query[1];
          if ( type === undefined ) {
            store.dispatch(getQueriesFailure("Missing query type for ID : " + query[0], query[0]))
          } else {
            getQueries( query[0], type)
            store.dispatch(setQueryComponentOpened(true));
          }
        })
      } 
    }
    store.dispatch(setFirstIDLoaded())
  }
}

const getUrlParameter = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

const getInstance = (allLoadedInstances, id, focus) => {
  if ( !allLoadedInstances?.find( i => i.metadata?.Id === id ) ){
    getInstanceByID(id, true, focus, focus);
  }
}

export const urlUpdaterMiddleware = store => next => (action) => {
  const launchTemplate = store.getState().instances.launchTemplate;
  const misalignedIDs = store.getState().globalInfo.misalignedIDs;

  const allLoadedInstances = store.getState().instances.allLoadedInstances;
  isFirstTimeLoad(allLoadedInstances)
  const firstIDLoaded = store.getState().globalInfo.firstIDLoaded;
  switch (action.type) {
    case getInstancesTypes.GET_INSTANCES_SUCCESS : {

        const templateLookup = action.payload?.Images || action.payload?.Examples || {} ;
        const template = Object.keys(templateLookup)?.[0];
        const loadedTemplate = launchTemplate?.metadata?.Id;

        if ( !action.payload?.IsClass ) {
          if ( !action.payload.IsTemplate && !firstIDLoaded ){
            next(action); 
            if ( action.payload.get3DMesh && !action.payload?.IsClass ){
              get3DMesh(action.payload);
            }
            getInstanceByID(template, true, false, false)
            store.dispatch(setTemplateID(template))
            updateUrlParameterWithCurrentUrl("i", template);
          } else if ( (action.payload.IsTemplate && launchTemplate) == null || 
            (!action.payload.IsTemplate && template == loadedTemplate) ){
            if ( action.payload.get3DMesh && !action.payload?.IsClass ){
              next(action)
              get3DMesh(action.payload);
            }
          } else if ( !action.payload.IsTemplate && template != loadedTemplate && misalignedIDs[action.payload.Id] == undefined ) {
            store.dispatch(setAlignTemplates(false, action.payload.Id))
            break;
          } else if ( action.payload.IsTemplate && loadedTemplate !== action.payload.Id && misalignedIDs[action.payload.Id] == undefined ) {
            store.dispatch(setAlignTemplates(false, action.payload.Id))
            break;
          } else if ( misalignedIDs[action.payload.Id] ) {
            next(action)
          }
          loaded(store, firstIDLoaded, allLoadedInstances)
        } else if ( action.payload?.IsClass ) {
          next(action)
          loaded(store, firstIDLoaded, allLoadedInstances)
        }

        break;
    }
    case getQueriesTypes.UPDATE_QUERIES:
    case getQueriesTypes.GET_QUERIES_SUCCESS : {
      next(action);
      const globalRecentSearches = store.getState().globalInfo.recentSearches; 
      if ( action.payload.query?.queries?.length < 1 && action.payload.query?.rows === undefined){
        store.dispatch(getQueriesFailure("No queries found for : " + action.payload.short_form, action.payload.short_form))
      } else {
        if ( !globalRecentSearches?.find( recent => recent.short_form === action.payload.short_form && recent.is_query) && (action.payload.query?.rows) ){
          store.dispatch(addRecentSearch(action.payload , true));
        }  
        if ( !firstIDLoaded ){
            store.dispatch(setFirstIDLoaded())
            store.dispatch(setQueryComponentOpened(true));
        }
      }
      break;
    }
    default:
      next(action);  
      break;
    }
};
