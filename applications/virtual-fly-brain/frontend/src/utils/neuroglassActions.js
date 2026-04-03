/**
 * Neuroglass Widget Actions
 * Controls visibility and state of the Neuroglass viewer widget
 */

import { setWidgetVisible } from '@metacell/geppetto-meta-client/common/layout/actions';
import { WidgetStatus } from '@metacell/geppetto-meta-client/common/layout/model';
import { widgetsIDs } from '../components/layout/widgets';


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

