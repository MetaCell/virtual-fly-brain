import React, { useState, useEffect }  from 'react';
import { useSelector } from 'react-redux';
import Canvas from "@metacell/geppetto-meta-ui/3d-canvas/Canvas";
import SimpleInstance from "@metacell/geppetto-meta-core/model/SimpleInstance";
import CameraControls from "@metacell/geppetto-meta-ui/camera-controls/CameraControls";
import { withStyles } from '@material-ui/core';
import Resources from '@metacell/geppetto-meta-core/Resources';
import { augmentInstancesArray } from '@metacell/geppetto-meta-core/Instances';
import ModelFactory from '@metacell/geppetto-meta-core/ModelFactory';

const styles = () => ({
  container: {
    height: '800px',
    width: '1240px',
    display: 'flex',
    alignItems: 'stretch',
  },
});

const ThreeDCanvas = (props) => {

  const modelUrl = useSelector(state => state.threeD.modelUrl);
  const canvasRef = React.createRef();
  const [canvasData, setCanvasData] = useState(undefined);

  useEffect(() => {
    if(modelUrl) {

      const loadInstance = async (modelUrl) => {
        const model = {
          "eClass": "SimpleInstance",
          "id": "ANeuron",
          "name": "VFB Obj Loader",
          "type": { "eClass": "SimpleType" }
          , "visualValue": {
            "eClass": Resources.OBJ,
            'obj': modelUrl
          }
        }
        ModelFactory.cleanModel();
        const instances = [new SimpleInstance(model)]
      }
      loadInstance(modelUrl).catch(console.error);
    }

  }, [modelUrl]); // listen only to currentChannelName changes

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

export default withStyles(styles)(ThreeDCanvas);
