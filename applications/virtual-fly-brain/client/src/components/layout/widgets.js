import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";

export const widgets = {
    threeDCanvasWidget : {
        id: 'threeDCanvasWidget',
        name: "3D Canvas",
        component: "threeDCanvas",
        panelName: "center",
        hideOnClose: false,
        status: WidgetStatus.ACTIVE,
    },

    stackViewerWidget : {
        id: 'stackViewerWidget',
        name: "Stack Viewer",
        component: "stackViewer",
        panelName: "left",
        hideOnClose: false,
        status: WidgetStatus.ACTIVE,
        props: { size: { height: 600, width: 600 } }
    },

    roiBrowserWidget : {
        id: 'roiBrowserWidget',
        name: "Template ROI Browser",
        component: "roiBrowser",
        panelName: "left",
        hideOnClose: false,
        status: WidgetStatus.ACTIVE,
        props: { size: { height: 600, width: 600 } }
    },

    termContextWidget : {
        id: 'termContextWidget',
        name: "Term Context",
        component: "termContext",
        panelName: "left",
        enableClose: false,
        hideOnClose: false,
        status: WidgetStatus.ACTIVE,
        props: { size: { height: 600, width: 300 } }
    },

    circuitBrowserWidget : {
        id: 'circuitBrowserWidget',
        name: "Circuit Browser",
        component: "circuitBrowser",
        panelName: "left",
        enableClose: false,
        hideOnClose: false,
        status: WidgetStatus.ACTIVE,
        props: { size: { height: 600, width: 300 } }
    },

    listViewerWidget : {
    id: 'listViewerWidget',
    name: "List Viewer",
    component: "listViewer",
    panelName: "left",
    enableClose: false,
    hideOnClose: false,
    status: WidgetStatus.ACTIVE,
    props: { size: { height: 600, width: 300 } }
    }
}
