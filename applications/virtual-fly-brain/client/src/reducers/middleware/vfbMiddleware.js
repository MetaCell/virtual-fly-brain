import { updateWidget, addWidget } from '@metacell/geppetto-meta-client/common/layout/actions';
import * as GeppettoActions from '@metacell/geppetto-meta-client/common/actions';
import { getLayoutManagerInstance } from "@metacell/geppetto-meta-client/common/layout/LayoutManager";
import { WidgetStatus } from '@metacell/geppetto-meta-client/common/layout/model';
import { getLayoutTypes } from './../actions/types/getLayoutTypes';
import { getInstancesTypes } from '../actions/types/getInstancesTypes';
import { get3DMesh } from '../actions/instances';
import { widgets } from "./../../components/layout/widgets";
import { minimized } from '../../components/layout/minimized';
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
        case GeppettoActions.layoutActions.UPDATE_WIDGET : {
            const layoutManager = getLayoutManagerInstance();
            const widget = { ...getWidget(store, action.data.id)};
            if (widget.status === WidgetStatus.MINIMIZED) {
                widget.defaultPanel = layoutManager.model.getRoot().getModel().getActiveTabset().getId();
                widget.panelName = layoutManager.model.getRoot().getModel().getActiveTabset().getId();
                widget.status = WidgetStatus.ACTIVE;
                next({type: action.type, data: widget});
            } else {
                next(action);
            }
            break;
        }
        case getLayoutTypes.LOAD_CUSTOM_LAYOUT : {
            const importLayout = (input) => ({
                type: GeppettoActions.IMPORT_APPLICATION_STATE,
                data: input
            });
            next(importLayout(action.data));
            break;
        }
        case getLayoutTypes.AUTOSAVE_LAYOUT :
        case GeppettoActions.layoutActions.SET_LAYOUT :
        case GeppettoActions.layoutActions.UPDATE_LAYOUT : {
            if (store.getState().globalInfo.autoSaveLayout) {
                localStorage.setItem('vfb_layout', JSON.stringify(store.getState()));
            }
            next(action);
            break;
        }
        default:
            next(action);
    }
};

export default vfbMiddleware;
