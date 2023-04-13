import React, { Component } from 'react';
import Canvas from "@metacell/geppetto-meta-ui/3d-canvas/Canvas";
import CameraControls from "@metacell/geppetto-meta-ui/camera-controls/CameraControls";
import CaptureControls from '@metacell/geppetto-meta-ui/capture-controls/CaptureControls';
import SimpleInstance from "@metacell/geppetto-meta-core/model/SimpleInstance";
import { applySelection, mapToCanvasData } from "@metacell/geppetto-meta-ui/3d-canvas/utils/SelectionUtils"
import Resources from '@metacell/geppetto-meta-core/Resources';
import ModelFactory from '@metacell/geppetto-meta-core/ModelFactory';
import { augmentInstancesArray } from '@metacell/geppetto-meta-core/Instances';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';

function loadInstance (objUrl){
  const instance1spec = {
    "eClass": "SimpleInstance",
    "id": "FBbt_00003748",
    "name": "The first SimpleInstance to be render with Geppetto Canvas",
    "type": { "eClass": "SimpleType" },
    "visualValue": {
      "eClass": Resources.GLTF,
      'gltf': objUrl
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
  constructor(props) {
    super(props);
    this.state = {
      modelUrl: "",
      canvasData: undefined,
      decodedString: undefined,
      loaded: false
    }
    this.hoverHandler = this.hoverHandler.bind(this);
    //this.handleToggle = this.handleToggle.bind(this);
    this.onSelection = this.onSelection.bind(this)
  }

  componentDidMount() {
    if (!this.state.canvasData) {
      fetch('base64.txt')
        .then(response => response.text())
        .then(base64Content => {
          console.log(base64Content);
          this.setState({ ...this.state, ...{ decodedString: base64Content }});
        });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.decodedString) {
      loadInstance(this.state.decodedString);
      const data = getProxyInstances();
      
      this.setState({ ...prevState, ...{ canvasData: data, loaded: true }});
    }
  }

  onMount (scene){
    console.log(scene)
  }

  onSelection (selectedInstances){
    
    //this.setState({ data: applySelection(this.state.data, selectedInstances) })
  }

  hoverHandler (objs, canvasX, canvasY) {
  }

  render() {
    const { classes } = this.props
    const cameraOptions = {
      initialPosition: { x: 319.7, y: 153.12, z: -494.2 },
      initialRotation: { rx: -3.14, ry: 0, rz: -3.14, radius: 559.83 },
      initialFlip: ['y', 'z'],
      cameraControls: {
        instance: CameraControls,
        props: { wireframeButtonEnabled: false },
      }
    }

    const mappedCanvasData = this.state.loaded ? mapToCanvasData(this.state.canvasData) : undefined ;

    return (
      this.state.loaded ?  
      <>
        <div ref={node => this.node = node} className={classes.container}>   
        <Canvas
            ref={this.canvasRef}
            data={mappedCanvasData}
            cameraOptions={cameraOptions}
            backgroundColor={0x505050}
            onSelection={this.onSelection}
            onMount={this.onMount}
            onHoverListeners={{ 'hoverId':this.hoverHandler }}
            />
        </div>
      </> 
      : <> Loading model ... </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    modelUrl: state.threeD.modelUrl?.url // Assuming the value you want to access is stored in the 'myValue' property of the 'myReducer' slice of the state
  };
};

export default connect(mapStateToProps)(withStyles(styles)(ThreeDCanvas));
