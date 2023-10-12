import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";

export const threeDCanvasWidget = {
    id: 'threeDCanvasWidget',
    name: "ThreeDCanvas",
    component: "threeDCanvas",
    panelName: "center",
    enableClose: false,
    hideOnClose: false,
    status: WidgetStatus.ACTIVE,
};

export const stackViewerWidget = {
    id: 'stackViewer',
    name: "Stack Viewer",
    component: "stackViewer",
    panelName: "right",
    enableClose: false,
    hideOnClose: false,
    status: WidgetStatus.ACTIVE,
    props: {
      defHeight:600,
      defWidth:300
    }
};

export const sideBarWidget = (sidebarOpen, setSidebarOpen) => {
  return { 
    id: 'sideBar',
    name: "Side Bar Widget",
    component: "sideBar",
    panelName: "left",
    enableClose: false,
    hideOnClose: false,
    status: WidgetStatus.ACTIVE,
    props:{
      open: sidebarOpen,
      setOpen: setSidebarOpen
    }
  }
};

export const roiBrowserWidget = {
  id: 'roiBrowser',
  name: "ROI Browser",
  component: "roiBrowser",
  panelName: "rightPanel",
  enableClose: false,
  hideOnClose: false,
  status: WidgetStatus.ACTIVE,
  props: { size: { height: 600, width: 300 } }
};