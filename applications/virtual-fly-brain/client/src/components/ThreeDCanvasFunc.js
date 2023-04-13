import React, { useState, useEffect } from 'react';
import Canvas from "@metacell/geppetto-meta-ui/3d-canvas/Canvas";
import CameraControls from "@metacell/geppetto-meta-ui/camera-controls/CameraControls";
import CaptureControls from '@metacell/geppetto-meta-ui/capture-controls/CaptureControls';
import SimpleInstance from "@metacell/geppetto-meta-core/model/SimpleInstance";
import { applySelection, mapToCanvasData } from "@metacell/geppetto-meta-ui/3d-canvas/utils/SelectionUtils"
import Resources from '@metacell/geppetto-meta-core/Resources';
import ModelFactory from '@metacell/geppetto-meta-core/ModelFactory';
import { augmentInstancesArray } from '@metacell/geppetto-meta-core/Instances';


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

const ThreeDCanvas = (props) =>  {
  const [modelUrl, setModelUrl] = useState("");
  const [canvasData, setCanvasData] = useState(undefined);
  const [decodedString, setDecodedString] = useState(undefined);
  const [needsRendering, setNeedsRendering] = useState(false);

  useEffect(() => {
    if (!canvasData) {
      fetch('base64.txt')
      .then(response => response.text())
      .then(base64Content => {
        console.log(base64Content);
        setDecodedString(base64Content);
      });
    }
  }, []);

  // useEffect(() => {
  //   if (needsRendering) {
  //     setNeedsRendering(false);
  //   }
  // }, [needsRendering]);

  useEffect(() => {
    if (decodedString) {
      loadInstance(decodedString);
      const data = getProxyInstances();
      const mapped = mapToCanvasData(data);
      setCanvasData(mapped);
      setNeedsRendering(true);
    }
  }, [decodedString]);

  const cameraOptions = {
    cameraControls: {
      instance: CameraControls,
      props: { wireframeButtonEnabled: false },
    }
  };

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
  };

  return (
    needsRendering ?  
      <>
        <Canvas
          data={canvasData}
          cameraOptions={cameraOptions}
          captureOptions={captureOptions}
          backgroundColor={0x505050}
          dracoDecoderPath={'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/jsm/libs/draco/'}
        />
      </> : <> Loading model ... </>
  );
};

export default ThreeDCanvas ;