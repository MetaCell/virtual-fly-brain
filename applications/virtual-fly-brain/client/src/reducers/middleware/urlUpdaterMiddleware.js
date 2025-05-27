import { getInstancesTypes } from '../actions/types/getInstancesTypes';
import { getQueriesTypes } from '../actions/types/getQueriesTypes';
import { getInstanceByID, get3DMesh, getInstancesFailure } from '../actions/instances';
import { getQueries, getQueriesFailure } from '../actions/queries';
import { addRecentSearch } from '../actions/globals'
import { setQueryComponentOpened, setFirstIDLoaded, setAlignTemplates, setTemplateID } from '../actions/globals';

function updateUrlParameterWithCurrentUrl(param, value, reset) {
  const urlObj = new URL(window.location.href);
  if (reset) {
    // If reset is true, remove the parameter from the URL
    urlObj.searchParams.delete(param);
    urlObj.searchParams.set(param, decodeURIComponent(value));
  } else if (urlObj.searchParams.has(param)) {
    const existingValue = urlObj.searchParams.get(param);
    const existingValuesArray = existingValue.split(',');
    const newValuesArray = value?.split(',');
    // Filter out any empty values and ensure unique values
    const mergedValuesArray = [...new Set([...existingValuesArray, ...newValuesArray].filter(Boolean))];
    const updatedValue = mergedValuesArray.join(',');
    // Use decodeURIComponent to ensure commas are displayed correctly
    urlObj.searchParams.set(param, decodeURIComponent(updatedValue));
  } else {
    urlObj.searchParams.set(param, decodeURIComponent(value));
  }
  // Use decodeURIComponent when setting the URL to ensure proper display
  window.history.replaceState(null, '', decodeURIComponent(urlObj.toString()));
}

// make a function that updates the URL for id and i params. Id is for the selected instance, i is for the loaded instances
// If the id is not present in the URL, it will be added, otherwise it will be updated
// If the i parameter is not present, it will be added, otherwise it will be updated
// If the i parameter is present, it will be updated with the new value, otherwise it will be added
function updateUrlWithInstancesAndSelectedId(selectedId) {
  const urlObj = new URL(window.location.href);
  
  if (urlObj.searchParams.has('id')) {
    const currentId = urlObj.searchParams.get('id');
    updateUrlParameterWithCurrentUrl('i', currentId, false);
    updateUrlParameterWithCurrentUrl('id', selectedId, true);
  } else {
    updateUrlParameterWithCurrentUrl('id', selectedId, true);
  }
}

const DEFAULT_ID = "VFB_00101567";
const APP_LOADED_FLAG_KEY = "CURRENT_LOADED_URL";

const loaded = (store, firstIDLoaded, allLoadedInstances) => {
  if ( !firstIDLoaded ) {
    const iFromUrl = getUrlParameter("i");

    if (iFromUrl) {
      const idList = iFromUrl.split(',')
      idList?.forEach( m => getInstance(allLoadedInstances, m, false));
    }

    const idFromUrl = getUrlParameter("id");
    if (idFromUrl) {
      // If an ID is specified in the URL, load it
      getInstance(allLoadedInstances, idFromUrl, true);
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

const isFirstTimeLoad = (allLoadedInstances) => {
  const appLoadedUrl = localStorage.getItem(APP_LOADED_FLAG_KEY);
  const currentUrl = window.location.href;
  if (currentUrl != appLoadedUrl) {
    localStorage.setItem(APP_LOADED_FLAG_KEY, currentUrl);
    // Load id parameter from URL and dispatch action
    const idsFromUrl = getUrlParameter("i");
    let idToUpdate = [DEFAULT_ID];

    if (idsFromUrl) {
      idToUpdate = idsFromUrl?.split(',');
    }

    idToUpdate?.forEach( id => {
      if (id) {
        getInstance(allLoadedInstances, id, false);
      }
    });

    const idSelected = getUrlParameter("id");
    if (idSelected) {
      getInstance(allLoadedInstances, idSelected, true);
    } else {
      // If no ID is specified, load the default ID
      getInstance(allLoadedInstances, idToUpdate[0], true);
    }
  }
};

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
  const firstIDLoaded = store.getState().globalInfo.firstIDLoaded;
  
  // Only call isFirstTimeLoad if we haven't loaded the first ID yet
  if (!firstIDLoaded) {
    isFirstTimeLoad(allLoadedInstances);
  }

  switch (action.type) {
    case getInstancesTypes.GET_INSTANCES_SUCCESS : {
      const IsTemplate = action.payload?.IsTemplate || false;
      const isClass = action.payload?.IsClass || false;
      const isIndividual = action.payload?.IsIndividual || false;

      if (!IsTemplate && !isClass && !isIndividual) {
        // If the instance is not a template, class, or individual, dispatch the getInstanceFailure with an error message
        if (action.payload?.Id === undefined) {
          store.dispatch(getInstancesFailure("Instance ID is undefined"));
          return;
        } else {
          // If the instance is not a template, class, or individual, dispatch the getInstanceFailure specifing the ID
          store.dispatch(getInstancesFailure("Instance not recognized: " + action.payload.Id));
          return;
        }
      }

      // if is a template and launchTemplate is not defined, we need to set the template ID
      if (IsTemplate && launchTemplate == null) {
        get3DMesh(action.payload);
        store.dispatch(setTemplateID(action.payload.Id));
        updateUrlWithInstancesAndSelectedId(action.payload.Id);
        next(action);
        return;
      } else if (IsTemplate && launchTemplate?.metadata?.Id !== action.payload.Id) {
        // If it's a template and the launchTemplate is defined, we need to show the widget to open this template in a new tab
        store.dispatch(setAlignTemplates(false, action.payload.Id));
        return;
      }

      // if it's a class just load it, since classes are not aligned with templates
      if (isClass) {
        next(action);
        updateUrlWithInstancesAndSelectedId(action.payload.Id);
        return;
      }

      // if it's an individual, we need to check if it's aligned with the current template
      if (isIndividual) {
        // Check if the individual is aligned with the current template
        const templateLookup = action.payload?.Images || action.payload?.Examples || {};
        const templates = Object.keys(templateLookup);
        const loadedTemplate = launchTemplate?.metadata?.Id;
        if (loadedTemplate && templates.includes(loadedTemplate)) {
          // If the individual is aligned with the current template, continue with the action
          next(action);
          get3DMesh(action.payload);
          return;
        } else if (loadedTemplate === null || loadedTemplate === undefined) {
          // if the template is not defined, we need to set the template ID
          const template = Object.keys(templateLookup)?.[0];
          getInstanceByID(template, true, true, true);
          store.dispatch(setTemplateID(template));
          updateUrlWithInstancesAndSelectedId(template);
          // Continue with the action and get the 3D mesh
          updateUrlWithInstancesAndSelectedId(action.payload.Id);
          next(action);
          get3DMesh(action.payload);
          return;
        } else if (!templates.includes(loadedTemplate) && !IsTemplate) {
          // If the individual is not aligned with the current template, we need to show the misalignment dialog
          store.dispatch(setAlignTemplates(false, action.payload.Id));
          return;
        }
      }
      break;
    }
    case getInstancesTypes.SELECT_INSTANCE:
    case getInstancesTypes.FOCUS_INSTANCE: {
      const instance = action.payload.id;
      if (instance) {
        // Update the URL with the selected instance ID
        updateUrlWithInstancesAndSelectedId(instance);
      }
      next(action);
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
