/**
 * Neuroglass Widget Actions
 * Controls visibility and state of the Neuroglass viewer widget
 */

import { setWidgetVisible, WidgetStatus } from '@metacell/geppetto-meta-client/common/layout/actions';
import { widgetsIDs } from '../layout/widgets';
import { hasNeuroglassState, getNeuroglassState, NEUROGLASS_STATES_MAP } from './neuroglassStateConfig';


/**
 * Show the Neuroglass viewer widget
 * @param {Object} store - Redux store instance
 */
export const showNeuroglassViewer = (store) => {
  store.dispatch(setWidgetVisible(widgetsIDs.neuroglassViewerWidgetID, true));
};

/**
 * Hide the Neuroglass viewer widget
 * @param {Object} store - Redux store instance
 */
export const hideNeuroglassViewer = (store) => {
  store.dispatch(setWidgetVisible(widgetsIDs.neuroglassViewerWidgetID, false));
};

/**
 * Toggle Neuroglass viewer widget visibility
 * @param {Object} store - Redux store instance
 */
export const toggleNeuroglassViewer = (store) => {
  const state = store.getState();
  const widgets = state.widgets || {};
  const neuroglassWidget = widgets[widgetsIDs.neuroglassViewerWidgetID];
  
  const isVisible = neuroglassWidget?.status === WidgetStatus.ACTIVE;
  store.dispatch(setWidgetVisible(widgetsIDs.neuroglassViewerWidgetID, !isVisible));
};

/**
 * Check if an instance has Neuroglass data available
 * @param {string} instanceId - VFB instance ID
 * @returns {boolean} True if Neuroglass data exists
 */
export const hasNeuroglassData = (instanceId) => {
  return hasNeuroglassState(instanceId);
};

/**
 * Get the Neuroglass viewer state for a specific instance
 * @param {string} instanceId - VFB instance ID
 * @returns {Object|null} Neuroglass state or null if not available
 */
export const getNeuroglassStateForInstance = (instanceId) => {
  return getNeuroglassState(instanceId);
};

/**
 * Auto-show Neuroglass widget when a compatible instance is loaded
 * @param {Object} store - Redux store instance
 */
export const autoShowNeuroglass = (store) => {
  const state = store.getState();
  const loadedInstances = state.instances.allLoadedInstances || [];
  
  const hasCompatibleInstance = loadedInstances.some(
    instance => hasNeuroglassData(instance.metadata?.Id)
  );
  
  if (hasCompatibleInstance) {
    showNeuroglassViewer(store);
  }
};
