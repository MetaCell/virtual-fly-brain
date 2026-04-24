import { addRecentSearch } from '../actions/globals';
import { getQueriesFailure } from '../actions/queries';
import { getQueriesTypes } from '../actions/types/getQueriesTypes';
import { getInstancesTypes } from '../actions/types/getInstancesTypes';
import { getGlobalTypes } from '../actions/types/GlobalTypes';
import { setFirstIDLoaded, setAlignTemplates, setTemplateID, setNeuroglassView } from '../actions/globals';
import { getInstanceByID, get3DMesh, triggerInstanceFailure, setBulkLoadingCount, clearUrlLoadingState, focusInstance, selectInstance } from '../actions/instances';
import * as GeppettoActions from '@metacell/geppetto-meta-client/common/actions';
import { DEFAULT_TEMPLATE_ID, NG_LAYOUT_URL_PARAM, KNOWN_NG_VIEWS } from '../../utils/constants';

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
function updateUrlWithInstancesAndSelectedId(selectedId, store) {
  const { isLoadingFromUrl, launchTemplate } = store.getState().instances;
  
  
  // During URL load, don't update the URL at all - let the initial URL parameters stay unchanged
  if (isLoadingFromUrl) {
    return;
  }
  
  // Block template from overwriting the focused instance during initial load
  const isTemplate = launchTemplate?.metadata?.Id === selectedId;
  if (initialUrlFocusId && initialUrlFocusId !== selectedId && isTemplate) {
    return;
  }

  const urlObj = new URL(window.location.href);
  if (urlObj.searchParams.has('id')) {
    const currentId = urlObj.searchParams.get('id');
    updateUrlParameterWithCurrentUrl('i', currentId, false);
    updateUrlParameterWithCurrentUrl('id', selectedId, true);
  } else {
    updateUrlParameterWithCurrentUrl('id', selectedId, true);
  }
}

const DEFAULT_ID = DEFAULT_TEMPLATE_ID;
const APP_LOADED_FLAG_KEY = "CURRENT_LOADED_URL";

// Track the initial focus ID from URL to prevent templates from overwriting it
let initialUrlFocusId = null;

const isFirstTimeLoad = (allLoadedInstances, store) => {
  const appLoadedUrl = localStorage.getItem(APP_LOADED_FLAG_KEY);
  const currentUrl = window.location.href;
  if (currentUrl != appLoadedUrl) {
    localStorage.setItem(APP_LOADED_FLAG_KEY, currentUrl);
    // Load id parameter from URL and dispatch action
    const idsFromUrl = getUrlParameter("i");
    const idSelected = getUrlParameter("id");

    const queuedInstances = idsFromUrl
      ? idsFromUrl
        .split(',')
        .map(id => id?.trim())
        .filter(Boolean)
      : [];

    let loadOrder = [...queuedInstances];
    if (idSelected) {
      loadOrder = loadOrder.filter(id => id !== idSelected);
      loadOrder.unshift(idSelected);
    }

    // If we have instances to load, set up bulk loading
    if (loadOrder.length === 0) {
      loadOrder.push(DEFAULT_ID);
    }

    const uniqueLoadOrder = [...new Set(loadOrder)];
    const instancesToLoad = uniqueLoadOrder.filter(id => !allLoadedInstances?.find(i => i.metadata?.Id === id));

    if (instancesToLoad.length > 0) {
      store.dispatch(setBulkLoadingCount(instancesToLoad.length, true));
    }

    // id= parameter should always take priority for focus
    const focusTarget = idSelected ||
      (queuedInstances.length > 0
        ? queuedInstances[queuedInstances.length - 1]
        : uniqueLoadOrder[uniqueLoadOrder.length - 1]);

    // Update URL with default template if no parameters were provided
    if (!idsFromUrl && !idSelected) {
      updateUrlParameterWithCurrentUrl('id', DEFAULT_ID, true);
    }

    // Read ?layout param and sync into Redux
    const ngView = getUrlParameter(NG_LAYOUT_URL_PARAM);
    if (ngView && Array.isArray(KNOWN_NG_VIEWS) && KNOWN_NG_VIEWS.includes(ngView)) {
      store.dispatch(setNeuroglassView(ngView));
    } else if (ngView) {
      // Clear unrecognized layout parameter from URL to avoid propagating invalid values
      updateUrlParameterWithCurrentUrl(NG_LAYOUT_URL_PARAM, '', true);
    }

    uniqueLoadOrder.forEach(id => {
      const isFocusTarget = id === focusTarget;
      getInstance(allLoadedInstances, id, isFocusTarget, false);
    });
  }
};

const getUrlParameter = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

const getInstance = (allLoadedInstances, id, focus, select) => {
  const isAlreadyLoaded = allLoadedInstances?.find( i => i.metadata?.Id === id );
  if (!isAlreadyLoaded) {
    getInstanceByID(id, true, focus, select, true);
  }
}

export const urlUpdaterMiddleware = store => next => (action) => {
  const launchTemplate = store.getState().instances.launchTemplate;
  const allLoadedInstances = store.getState().instances.allLoadedInstances;
  const firstIDLoaded = store.getState().globalInfo.firstIDLoaded;
  const isLoadingFromUrl = store.getState().instances.isLoadingFromUrl;

  // Only call isFirstTimeLoad if we haven't loaded the first ID yet
  if (!firstIDLoaded) {
    isFirstTimeLoad(allLoadedInstances, store);
  }

  switch (action.type) {
    case getInstancesTypes.REMOVE_ALL_INSTANCES_SUCCESS: {
      // If all instances are removed, reset the URL parameters
      const urlObj = new URL(window.location.href);
      urlObj.searchParams.delete('i');
      urlObj.searchParams.delete('id');
      window.history.replaceState(null, '', urlObj.toString());
      next(action);
      break;
    }
    case getInstancesTypes.GET_INSTANCES_SUCCESS : {
      // Check if bulk loading just completed
      const state = store.getState().instances;
      const newFinishedCount = state.finishedLoadedInstances + 1;
      const isAllBulkInstancesLoaded = state.isBulkLoading && newFinishedCount >= state.bulkLoadingCount;

      // If bulk loading completed from URL, apply focus/select and clear the flag
      if (isAllBulkInstancesLoaded && isLoadingFromUrl) {
        if (!launchTemplate?.metadata?.Id && !action.payload?.IsTemplate) {
          getInstanceByID(DEFAULT_TEMPLATE_ID, true, false, false);
          updateUrlParameterWithCurrentUrl('i', DEFAULT_TEMPLATE_ID, false);
        }

        const urlParams = new URLSearchParams(window.location.search);
        const pendingFocusId = urlParams.get('id');

        // Store the initial focus ID to prevent templates from overwriting it
        initialUrlFocusId = pendingFocusId;

        // Apply focus and select to the id= parameter from URL
        if (pendingFocusId) {
          // Use async IIFE to wait for focus/select to complete before clearing URL loading state
          (async () => {
            await focusInstance(pendingFocusId);
            await selectInstance(pendingFocusId);
            // Clear URL loading state after async operations complete
            clearUrlLoadingState();
            // Clear the initial focus ID after a longer delay to allow all pending template operations to complete
            setTimeout(() => {
              initialUrlFocusId = null;
            }, 1000);
          })();
        } else {
          clearUrlLoadingState();
        }
      }

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

        if (!(initialUrlFocusId && initialUrlFocusId !== action.payload.Id)) {
          updateUrlWithInstancesAndSelectedId(action.payload.Id, store);
        }
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
        updateUrlWithInstancesAndSelectedId(action.payload.Id, store);
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
          updateUrlWithInstancesAndSelectedId(action.payload.Id, store);
          next(action);
          get3DMesh(action.payload);
          return;
        } else if (loadedTemplate === null || loadedTemplate === undefined) {
          // if the template is not defined, we need to set the template ID
          const template = Object.keys(templateLookup)?.[0];
          // Load template WITHOUT focus/select to avoid overriding user's intended focus
          getInstanceByID(template, true, false, false);
          store.dispatch(setTemplateID(template));
          
          // Don't update URL with template ID if we're loading from URL with a specific id= parameter
          const urlParams = new URLSearchParams(window.location.search);
          const pendingFocusId = urlParams.get('id');
          if (!isLoadingFromUrl || !pendingFocusId) {
            updateUrlWithInstancesAndSelectedId(template, store);
          }
          
          // Continue with the action and get the 3D mesh
          updateUrlWithInstancesAndSelectedId(action.payload.Id, store);
          next(action);
          get3DMesh(action.payload);
          return;
        } else if (!templates.includes(loadedTemplate) && !IsTemplate) {
            if(Object.keys(action.payload?.Images || {}).length === 0 && Object.keys(action.payload?.Examples || {}).length === 0) {
              next(action);
              return;
            }
          // If the individual is not aligned with the current template, we need to show the misalignment dialog
          store.dispatch(setAlignTemplates(false, action.payload.Id, Object.keys(action.payload?.Images)|| Object.keys(action.payload?.Examples || {})));
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
        updateUrlWithInstancesAndSelectedId(instance, store);
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
    case getGlobalTypes.SET_NEUROGLASS_VIEW: {
      const view = action.payload.view;
      const isValidView = typeof view === 'string' && view.trim().length > 0;
      if (isValidView) {
        updateUrlParameterWithCurrentUrl(NG_LAYOUT_URL_PARAM, view, true);
      } else {
        const urlObj = new URL(window.location.href);
        urlObj.searchParams.delete(NG_LAYOUT_URL_PARAM);
        window.history.replaceState(null, '', decodeURIComponent(urlObj.toString()));
      }
      next(action);
      break;
    }
    default:
      next(action);
      break;
    }
};
