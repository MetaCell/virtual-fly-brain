import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";

export const widgets = {
    threeDCanvasWidget : {
        id: 'threeDCanvasWidget',
        name: "3D Canvas",
        component: "threeDCanvas",
        panelName: "left",
        hideOnClose: true,
        status: WidgetStatus.ACTIVE,
    },

    stackViewerWidget : {
        id: 'stackViewerWidget',
        name: "Slice Viewer",
        component: "stackViewer",
        panelName: "right",
        hideOnClose: true,
        status: WidgetStatus.ACTIVE,
        props: { size: { height: 600, width: 600 } }
    },

    roiBrowserWidget : {
        id: 'roiBrowserWidget',
        name: "Template ROI Browser",
        component: "roiBrowser",
        panelName: "right",
        hideOnClose: true,
        status: WidgetStatus.ACTIVE,
        props: { size: { height: 600, width: 600 } }
    },

    termContextWidget : {
        id: 'termContextWidget',
        name: "Term Context",
        component: "termContext",
        panelName: "right",
        hideOnClose: true,
        status: WidgetStatus.ACTIVE,
        props: { size: { height: 600, width: 300 } }
    },

    circuitBrowserWidget : {
        id: 'circuitBrowserWidget',
        name: "Circuit Browser",
        component: "circuitBrowser",
        panelName: "right",
        hideOnClose: true,
        status: WidgetStatus.ACTIVE,
        props: { size: { height: 600, width: 300 } }
    },

    listViewerWidget : {
    id: 'listViewerWidget',
    name: "Layers",
    component: "listViewer",
    panelName: "right",
    hideOnClose: true,
    status: WidgetStatus.ACTIVE,
    props: { size: { height: 600, width: 300 } }
    }
}
