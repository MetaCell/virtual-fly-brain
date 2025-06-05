import { getInstancesTypes } from '../actions/types/getInstancesTypes';
import { getQueriesTypes } from '../actions/types/getQueriesTypes';
import { getInstanceByID, get3DMesh, triggerInstanceFailure } from '../actions/instances';
import { getQueries, getQueriesFailure } from '../actions/queries';
import { addRecentSearch } from '../actions/globals';
import { setQueryComponentOpened, setFirstIDLoaded, setAlignTemplates, setTemplateID } from '../actions/globals';
import * as GeppettoActions from '@metacell/geppetto-meta-client/common/actions';

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

// This function updates the URL with the instances and the selected ID
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

const isFirstTimeLoad = (allLoadedInstances) => {
  const appLoadedUrl = localStorage.getItem(APP_LOADED_FLAG_KEY);
  const currentUrl = window.location.href;
  if (currentUrl != appLoadedUrl) {
    localStorage.setItem(APP_LOADED_FLAG_KEY, currentUrl);
    // Load id parameter from URL and dispatch action
    let idToUpdate = [];
    const idsFromUrl = getUrlParameter("i");
    // let idToUpdate = [DEFAULT_ID];

    if (idsFromUrl) {
      idToUpdate = [...new Set(idsFromUrl?.split(','))];
    }

    const idSelected = getUrlParameter("id");

    if (idSelected) {
      // If an ID is specified in the URL, check if present and if yes move it as last in the list, otherwise add it at the end
      idToUpdate = idToUpdate.filter(id => id !== idSelected);
      // If the selected ID is not already in the list, add it
      if (!idToUpdate.includes(idSelected)) {
        idToUpdate.push(idSelected);
      }
    } else if (idToUpdate.length === 0) {
      // If no ID is specified in the URL, add the default ID
      idToUpdate.push(DEFAULT_ID);
    }

    idToUpdate?.forEach( id => {
      // if it's the last ID in the list, we need to focus it
      if (id === idToUpdate[idToUpdate.length - 1]) {
        getInstance(allLoadedInstances, id, true);
      }
      else {
        getInstance(allLoadedInstances, id, false);
      }
    });
  }
};

const getUrlParameter = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

const getInstance = (allLoadedInstances, id, focus) => {
  if ( !allLoadedInstances?.find( i => i.metadata?.Id === id ) ){
    getInstanceByID(id, true, focus, focus, true);
  }
}

export const urlUpdaterMiddleware = store => next => (action) => {
  const launchTemplate = store.getState().instances.launchTemplate;
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
          triggerInstanceFailure("Instance ID is undefined");
          return;
        } else {
          // If the instance is not a template, class, or individual, dispatch the getInstanceFailure specifing the ID
          triggerInstanceFailure("Instance not recognized: " + action.payload.Id);
          return;
        }
      }

      // if is a template and launchTemplate is not defined, we need to set the template ID
      if (IsTemplate && launchTemplate == null) {
        if (!firstIDLoaded) {
          store.dispatch(setFirstIDLoaded());
        }
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

      if (!firstIDLoaded) {
        store.dispatch(setFirstIDLoaded());
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
      const globalRecentSearches = store.getState().globalInfo.recentSearches;
      if ( action.payload.query?.queries?.length < 1 && action.payload.query?.rows === undefined){
        store.dispatch(getQueriesFailure("No queries found for : " + action.payload.short_form, action.payload.short_form))
      } else {
        if ( !globalRecentSearches?.find( recent => recent.short_form === action.payload.short_form && recent.is_query) && (action.payload.query?.rows) ){
          store.dispatch(addRecentSearch(action.payload , true));
        }
      }
      next(action);
      break;
    }
    default:
      next(action);
      break;
    }
};
