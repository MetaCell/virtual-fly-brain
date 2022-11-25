import React, { useState, useEffect }  from 'react';
import { useSelector } from 'react-redux';
import Canvas from "@metacell/geppetto-meta-ui/3d-canvas/Canvas";
import SimpleInstance from "@metacell/geppetto-meta-core/model/SimpleInstance";
import CameraControls from "@metacell/geppetto-meta-ui/camera-controls/CameraControls";
import CanvasTooltip from "@metacell/geppetto-meta-ui/3d-canvas/utils/CanvasToolTip"
import { withStyles, makeStyles } from '@material-ui/core';
import { applySelection, mapToCanvasData } from "@metacell/geppetto-meta-ui/3d-canvas/utils/SelectionUtils"
import CaptureControls from "@metacell/geppetto-meta-ui/capture-controls/CaptureControls";
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

const canvasStyle = makeStyles(() => ({
  canvasContainer: {
      height: '100%',
      width: '100%',
  },
}));

const VFBOBJModelLoader = (props) => {

  const style = canvasStyle();
  const dataSetsQuery = useSelector(state => state.Query.datasets_query);
  const canvasRef = React.createRef();
  const tooltipRef = React.useRef(null);
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
            const canvasData = mapToCanvasData(data)
            setCanvasData(canvasData);
          })
        }
      }

      loadInstance(dataSetsQuery, modelId).catch(console.error);
    }

    }, [dataSetsQuery]); // listen only to currentChannelName changes

    const cameraOptions = {
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
      wireframe: false
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

    return canvasData ?  
      <div className={style.canvasContainer}>
        <div id={'canvas-tooltips-container'}>
            <div>
                <CanvasTooltip
                    ref={tooltipRef}
                />
                
            </div>
        </div>
        <div className={style.canvasContainer}>
            <Canvas
              ref={canvasRef}
              data={canvasData}
              cameraOptions={cameraOptions}
              captureOptions={captureOptions}
              backgroundColor={0x505050}
            />
        </div>
      </div>
      : <><div>OBJ Model Loading...</div></> ;
}

export default withStyles(styles)(VFBOBJModelLoader);
