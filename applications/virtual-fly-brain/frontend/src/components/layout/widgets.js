import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";

export const widgetsIDs = {
    threeDCanvasWidgetID : 'threeDCanvasWidget',
    stackViewerWidgetID : 'stackViewerWidget',
    roiBrowserWidgetID : 'roiBrowserWidget',
    termContextWidgetID : 'termContextWidget',
    circuitBrowserWidgetID : 'circuitBrowserWidget',
    listViewerWidgetID : 'listViewerWidget',
    neuroglassWidgetID : 'neuroglassWidget'
};

export const widgets = {
    threeDCanvasWidget : {
        id: widgetsIDs.threeDCanvasWidgetID,
        name: "3D Canvas",
        component: "threeDCanvas",
        panelName: "left",
        hideOnClose: true,
        status: WidgetStatus.ACTIVE,
        defaultPosition: 'LEFT',
        pos: 0,
        props: { size: { height: 600, width: 900 } }
    },

    stackViewerWidget : {
        id: widgetsIDs.stackViewerWidgetID,
        name: "Slice Viewer",
        component: "stackViewer",
        panelName: "right",
        hideOnClose: true,
        status: WidgetStatus.ACTIVE,
        defaultPosition: 'RIGHT',
        pos: 1,
        props: { size: { height: 600, width: 600 } }
    },

    listViewerWidget : {
        id: widgetsIDs.listViewerWidgetID,
        name: "Layers",
        component: "listViewer",
        panelName: "bottom",
        hideOnClose: true,
        status: WidgetStatus.ACTIVE,
        defaultPosition: 'RIGHT',
        pos: 1,
        props: { size: { height: 600, width: 300 } }
    },

    roiBrowserWidget : {
        id: widgetsIDs.roiBrowserWidgetID,
        name: "Template ROI Browser",
        component: "roiBrowser",
        panelName: "bottom",
        hideOnClose: true,
        status: WidgetStatus.HIDDEN,
        defaultPosition: 'RIGHT',
        pos: 2,
        props: { size: { height: 600, width: 600 } }
    },

    termContextWidget : {
        id: widgetsIDs.termContextWidgetID,
        name: "Term Context",
        component: "termContext",
        panelName: "bottom",
        hideOnClose: true,
        status: WidgetStatus.HIDDEN,
        defaultPosition: 'RIGHT',
        pos: 3,
        props: { size: { height: 600, width: 300 } }
    },

    circuitBrowserWidget : {
        id: widgetsIDs.circuitBrowserWidgetID,
        name: "Circuit Browser",
        component: "circuitBrowser",
        panelName: "bottom",
        hideOnClose: true,
        status: WidgetStatus.HIDDEN,
        defaultPosition: 'RIGHT',
        pos: 4,
        props: { size: { height: 600, width: 300 } }
    },
    neuroglassWidget : {
        id: widgetsIDs.neuroglassWidgetID,
        name: "NeuroGlass",
        component: "neuroglass",
        panelName: "bottom",
        hideOnClose: true,
        status: WidgetStatus.HIDDEN,
        defaultPosition: 'RIGHT',
        pos: 5,
        props: { size: { height: 600, width: 300 } }
    }
}
