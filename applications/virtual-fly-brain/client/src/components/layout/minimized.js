import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";

export const minimized = {
    threeDCanvasWidget : {
        id: 'threeDCanvasWidget',
        name: "3D Canvas",
        component: "threeDCanvas",
        panelName: "border_bottom",
        hideOnClose: true,
        status: WidgetStatus.MINIMIZED,
        pos: 1,
        defaultPosition: 'LEFT',
        props: { size: { height: 600, width: 600 } }
    },

    stackViewerWidget : {
        id: 'stackViewerWidget',
        name: "Slice Viewer",
        component: "stackViewer",
        panelName: "border_bottom",
        hideOnClose: true,
        status: WidgetStatus.MINIMIZED,
        pos: 2,
        defaultPosition: 'RIGHT',
        props: { size: { height: 600, width: 600 } }
    },

    roiBrowserWidget : {
        id: 'roiBrowserWidget',
        name: "Template ROI Browser",
        component: "roiBrowser",
        panelName: "border_bottom",
        hideOnClose: true,
        status: WidgetStatus.MINIMIZED,
        pos: 3,
        defaultPosition: 'RIGHT',
        props: { size: { height: 600, width: 600 } }
    },

    termContextWidget : {
        id: 'termContextWidget',
        name: "Term Context",
        component: "termContext",
        panelName: "border_bottom",
        hideOnClose: true,
        status: WidgetStatus.MINIMIZED,
        pos: 4,
        defaultPosition: 'RIGHT',
        props: { size: { height: 600, width: 300 } }
    },

    circuitBrowserWidget : {
        id: 'circuitBrowserWidget',
        name: "Circuit Browser",
        component: "circuitBrowser",
        panelName: "border_bottom",
        hideOnClose: true,
        status: WidgetStatus.MINIMIZED,
        pos: 5,
        defaultPosition: 'RIGHT',
        props: { size: { height: 600, width: 300 } }
    },

    listViewerWidget : {
        id: 'listViewerWidget',
        name: "Layers",
        component: "listViewer",
        panelName: "border_bottom",
        hideOnClose: true,
        status: WidgetStatus.MINIMIZED,
        pos: 6,
        defaultPosition: 'RIGHT',
        props: { size: { height: 600, width: 300 } }
    }
}

export const imagesWidgets = {
    threeDCanvasWidget : {
        id: 'threeDCanvasWidget',
        name: "3D Canvas",
        component: "threeDCanvas",
        panelName: "border_bottom",
        hideOnClose: true,
        status: WidgetStatus.MINIMIZED,
        defaultPosition: 'RIGHT',
        props: { size: { height: 600, width: 600 } }
    },

    stackViewerWidget : {
        id: 'stackViewerWidget',
        name: "Slice Viewer",
        component: "stackViewer",
        panelName: "border_bottom",
        hideOnClose: true,
        status: WidgetStatus.MINIMIZED,
        defaultPosition: 'RIGHT',
        props: { size: { height: 600, width: 600 } }
    },

    roiBrowserWidget : {
        id: 'roiBrowserWidget',
        name: "Template ROI Browser",
        component: "roiBrowser",
        panelName: "border_bottom",
        hideOnClose: true,
        status: WidgetStatus.MINIMIZED,
        defaultPosition: 'RIGHT',
        props: { size: { height: 600, width: 600 } }
    },

    termContextWidget : {
        id: 'termContextWidget',
        name: "Term Context",
        component: "termContext",
        panelName: "border_bottom",
        hideOnClose: true,
        status: WidgetStatus.MINIMIZED,
        defaultPosition: 'RIGHT',
        props: { size: { height: 600, width: 300 } }
    },

    listViewerWidget : {
    id: 'listViewerWidget',
    name: "Layers",
    component: "listViewer",
    panelName: "border_bottom",
    hideOnClose: true,
    status: WidgetStatus.MINIMIZED,
    defaultPosition: 'RIGHT',
    props: { size: { height: 600, width: 300 } }
    }
}

export const circuitWidgets = {
    circuitBrowserWidget : {
        id: 'circuitBrowserWidget',
        name: "Circuit Browser",
        component: "circuitBrowser",
        panelName: "border_bottom",
        hideOnClose: true,
        status: WidgetStatus.MINIMIZED,
        props: { size: { height: 600, width: 300 } }
    }
}
