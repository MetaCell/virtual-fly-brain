import React, { Component } from 'react';
// import CameraControls from "@metacell/geppetto-meta-ui/camera-controls/CameraControls";
import SimpleInstance from "@metacell/geppetto-meta-core/model/SimpleInstance";
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
import { SKELETON, CYLINDERS } from "./../utils/constants"
import { get3DMesh, add3DSkeleton } from '../reducers/actions/instances';
import Resources from '@metacell/geppetto-meta-core/Resources';

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
      const mappedCanvasData = [...this.props.allLoadedInstances];
      const threeDObjects = [...this.props.threeDObjects];
      const focusInstance = window.Instances?.find( instance => instance.wrappedObj.id === this.props.focusInstance?.Id);

      switch(this.props.event.action){
        case getInstancesTypes.FOCUS_INSTANCE:
          if ( focusInstance){
            this.canvasRef.current.threeDEngine.cameraManager.zoomTo([focusInstance])
          } else {
            this.canvasRef.current.defaultCameraControlsHandler("cameraHome")
          }
          break;
        case getInstancesTypes.ADD_INSTANCE:{
          const instance = mappedCanvasData.find( i => i.metadata?.Id === this.props.event.id );
          if ( instance?.simpleInstance === undefined ) {
            get3DMesh(instance)
          } 
          break;
        }
        case getInstancesTypes.UPDATE_INSTANCES:{
          let updatedCanvasData = mappedCanvasData?.filter( m => m?.simpleInstance )?.map( instance => {
            let { color, visibility, id } = instance.simpleInstance;
            return {
              instancePath : id,
              visibility,
              color,
              selected : instance.selected
            }
          })

          let updatedObjects = threeDObjects?.filter( m => m.visible)?.map( object => { return object });

          this.setState({ ...this.state, mappedCanvasData : updatedCanvasData, threeDObjects : updatedObjects})
          break;
        }
        case getInstancesTypes.UPDATE_SKELETON:
          this.showSkeleton(this.props.event.id, this.props.event.mode, this.props.event.visible, threeDObjects)
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
      this.setState({ ...this.state, threeDObjects : threeDObjects})
    }
  }

  componentWillUnmount () {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleToggle () {
    this.setState({ showLoader: true })
    this.setState({ showModel: true, showLoader: false, data: this.state.mappedCanvasData, cameraOptions: { ...this.state.cameraOptions, } })
  }

  handleClickOutside (event) {
    if (this.node && !this.node.contains(event.target)) {
      if (event.offsetX <= event.target.clientWidth){
        this.setState({ showModel: false })
      }
    }
  }

  onSelection (selectedInstances){
    let updatedCanvas = applySelection(this.state.mappedCanvasData, selectedInstances);
    this.setState({ mappedCanvasData: updatedCanvas })
  }

  hoverHandler () {}

  render () {
    const { cameraOptions } = this.state
    const { classes } = this.props

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
      {this.state.mappedCanvasData?.length > 0 ? (
        <div ref={node => this.node = node} id="canvas" className={classes.container}>
          <>
            <Canvas
              ref={this.canvasRef}
              data={this.state.mappedCanvasData?.filter(d => d?.visibility )}
              threeDObjects={this.state.threeDObjects}
              cameraOptions={cameraOptions}
              backgroundColor={blackColor}
              onSelection={this.onSelection}
              onHoverListeners={{ 'hoverId': this.hoverHandler }}
              dracoDecoderPath={'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/jsm/libs/draco/'}
            />
          </>
        </div>
      ) : (
        <Box>
          <Button
            variant="outlined"
            color="primary"
            onClick={this.handleToggle}
          >
            Show Example
          </Button>
        </Box>
      )}
    </Box>
  }
}

const mapStateToProps = state => ({
  allLoadedInstances : state.instances.allLoadedInstances,
  threeDObjects : state.instances.threeDObjects,
  focusInstance : state.instances.focusInstance,
  event : state.instances.event
});


export default connect(mapStateToProps)(withStyles(styles)(ThreeDCanvas));