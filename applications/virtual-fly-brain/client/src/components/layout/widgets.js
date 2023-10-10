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
    props: {
      defHeight:600,
      defWidth:300
    }
};

export const sideBarWidget = (sidebarOpen, setSidebarOpen) => {
  return { 
    id: 'sideBar',
    name: "Side Bar Widget",
    component: "Stack",
    panelName: "leftPanel",
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
  component: "Stack",
  panelName: "rightPanel",
  enableClose: false,
  hideOnClose: false,
  status: WidgetStatus.ACTIVE,
  props: { size: { height: 600, width: 300 } }
};