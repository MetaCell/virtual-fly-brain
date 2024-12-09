import { updateWidget, addWidget } from '@metacell/geppetto-meta-client/common/layout/actions';
import * as GeppettoActions from '@metacell/geppetto-meta-client/common/actions';
import { getLayoutManagerInstance } from "@metacell/geppetto-meta-client/common/layout/LayoutManager";
import { WidgetStatus } from '@metacell/geppetto-meta-client/common/layout/model';
import { getLayoutTypes } from './../actions/types/getLayoutTypes';
import { getInstancesTypes } from '../actions/types/getInstancesTypes';
import { get3DMesh } from '../actions/instances';
import { widgets } from "./../../components/layout/widgets";
import { getGlobalTypes } from '../actions/types/GlobalTypes';
import { add3DPlane, modify3DPlane } from '../../utils/instancesHelper';
import { widgetsIDs } from './../../components/layout/widgets';

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
        case getLayoutTypes.LOAD_CUSTOM_LAYOUT : {
            const importLayout = (input) => ({
                type: GeppettoActions.IMPORT_APPLICATION_STATE,
                data: input
            });
            const currentState = store.getState();
            const newState = {
                version: action.data.version,
                redux: {
                    ...currentState,
                    client: { ...action.data.redux.client },
                    instances: {
                        ...currentState.instances,
                        allLoadedInstances: currentState.instances.allLoadedInstances.map( i => i),
                    },
                    layout: { ...action.data.redux.layout },
                    widgets: { ...action.data.redux.widgets }
                }
            };
            next(importLayout(newState));
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
        case getLayoutTypes.ACTIVATE_IMAGES :
        case getLayoutTypes.ACTIVATE_CIRCUITS : {
            const hiddenPanel = 'border_bottom';
            const keys = [];
            if (action.type === getLayoutTypes.ACTIVATE_CIRCUITS) {
                keys.push(widgetsIDs.circuitBrowserWidgetID);
            } else if (action.type === getLayoutTypes.ACTIVATE_IMAGES) {
                keys.push(widgetsIDs.threeDCanvasWidgetID);
                keys.push(widgetsIDs.stackViewerWidgetID);
                keys.push(widgetsIDs.termContextWidgetID);
                keys.push(widgetsIDs.roiBrowserWidgetID);
                keys.push(widgetsIDs.listViewerWidgetID);
            }
            const layoutManager = getLayoutManagerInstance();
            const activePanel = layoutManager.model.getRoot().getModel().getActiveTabset().getId();

            Object.keys(widgets).forEach( key => {
                if ( !keys.includes(key) ){
                    next(updateWidget({ ...widgets[key], panelName: hiddenPanel, defaultPanel: hiddenPanel, status: WidgetStatus.MINIMIZED }));
                } else {
                    next(updateWidget({ ...widgets[key], panelName: activePanel, defaultPanel: activePanel, status: WidgetStatus.ACTIVE }));
                }
            });
            break;
        }
        default:
            next(action);
    }
};

export default vfbMiddleware;
