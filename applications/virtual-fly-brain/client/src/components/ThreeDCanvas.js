import React, { Component } from 'react';
import Canvas from "@metacell/geppetto-meta-ui/3d-canvas/Canvas";
import CameraControls from "@metacell/geppetto-meta-ui/camera-controls/CameraControls";
import CaptureControls from '@metacell/geppetto-meta-ui/capture-controls/CaptureControls';
import SimpleInstance from "@metacell/geppetto-meta-core/model/SimpleInstance";
import { withStyles } from '@material-ui/core';
import { applySelection, mapToCanvasData } from "@metacell/geppetto-meta-ui/3d-canvas/utils/SelectionUtils"
import Resources from '@metacell/geppetto-meta-core/Resources';
import ModelFactory from '@metacell/geppetto-meta-core/ModelFactory';
import { augmentInstancesArray } from '@metacell/geppetto-meta-core/Instances';
import { connect } from 'react-redux';


function loadInstance (objUrl, instanceId){
  const instance1spec = {
    "eClass": "SimpleInstance",
    "id": "FBbt_00003748",
    "name": "The first SimpleInstance to be render with Geppetto Canvas",
    "type": { "eClass": "SimpleType" },
    "visualValue": {
      "eClass": Resources.OBJ,
      'obj': objUrl
    }
  }

  ModelFactory.cleanModel();
  const instance1 = new SimpleInstance(instance1spec)
  window.Instances = [instance1]
  augmentInstancesArray(window.Instances);
}

function getProxyInstances () {
  return window.Instances.map(i => (
    { instancePath: i.getId(), color: { r: 0, g:1, b: 0, a:1 } }))
}

const styles = () => ({
  container: {
    height: '800px',
    width: '1240px',
    display: 'flex',
    alignItems: 'stretch',
  },
});

class ThreeDCanvas extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showLoader: false,
      showModel: false
    };
    this.onMount = this.onMount.bind(this);
    this.layoutRef = React.createRef();
  }

  componentDidMount () {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount () {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  onMount (scene){
    console.log(scene)
  }

  onSelection (selectedInstances){
    this.setState({ data: applySelection(this.state.data, selectedInstances) })
  }

  render () {
    const { modelUrl, instanceId, classes } = this.props

    let data = undefined ;
    let canvasData = undefined ; //mapToCanvasData(data)

    if (modelUrl)
    {
      loadInstance(modelUrl);
      data = getProxyInstances();
      canvasData = mapToCanvasData(data);
    }

    const cameraOptions = {
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
    }

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

    return  modelUrl ?  <div ref={node => this.node = node} className={classes.container}>
                          <>
                            <Canvas
                              ref={this.canvasRef}
                              data={canvasData}
                              cameraOptions={cameraOptions}
                              captureOptions={captureOptions}
                              backgroundColor={0x505050}
                              dracoDecoderPath={'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/jsm/libs/draco/'}
                            />
                          </>
                        </div> : <> Loading model ... </>
  }
}

const mapStateToProps = (state) => {
  return {
    modelUrl: state.threeD.modelUrl?.url // Assuming the value you want to access is stored in the 'myValue' property of the 'myReducer' slice of the state
  };
};

export default connect(mapStateToProps)(withStyles(styles)(ThreeDCanvas));