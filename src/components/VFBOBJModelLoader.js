import React, { useState, useEffect }  from 'react';
import { useSelector } from 'react-redux';
import Canvas from "@metacell/geppetto-meta-ui/3d-canvas/Canvas";
import CameraControls from "@metacell/geppetto-meta-ui/camera-controls/CameraControls";
import { withStyles } from '@material-ui/core';
import { applySelection, mapToCanvasData } from "@metacell/geppetto-meta-ui/3d-canvas/utils/SelectionUtils"
import CaptureControls from "@metacell/geppetto-meta-ui/capture-controls/CaptureControls";

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

const VFBOBJModelLoader = () => {

  useEffect(() => {
    if(dataSetsQuery) {

      const loadInstance = async (dataSetsQuery) => {
        return fetch(dataSetsQuery)
        .then(obj => { 
          const model = {
            "eClass": "SimpleInstance",
            "id": "ANeuron",
            "name": "VFB Obj Loader",
            "type": { "eClass": "SimpleType" }
            , "visualValue": {
              "eClass": "OBJ", //Resources.OBJ,
              'obj': obj
            }
          }
          // ModelFactory.cleanModel();
          // const instance = new SimpleInstance(model)
          // window.Instances = [instance]
          // augmentInstancesArray(window.Instances);
        })
      }
    }

    //loadInstance().catch(console.error);
  }, [dataSetsQuery]); // listen only to currentChannelName changes

    const state = {
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
      }
    }

    const canvasData = mapToCanvasData(data)
    const { classes } = this.props
    const [data, setData] = useState({});
    const [showLoader, setShowLoader] = useState(true);

    const dataSetsQuery = useSelector(state => state.Query.datasets_query);

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
    
    return showLoader ? <div>OBJ Model Loading...</div> : 
      <div ref={node => this.node = node} className={classes.container}>
        <>
          <Canvas
            ref={this.canvasRef}
            data={this.canvasData}
            cameraOptions={this.state.cameraOptions}
            captureOptions={this.captureOptions}
            backgroundColor={0x505050}
            onSelection={this.onSelection}
            onMount={this.onMount}
            onHoverListeners={{ 'hoverId':this.hoverHandler }}
          />
        </>
      </div>
}

export default withStyles(styles)(VFBOBJModelLoader);
