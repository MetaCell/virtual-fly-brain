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
    };

    this.canvasRef = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.event.trigger !== prevProps.event.trigger){ 
      const mappedCanvasData = [...this.props.simpleInstances];
      const focusInstance = window.Instances?.find( instance => instance.wrappedObj.id === this.props.focusInstance?.Id);

      switch(this.props.event.action){
        case getInstancesTypes.FOCUS_INSTANCE:
          if ( focusInstance){
            this.canvasRef.current.threeDEngine.cameraManager.zoomTo([focusInstance])
          } else {
            this.canvasRef.current.defaultCameraControlsHandler("cameraHome")
          }
          break;
        case getInstancesTypes.UPDATE_INSTANCES:
          this.setState({ ...this.state, mappedCanvasData : mappedCanvasData})
          break;
        default:
      }
    }
  }

  componentWillUnmount () {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleToggle () {
    this.setState({ showLoader: true })
    this.setState({ showModel: true, showLoader: false, data: this.props.simpleInstances, cameraOptions: { ...this.state.cameraOptions, } })
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
  simpleInstances : state.instances.simpleInstances,
  focusInstance : state.instances.instanceOnFocus,
  event : state.instances.event
});


export default connect(mapStateToProps)(withStyles(styles)(ThreeDCanvas));