import { updateWidget, addWidget } from '@metacell/geppetto-meta-client/common/layout/actions';
import { getLayoutTypes } from './../actions/types/getLayoutTypes';
import { getInstancesTypes } from '../actions/types/getInstancesTypes';
import { get3DMesh } from '../actions/instances';
import { widgets } from "./../../components/layout/widgets";
import { getGlobalTypes } from '../actions/types/GlobalTypes';
import { add3DPlane, modify3DPlane } from '../../utils/instancesHelper';

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
        case getInstancesTypes.SHOW_3D_MESH:
        case getInstancesTypes.SHOW_3D : {
            let matchInstance = store.getState().instances.allLoadedInstances.find( i => i.metadata?.Id === action.payload.id );
            if ( matchInstance && !matchInstance?.meshCreated  ){
                get3DMesh(matchInstance?.metadata);
            }
            next(action)
            break;
        }
        case getGlobalTypes.SHOW_SLICE_DISPLAY : {
            let matchInstance = store.getState().instances.allLoadedInstances.find( i => i.metadata?.Id === action.payload.id );
            let objectFound = null;
            for (let child of store.getState().instances.threeDObjects) {
                if ( action.payload.data?.id === child.material?.name ) {
                    objectFound = true;
                    break;
                }
            }

            if ( !objectFound ){
                let params = { 
                    "data" : action.payload.data?.data,
                    "textureURL" : action.payload.data?.textureUrl,
                    "id" : action.payload.data?.id,
                    "visible" : true
                }
                const plane = add3DPlane(params);
                action.payload.data.plane = plane;
            }
            next(action)
            break;
        }
        case getGlobalTypes.MODIFY_SLICE_DISPLAY : {
            let matchInstance = store.getState().instances.allLoadedInstances.find( i => i.metadata?.Id === action.payload.id );
            let objectFound = null;
            for (let child of store.getState().instances.threeDObjects) {
                if ( action.payload.data?.id === child.material?.name ) {
                    objectFound = child;
                    break;
                }
            }

            if ( objectFound ){
                let params = { 
                    "data" : action.payload.data?.data,
                    "textureURL" : action.payload.data?.textureUrl,
                    "id" : action.payload.data?.id,
                    "visible" : action.payload.data?.visible
                }
                modify3DPlane(objectFound, params);
            }
            next(action)
            break;
        }
        default:
            next(action);
    }
  };
  
  export default vfbMiddleware;