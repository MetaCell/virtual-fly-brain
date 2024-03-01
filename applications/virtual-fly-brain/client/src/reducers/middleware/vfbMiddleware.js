import { updateWidget, addWidget } from '@metacell/geppetto-meta-client/common/layout/actions';
import { getLayoutTypes } from './../actions/types/getLayoutTypes';
import { widgets } from "./../../components/layout/widgets";

const getWidget = (store, viewerId) => {
    const state = store.getState();
    const { widgets } = state;
    if (!widgets) {
      return false;
    }
    const widget = widgets[viewerId];
    return !widget ? false : { ...widget };
};

const vfbMiddleware = store => next => (action) => {
    switch (action.type) {
        case getLayoutTypes.SHOW_WIDGET : {
            const widget = getWidget(store, action.componentID);
            if ( widget ) {
                widget.status = action.config.status
                store.dispatch(updateWidget(widget));
            } else {
                store.dispatch(addWidget(widgets[action.componentID]));
            }
            break;
        }
        default:
            next(action);
    }
  };
  
  export default vfbMiddleware;