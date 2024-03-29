import React, { Component } from 'react';
// import CameraControls from "@metacell/geppetto-meta-ui/camera-controls/CameraControls";
import { withStyles } from '@material-ui/core';
import { applySelection, mapToCanvasData } from "@metacell/geppetto-meta-ui/3d-canvas/utils/SelectionUtils"
import { connect } from 'react-redux';
import vars from '../theme/variables';
import CameraControls from './CameraControls';
import {Button, Box} from '@mui/material'
import Canvas from "@metacell/geppetto-meta-ui/3d-canvas/Canvas";
import { getInstancesTypes } from '../reducers/actions/types/getInstancesTypes';
import SharkViewer, { swcParser } from '@janelia/sharkviewer';
import * as THREE from 'three';
import { add3DSkeleton, focusInstance, selectInstance } from '../reducers/actions/instances';

const {
  whiteColor,
  blackColor
} = vars;

const styles = () => ({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'stretch',
  },
});

class ThreeDCanvas extends Component {
  constructor (props) {
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
        initialFlip: ['y', 'z'],
        reset: false,
        autorotate: false,
        wireframe: false,
      },
      showModel: false,
      mappedCanvasData: [],
      threeDObjects : []
    };

    this.canvasRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if(this.props.event.trigger !== prevProps.event.trigger){ 
      switch(this.props.event.action){
        // TODO : Remove and let custom camera handler control this action. Issue #VFB-136
        case getInstancesTypes.FOCUS_INSTANCE:
          this.canvasRef.current?.defaultCameraControlsHandler("cameraHome")
          break;
        case getInstancesTypes.ZOOM_TO_INSTANCE : {
          let match = this.props.mappedCanvasData?.find ( inst => inst.instancePath === this.props.event.id );
          if ( match ){
            window.Instances[match.instancePath]?.wrappedObj?.visible && this.canvasRef.current.threeDEngine.cameraManager.zoomTo([window.Instances[match.instancePath]])
          } else {
            this.canvasRef.current.defaultCameraControlsHandler("cameraHome")
          }
          break;
        }
        case getInstancesTypes.UPDATE_SKELETON:
        // Called to create the Neuron skeleton using the THREED Renderer  
        this.showSkeleton(this.props.event.id, this.props.event.mode, this.props.event.visible, this.props.threeDObjects)
          break;
        default:
      }
    }
  }

  showSkeleton (instanceID, mode, visible, threeDObjects) {
    let allLoadedInstances = this.props.allLoadedInstances;
    let match = allLoadedInstances?.find ( inst => inst.metadata?.Id === instanceID );
    let that = this;

    if ( match?.skeleton?.[mode] === undefined ) {
        // Initialize shark viewer to load SWC
        let sharkviewer = new SharkViewer({ dom_element: "canvas" });
        sharkviewer.mode = mode;
        sharkviewer.three_colors = [];
        Object.keys(sharkviewer.colors).forEach(color => {
          sharkviewer.three_colors.push(new THREE.Color(sharkviewer.colors[color]));
        })
        sharkviewer.three_materials = [];
        Object.keys(sharkviewer.colors).forEach(color => {
          sharkviewer.three_materials.push(
            new THREE.MeshBasicMaterial({
              color: sharkviewer.colors[color],
              wireframe: false
            })
          );
        });
        fetch(match?.metadata?.Images?.[Object.keys(match.metadata?.Images)[0]][0].swc)
          .then(response => response.text())
          .then(base64Content => {
            const swcJSON = swcParser(base64Content);
            let neuron = sharkviewer.createNeuron(swcJSON, match?.metadata?.Id, that?.canvasRef?.current?.threeDEngine?.renderer);
            neuron.name = match?.metadata?.Id;
            add3DSkeleton(neuron, mode, match?.metadata?.Id)
        })
    } else {
      let updatedObjects = threeDObjects?.filter( m => m.visible);
      this.setState({ ...this.state, threeDObjects : updatedObjects})
    }
  }

  componentWillUnmount () {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleToggle () {
    this.setState({ showLoader: true })
    this.setState({ showModel: true, showLoader: false, data: this.props.mappedCanvasData, cameraOptions: { ...this.state.cameraOptions, } })
  }

  handleClickOutside (event) {
    if (this.node && !this.node.contains(event.target)) {
      if (event.offsetX <= event.target.clientWidth){
        this.setState({ showModel: false })
      }
    }
  }

  onSelection (selectedInstances){
    console.log("Selected instances ", selectedInstances);
    selectedInstances?.forEach( id => {
      selectInstance(id);
      focusInstance(id)
    })
  }

  hoverHandler () {}

  render () {
    const { cameraOptions } = this.state
    const { classes , mappedCanvasData, threeDObjects} = this.props

    return <Box
      sx={{
        height: 'calc(100% - 0.5rem)',
        color: whiteColor,
        overflow: 'hidden',
        background: {
          lg: blackColor
        }
      }}
    >
      {mappedCanvasData?.length > 0 ? (
        <div ref={node => this.node = node} id="canvas" className={classes.container}>
          <>
            <Canvas
              ref={this.canvasRef}
              data={mappedCanvasData?.filter(d => d?.visibility )}
              threeDObjects={threeDObjects}
              cameraOptions={cameraOptions}
              onMount={scene => this.scene = scene}
              backgroundColor={blackColor}
              onSelection={this.onSelection}
              onHoverListeners={{ 'hoverId': this.hoverHandler }}
              dracoDecoderPath={'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/jsm/libs/draco/'}
            />
          </>
        </div>
      ) : null }
    </Box>
  }
}

const mapStateToProps = state => ({
  allLoadedInstances : state.instances.allLoadedInstances,
  mappedCanvasData : state.instances.mappedCanvasData,
  threeDObjects : state.instances.threeDObjects,
  focusInstance : state.instances.focusInstance,
  event : state.instances.event
});


export default connect(mapStateToProps)(withStyles(styles)(ThreeDCanvas));