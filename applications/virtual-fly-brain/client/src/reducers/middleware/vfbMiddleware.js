import { updateWidget, addWidget } from '@metacell/geppetto-meta-client/common/layout/actions';
import { getLayoutTypes } from './../actions/types/getLayoutTypes';
import { getInstancesTypes } from '../actions/types/getInstancesTypes';
import { get3DMesh } from '../actions/instances';
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
        case getInstancesTypes.GET_INSTANCES_SUCCESS : {
            next(action)
            if ( action.payload.get3DMesh  ){
                get3DMesh(action.payload);
            }
            break;
        }
        case getInstancesTypes.SHOW_3D_MESH:
        case getInstancesTypes.SHOW_3D : {
            let matchInstance = store.getState().instances.allLoadedInstances.find( i => i.metadata?.Id === action.payload.id );
            if ( matchInstance && !matchInstance?.meshCreated  ){
                get3DMesh(matchInstance?.metadata);
            }
            next(action)
            break;
        }
        default:
            next(action);
    }
  };
  
  export default vfbMiddleware;