import React, { Component } from 'react';
import Canvas from "@metacell/geppetto-meta-ui/3d-canvas/Canvas";
// import CameraControls from "@metacell/geppetto-meta-ui/camera-controls/CameraControls";
import SimpleInstance from "@metacell/geppetto-meta-core/model/Instance";
import { withStyles } from '@material-ui/core';
import Button from "@material-ui/core/Button";
import { applySelection, mapToCanvasData } from "@metacell/geppetto-meta-ui/3d-canvas/utils/SelectionUtils"
import CaptureControls from "@metacell/geppetto-meta-ui/capture-controls/CaptureControls";
import Resources from '@metacell/geppetto-meta-core/Resources';
import ModelFactory from '@metacell/geppetto-meta-core/ModelFactory';
import { augmentInstancesArray } from '@metacell/geppetto-meta-core/Instances';
import { connect } from 'react-redux';
import { Box } from '@mui/material';
import vars from '../theme/variables';
import CameraControls from './CameraControls';

const {
  secondaryBg,
  whiteColor,
  blackColor
} = vars;

function loadInstances (instance){
  ModelFactory.cleanModel();
  const instance1 = new SimpleInstance(instance)
  instance1.visible = true;
  let instances = window.Instances;
  if ( instances === undefined ){
    instances = [];
  }
  window.Instances?.find( i => i.wrappedObj?.id === instance.id ) ? null : window.Instances = [...instances, instance1]
  augmentInstancesArray(window.Instances);
}

function getProxyInstances () {
  return window.Instances.map(i => (
    { instancePath: i.getId(), color: { r: Math.random(), g:1, b: Math.random(), a:1 }, visible : true}))
}

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
      mappedCanvasData: []
    };

    this.hoverHandler = this.hoverHandler.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.onSelection = this.onSelection.bind(this)
    this.onMount = this.onMount.bind(this);
    this.layoutRef = React.createRef();
  }

  componentDidMount () {

  }

  componentDidUpdate(prevProps, prevState) {
    let that = this;
    let allLoadedInstances = this.props.allLoadedInstances;
    allLoadedInstances?.forEach ( inst => {
      if ( inst.visible ) {
        if ( that.state.mappedCanvasData?.find( i => inst.Id === i.instancePath ) === undefined ){
          let instanceCopy = inst;
          fetch(inst.Images?.[Object.keys(inst.Images)[0]][0].obj)
            .then(response => response.text())
            .then(base64Content => {
              const instance = {
                "eClass": "SimpleInstance",
                "id": instanceCopy.Id,
                "name": instanceCopy.Name,
                "type": { "eClass": "SimpleType" },
                "visualValue": {
                  "eClass": Resources.OBJ,
                  'obj': base64Content
                }
              }
              loadInstances(instance)
              const data = getProxyInstances();
              let mappedCanvasData = mapToCanvasData(data)
              let match = mappedCanvasData?.find( m => instance.id === m.instancePath )
              match.visible = true;
              that.setState({ ...that.state, mappedCanvasData : mappedCanvasData})
            });
        } else {
          let mappedCanvasData = [...that.state.mappedCanvasData]
          let match = mappedCanvasData?.find( m => m.instancePath === inst.Id )
          if ( !match?.visible ){
            match.visible = true;
            that.setState({ ...that.state, mappedCanvasData : mappedCanvasData})
          }
        }
      } else {
        let mappedCanvasData = [...that.state.mappedCanvasData]
        let match = mappedCanvasData?.find( m => m.instancePath === inst.Id )
        if ( match?.visible ){
          match.visible = false;
          that.setState({ ...that.state, mappedCanvasData : mappedCanvasData})
        }
      }
    });
  }

  componentWillUnmount () {
    document.removeEventListener('mousedown', this.handleClickOutside);
    console.log("Component unmouted")
  }

  hoverHandler (objs, canvasX, canvasY) {

  }

  handleToggle () {
    this.setState({ showLoader: true })
    loadInstances()
    this.setState({ showModel: true, showLoader: false, data: getProxyInstances(), cameraOptions: { ...this.state.cameraOptions, } })
  }

  handleClickOutside (event) {
    if (this.node && !this.node.contains(event.target)) {
      if (event.offsetX <= event.target.clientWidth){
        this.setState({ showModel: false })
      }
    }
  }

  onMount (scene){
    console.log(scene)
  }

  onSelection (selectedInstances){
    this.setState({ data: applySelection(this.state.data, selectedInstances) })
  }

  render () {
    const { cameraOptions, showModel, showLoader } = this.state
    let canvasData = undefined ;
    let data = undefined ;
    const { classes } = this.props

    const captureOptions = {
      captureControls: {
        instance: CaptureControls,
        props: {}
      },
      recorderOptions: {
        mediaRecorderOptions: { mimeType: 'video/webm', },
        blobOptions:{ type: 'video/webm' }
      },
      screenshotOptions:{
        resolution:{
          width: 3840,
          height: 2160,
        },
        quality: 0.95,
        pixelRatio: 1,
        filter: () => true
      },
    }

    console.log("Rendering data ", this.state.mappedCanvasData)

    return <Box
      sx={{
        height: 'calc(100% - 0.5rem)',
        color: whiteColor,
        overflow: 'hidden',
        background: {
          lg: blackColor
        },
        p: {
          xs: 2,
          lg: 0
        },
        borderColor: {
          lg: secondaryBg
        },
        borderStyle: {
          lg: 'solid'
        },
        borderRadius: {
          lg: 2
        },
        borderWidth: {
          xs: 0,
          lg: '0.0625rem 0.0625rem 0 0'
        }
      }}
    >
      {this.state.mappedCanvasData?.length > 0 ? (
        <div ref={node => this.node = node} className={classes.container}>
          <>
            <Canvas
              ref={this.canvasRef}
              data={this.state.mappedCanvasData?.filter(d => d?.visible )}
              cameraOptions={cameraOptions}
              // captureOptions={captureOptions}
              backgroundColor={blackColor}
              onSelection={this.onSelection}
              onMount={this.onMount}
              onHoverListeners={{ 'hoverId': this.hoverHandler }}
              dracoDecoderPath={'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/jsm/libs/draco/'}
            />
          </>
        </div>
      ) : (
        <Box p={2}>
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
  allLoadedInstances : state.instances.allLoadedInstances
});


export default connect(mapStateToProps)(withStyles(styles)(ThreeDCanvas));