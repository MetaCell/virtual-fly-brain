import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";

export const threeDCanvasWidget = {
    id: 'threeDCanvasWidget',
    name: "3D Canvas",
    component: "threeDCanvas",
    panelName: "center",
    hideOnClose: false,
    status: WidgetStatus.ACTIVE,
};

export const stackViewerWidget = {
    id: 'stackViewer',
    name: "Stack Viewer",
    component: "stackViewer",
    panelName: "right",
    hideOnClose: false,
    status: WidgetStatus.ACTIVE,
};

export const roiBrowserWidget = {
    id: 'roiBrowser',
    name: "ROI Browser",
    component: "roiBrowser",
    panelName: "left",
    hideOnClose: false,
    status: WidgetStatus.ACTIVE,
    props: { size: { height: 600, width: 300 } }
};
