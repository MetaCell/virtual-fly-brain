import ROIBrowser from '../ROIBrowser/ROIBrowser';
import StackViewer from '../StackViewer';
import ThreeDCanvas from '../ThreeDCanvas';
import VFBCircuitBrowser from '../VFBCircuitBrowser';
import VFBGraph from '../VFBGraph';
/**
 * Key of the component is the `component` attribute of the widgetConfiguration.
 * 
 * This map is used inside the LayoutManager to know which component to display for a given widget.
 */
const componentMap = {
    'stackViewer': StackViewer,
    'threeDCanvas': ThreeDCanvas,
    'roiBrowser': ROIBrowser,
    'termContext' : VFBGraph,
    'circuitBrowser' : VFBCircuitBrowser
};

export default componentMap
