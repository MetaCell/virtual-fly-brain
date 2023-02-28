import React, { useState, useEffect }  from 'react';
import { useSelector } from 'react-redux';
import Canvas from "@metacell/geppetto-meta-ui/3d-canvas/Canvas";
import SimpleInstance from "@metacell/geppetto-meta-core/model/SimpleInstance";
import CameraControls from "@metacell/geppetto-meta-ui/camera-controls/CameraControls";
import { withStyles } from '@material-ui/core';
import { applySelection, mapToCanvasData } from "@metacell/geppetto-meta-ui/3d-canvas/utils/SelectionUtils"
import CaptureControls from "@metacell/geppetto-meta-ui/capture-controls/CaptureControls";
import { augmentInstancesArray } from '@metacell/geppetto-meta-core/Instances';
import ModelFactory from '@metacell/geppetto-meta-core/ModelFactory';

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

const OBJ3DCanvas = (props) => {

  const dataSetsQuery = useSelector(state => state.OBJ3.modelUrl);
  const canvasRef = React.createRef();
  const modelId = props.modelId
  const [canvasData, setCanvasData] = useState(undefined);

  function getProxyInstances () {
    return window.Instances.map(i => (
      { instancePath: i.getId(), }))
  }

  useEffect(() => {
    if(dataSetsQuery) {

      const loadInstance = async (dataSetsQuery, modelId) => {
        if (dataSetsQuery.length > 0)
        {
          const objUrl = dataSetsQuery.find( query => query.indexOf(modelId) > -1 ) + '/volume.obj';
          return fetch(objUrl)
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
            ModelFactory.cleanModel();
            const instance = new SimpleInstance(model)
            window.Instances = [instance]
            augmentInstancesArray(window.Instances);

            const data = getProxyInstances();
            setCanvasData(data);
          })
        }
      }

      loadInstance(dataSetsQuery, modelId).catch(console.error);
    }

  }, [dataSetsQuery]); // listen only to currentChannelName changes

    const state = {
      cameraOptions: {
        angle: 60,
        near: 10,
        far: 2000000,
        baseZoom: 1,
        cameraControls: {
          instance: CameraControls,
          props: { wireframeButtonEnabled: false, },
        },
        reset: false,
        autorotate: false,
        wireframe: false,
        initialPosition: { x: 230.357, y: 256.435, z: 934.238 },
        initialRotation: { rx: -0.294, ry: -0.117, rz: -0.02, radius: 531.19 },
      },
    }
    
    return canvasData ?  
      <div ref={node => this.node = node} className={props.classes.container}>
        <>
          <Canvas
            ref={canvasRef}
            data={canvasData}
            cameraOptions={state.cameraOptions}
            backgroundColor={0x505050}
          />
        </>
      </div>
      : <><div>OBJ Model Loading...</div></> ;
}

export default withStyles(styles)(OBJ3DCanvas);
