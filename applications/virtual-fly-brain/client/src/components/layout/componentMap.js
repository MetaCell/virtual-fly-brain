import SideBar from '../../shared/sidebar';
import ROIBrowser from '../ROIBrowser/ROIBrowser';
import StackViewer from '../StackViewer';
import ThreeDCanvas from '../ThreeDCanvas';
/**
 * Key of the component is the `component` attribute of the widgetConfiguration.
 * 
 * This map is used inside the LayoutManager to know which component to display for a given widget.
 */
const componentMap = {
    'stackViewer': StackViewer,
    'threeDCanvas': ThreeDCanvas,
    'sideBar': SideBar,
    'roiBrowser': ROIBrowser
};

export default componentMap