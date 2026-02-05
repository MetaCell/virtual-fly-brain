import React, { Component } from "react";
import * as THREE from "three";
import { Box } from "@mui/material";
import { connect } from "react-redux";
import vars from "../theme/variables";
import CameraControls from "./CameraControls";
import { withStyles } from "@material-ui/core";
import ReactResizeDetector from "react-resize-detector";
import SharkViewer, { swcParser } from "@janelia/sharkviewer";
import Canvas from "@metacell/geppetto-meta-ui/3d-canvas/Canvas";
import { getGlobalTypes } from "../reducers/actions/types/GlobalTypes";
import { getInstancesTypes } from "../reducers/actions/types/getInstancesTypes";
import { mapToCanvasData } from "@metacell/geppetto-meta-ui/3d-canvas/utils/SelectionUtils";
import {
  add3DSkeleton,
  focusInstance,
  selectInstance,
} from "../reducers/actions/instances";

const API_URL = import.meta.env.VITE_API_URL;
const { whiteColor, blackBG } = vars;

const MESH_POLL_MAX_ATTEMPTS = 150;
const CAMERA_RESET_DELAY_MS = 100;

const styles = () => ({
  container: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "stretch",
  },
});

class ThreeDCanvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      instance: undefined,
      loaded: false,
      showLoader: false,
      cameraOptions: {
        angle: 50,
        near: 0.01,
        far: 1000,
        baseZoom: 1,
        cameraControls: {
          instance: CameraControls,
          props: { wireframeButtonEnabled: false },
        },
        initialFlip: ["y", "z"],
        reset: false,
        autorotate: false,
        wireframe: false,
      },
      showModel: false,
      mappedCanvasData: [],
      threeDObjects: [],
      canvasWidth: 0,
      canvasHeight: 0,
      trigger: undefined,
    };
    this.canvasRef = React.createRef();
  }

  isMeshLoaded(instanceData) {
    try {
      const instance = window.Instances?.[instanceData.instancePath];
      if (!instance?.wrappedObj) return false;
      
      const wrappedObj = instance.wrappedObj;
      
      // Check if geometry has valid vertex data
      if (wrappedObj.geometry?.attributes?.position?.count > 0) {
        return true;
      }
      
      // Check children meshes
      if (Array.isArray(wrappedObj.children) && wrappedObj.children.length > 0) {
        return wrappedObj.children.some(child => 
          child?.geometry?.attributes?.position?.count > 0
        );
      }
      
      return false;
    } catch (err) {
      console.warn(`[ThreeDCanvas] Error checking mesh for ${instanceData.instancePath}:`, err);
      return false;
    }
  }

  resetCameraWithUpdate() {
    try {
      const threeDEngine = this.canvasRef.current?.threeDEngine;
      if (threeDEngine) {
        threeDEngine.updateVisibleChildren();
        threeDEngine.cameraManager?.resetCamera();
      }
    } catch (error) {
      console.error('[ThreeDCanvas] Failed to reset camera:', error);
    }
  }

  stopMeshPolling() {
    this._meshPolling = false;
    this._meshPollHandle = null;
  }

  startMeshPollingForBulkLoad() {
    // Cancel any existing mesh polling loop
    if (this._meshPolling && this._meshPollHandle) {
      cancelAnimationFrame(this._meshPollHandle);
    }
    
    this._meshPolling = true;
    let pollCount = 0;
    
    const checkAndReset = () => {
      pollCount++;
      
      if (!this._meshPolling) {
        this._meshPollHandle = null;
        return;
      }
      
      if (pollCount > MESH_POLL_MAX_ATTEMPTS) {
        console.warn(`[ThreeDCanvas] Mesh polling timeout after ${MESH_POLL_MAX_ATTEMPTS} attempts. Resetting camera anyway.`);
        this.stopMeshPolling();
        this.resetCameraWithUpdate();
        return;
      }
      
      const threeDEngine = this.canvasRef.current?.threeDEngine;
      if (!threeDEngine) {
        this._meshPollHandle = requestAnimationFrame(checkAndReset);
        return;
      }
      
      try {
        const visibleInstances = this.props.mappedCanvasData?.filter(d => d?.visibility) || [];
        
        if (visibleInstances.length === 0) {
          this.stopMeshPolling();
          this.resetCameraWithUpdate();
          return;
        }
        
        const loadedMeshes = visibleInstances.filter(d => this.isMeshLoaded(d));
        const allMeshesLoaded = loadedMeshes.length > 0 && 
                                loadedMeshes.length === visibleInstances.length;
        
        if (allMeshesLoaded) {
          console.log(`[ThreeDCanvas] All ${loadedMeshes.length} meshes loaded. Resetting camera.`);
          this.stopMeshPolling();
          this.resetCameraWithUpdate();
        } else {
          this._meshPollHandle = requestAnimationFrame(checkAndReset);
        }
      } catch (error) {
        console.error('[ThreeDCanvas] Error during mesh polling:', error);
        this.stopMeshPolling();
        this.resetCameraWithUpdate();
      }
    };
    
    this._meshPollHandle = requestAnimationFrame(checkAndReset);
  }

  componentDidUpdate(prevProps) {
    this.canvasRef.current?.threeDEngine?.updateVisibleChildren();
    if (this.props.event.trigger !== prevProps.event.trigger) {
      switch (this.props.event.action) {
        // TODO : Remove and let custom camera handler control this action. Issue #VFB-136
        case getInstancesTypes.ZOOM_TO_INSTANCE: {
          let match = this.props.mappedCanvasData?.find(
            (inst) => inst.instancePath === this.props.event.id
          );
          if (match) {
            window.Instances[match.instancePath]?.wrappedObj?.visible &&
              this.canvasRef.current.threeDEngine.cameraManager.zoomTo([
                window.Instances[match.instancePath],
              ]);
          } else {
            this.canvasRef.current.defaultCameraControlsHandler("cameraHome");
          }
          break;
        }
        case getInstancesTypes.ADD_INSTANCE: {
          if (this.props.event.bulkLoadComplete) {
            this.startMeshPollingForBulkLoad();
          }
          break;
        }
        // TOOD : Geppetto-meta bug opened to handle this. Once it's close, this can be removed.
        case getGlobalTypes.CAMERA_EVENT: {
          // Force Canvas re-render after a camera event
          setTimeout(() => {
            this.canvasRef.current?.threeDEngine?.updateVisibleChildren();
            this.forceUpdate();
          }, CAMERA_RESET_DELAY_MS);
          break;
        }
        case getInstancesTypes.UPDATE_SKELETON:
          // Called to create the Neuron skeleton using the THREED Renderer
          this.showSkeleton(
            this.props.event.id,
            this.props.event.mode,
            this.props.event.visible,
            this.props.threeDObjects
          );
          this.canvasRef.current?.threeDEngine?.updateVisibleChildren();
          break;
        case getInstancesTypes.GET_3D_OBJ_TYPE_SUCCESS:
        case getInstancesTypes.UPDATE_INSTANCES:
          // Called to update the 3D objects in the canvas
          setTimeout(() => {
            this.canvasRef.current?.threeDEngine?.updateVisibleChildren();
            this.forceUpdate();
          }, 250);
          break;
        default:
      }
    }
  }

  showSkeleton(instanceID, mode, visible, threeDObjects) {
    let allLoadedInstances = this.props.allLoadedInstances;
    let match = allLoadedInstances?.find(
      (inst) => inst.metadata?.Id === instanceID
    );
    let that = this;

    if (match?.skeleton?.[mode] === undefined) {
      // Initialize shark viewer to load SWC
      let sharkviewer = new SharkViewer({ dom_element: "canvas" });
      sharkviewer.mode = mode;
      sharkviewer.three_colors = [];

      // Use full opacity for skeletons
      if (match.fullOpacityColor) {
        // Use stored full opacity color for consistent coloring
        sharkviewer.color = match.fullOpacityColor;
      } else {
        // If no stored color, use current color with full opacity
        sharkviewer.color = { ...match.color, a: 1.0 };
      }

      Object.keys(sharkviewer.colors).forEach((color) => {
        sharkviewer.three_colors.push(
          new THREE.Color(sharkviewer.colors[color])
        );
      });
      sharkviewer.three_materials = [];
      Object.keys(sharkviewer.colors).forEach((color) => {
        sharkviewer.three_materials.push(
          new THREE.MeshBasicMaterial({
            color: sharkviewer.colors[color],
            wireframe: false,
          })
        );
      });
      const firstImageKey = Object.keys(match.metadata?.Images)[0];
      const swcPath = match?.metadata?.Images?.[firstImageKey]?.[0]?.swc;
      const swcURL = swcPath?.startsWith("http")
        ? swcPath
        : `${API_URL}${swcPath}`;

      if (swcURL) {
        fetch(swcURL)
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Failed to fetch SWC file. Status: ${response.status}`
              );
            }
            return response.text();
          })
          .then((base64Content) => {
            try {
              const swcJSON = swcParser(base64Content);
              const neuron = sharkviewer.createNeuron(
                swcJSON,
                match?.metadata?.Id,
                that?.canvasRef?.current?.threeDEngine?.renderer
              );
              neuron.name = match?.metadata?.Id;
              add3DSkeleton(neuron, mode, match?.metadata?.Id);
            } catch (err) {
              console.error("Error parsing or visualizing SWC content:", err);
            }
          })
          .catch((err) => {
            console.error("Error during SWC fetch or processing:", err);
          });
      } else {
        console.warn("Invalid or missing SWC path in metadata.");
      }
    } else {
      let updatedObjects = threeDObjects?.filter((m) => m.visible);
      this.setState({ ...this.state, threeDObjects: updatedObjects });
    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
    
    // Cancel any ongoing mesh polling to prevent operations on unmounted component
    if (this._meshPolling && this._meshPollHandle) {
      cancelAnimationFrame(this._meshPollHandle);
      this.stopMeshPolling();
    }
  }

  componentDidMount() {
    this.onResize = this.onResize.bind(this);

    document.addEventListener("mousedown", this.handleClickOutside);
    this.setState({
      mappedCanvasData: mapToCanvasData(this.props.allLoadedInstances),
    });
  }

  handleToggle() {
    this.setState({ showLoader: true });
    this.setState({
      showModel: true,
      showLoader: false,
      data: this.props.mappedCanvasData,
      cameraOptions: { ...this.state.cameraOptions },
    });
  }

  handleClickOutside(event) {
    if (this.node && !this.node.contains(event.target)) {
      if (event.offsetX <= event.target.clientWidth) {
        this.setState({ showModel: false });
      }
    }
  }

  onSelection(selectedInstances) {
    selectedInstances?.forEach((id) => {
      focusInstance(id);
      selectInstance(id);
    });
  }

  selectionStrategy(props, selectedMap) {
    let selected = Object.freeze({
      nearest: (selectedMap) =>
        [
          Object.keys(selectedMap).reduce((selected, current) => {
            if (!selected) {
              return current;
            } else {
              return selectedMap[current].distance <
                selectedMap[selected].distance
                ? current
                : selected;
            }
          }, null),
        ].filter((s) => s != props.templateID),
      farthest: (selectedMap) =>
        [
          Object.keys(selectedMap).reduce((selected, current) => {
            if (!selected) {
              return current;
            } else {
              return selectedMap[current].distance >
                selectedMap[selected].distance
                ? current
                : selected;
            }
          }, null),
        ].filter((s) => s != props.templateID),
      all: (selectedMap) =>
        Object.keys(selectedMap).filter((s) => s != props.templateID),
    });

    const selection = selected["all"](selectedMap);
    let match = props.allLoadedInstances?.find((i) => i.selected);
    if (match) {
      if (selection.findIndex((index) => index == match?.metadata?.Id) > -1) {
        selection.splice(
          selection.findIndex((index) => index == match?.metadata?.Id),
          1
        );
      }
    }

    return selection;
  }

  hoverHandler() {}

  onResize(width, height) {
    this.setState({
      canvasWidth: width,
      canvasHeight: height,
      cameraOptions: {
        ...this.state.cameraOptions,
        cameraControls: {
          ...this.state.cameraOptions.cameraControls,
          props: {
            ...this.state.cameraOptions.cameraControls.props,
            canvasWidth: width,
            canvasHeight: height,
          },
        },
      },
    });
  }

  render() {
    const { cameraOptions } = this.state;
    const { classes, mappedCanvasData, threeDObjects } = this.props;

    return (
      <Box
        sx={{
          height: "100%",
          color: whiteColor,
          overflow: "hidden",
          background: {
            lg: blackBG,
          },
        }}
      >
        {mappedCanvasData?.length > 0 ? (
          <div
            ref={(node) => (this.node = node)}
            id="canvas"
            className={classes.container}
          >
            <ReactResizeDetector
              skipOnMount={true}
              onResize={this.onResize.bind(this)}
            >
              <Canvas
                ref={this.canvasRef}
                data={mappedCanvasData?.filter((d) => d?.visibility)}
                threeDObjects={threeDObjects}
                cameraOptions={cameraOptions}
                onMount={(scene) => (this.scene = scene)}
                backgroundColor={blackBG}
                onSelection={this.onSelection}
                selectionStrategy={(selectedMap) =>
                  this.selectionStrategy(this.props, selectedMap)
                }
                onHoverListeners={{ hoverId: this.hoverHandler }}
                dracoDecoderPath={
                  "https://raw.githubusercontent.com/ddelpiano/three.js/dev/examples/jsm/libs/draco/"
                }
              />
            </ReactResizeDetector>
          </div>
        ) : (
          <div></div>
        )}
      </Box>
    );
  }
}

const mapStateToProps = (state) => ({
  allLoadedInstances: state.instances.allLoadedInstances,
  mappedCanvasData: state.instances.mappedCanvasData,
  threeDObjects: state.instances.threeDObjects,
  focusInstance: state.instances.focusInstance,
  event: state.instances.event,
  templateID: state.globalInfo.templateID,
});

const ConnectedThreeDCanvas = connect(mapStateToProps)(withStyles(styles)(ThreeDCanvas));
export default ConnectedThreeDCanvas;
