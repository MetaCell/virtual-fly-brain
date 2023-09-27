import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";

export const threeDCanvasWidget = {
    id: 'threeDCanvasWidget',
    name: "ThreeDCanvas",
    component: "threeDCanvas",
    panelName: "centerPanel",
    enableClose: false,
    hideOnClose: false,
    status: WidgetStatus.ACTIVE,
};

export const stackViewerWidget = {
    id: 'stackViewer',
    name: "Stack Viewer",
    component: "Stack",
    panelName: "rightPanel",
    enableClose: false,
    hideOnClose: false,
    status: WidgetStatus.ACTIVE,
};