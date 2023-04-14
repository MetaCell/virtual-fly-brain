import React, { useState, useEffect, useRef } from 'react';
import Canvas from "@metacell/geppetto-meta-ui/3d-canvas/Canvas";
import CameraControls from "@metacell/geppetto-meta-ui/camera-controls/CameraControls";
import CaptureControls from '@metacell/geppetto-meta-ui/capture-controls/CaptureControls';
import SimpleInstance from "@metacell/geppetto-meta-core/model/SimpleInstance";
import { applySelection, mapToCanvasData } from "@metacell/geppetto-meta-ui/3d-canvas/utils/SelectionUtils"
import Resources from '@metacell/geppetto-meta-core/Resources';
import ModelFactory from '@metacell/geppetto-meta-core/ModelFactory';
import { augmentInstancesArray } from '@metacell/geppetto-meta-core/Instances';
import { withStyles } from '@material-ui/core';

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

function loadInstances (instance){
  ModelFactory.cleanModel();
  const instance1 = new SimpleInstance(instance)
  window.Instances = [instance1]
  augmentInstancesArray(window.Instances);
}

const ThreeDCanvas = (props) =>  {
  const [modelUrl, setModelUrl] = useState("");
  const [canvasData, setCanvasData] = useState(undefined);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasData) {
      fetch('volume_man.obj')
      .then(response => response.text())
      .then(base64Content => {
        const instance = {
          "eClass": "SimpleInstance",
          "id": "ANeuron",
          "name": "The first SimpleInstance to be render with Geppetto Canvas",
          "type": { "eClass": "SimpleType" },
          "visualValue": {
            "eClass": Resources.OBJ,
            'obj': base64Content
          }
        }
        loadInstances(instance)
        const data = getProxyInstances();
        const mappedDanvasData = mapToCanvasData(data)
        setCanvasData(mappedDanvasData);
      });
    }
  }, []);

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

  return (
    canvasData ?  
        <div  >
          <>
            <Canvas
              ref={canvasRef}
              data={canvasData}
              cameraOptions={cameraOptions}
              captureOptions={captureOptions}
              backgroundColor={0x505050}
              onSelection={ () => {} }
              onMount={ () => {} }
              onHoverListeners={{ 'hoverId': ()=> {} }}
              dracoDecoderPath={'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/jsm/libs/draco/'}
            />
          </>
        </div>
        : <> Loading model ... </>
  );
};

export default withStyles(styles)(ThreeDCanvas);