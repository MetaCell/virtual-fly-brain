import React from 'react';
import StackViewerComponent from './StackViewerComponent';
import { useEffect, useMemo, useRef } from 'react';
import {useSelector, useDispatch} from 'react-redux'


const VFBStackViewer = (props) => {

  const stackViewerData = useSelector(state => state.termInfo.termInfoData)
  const error = useSelector(state => state.termInfo.error);
  const templateID = useSelector(state => state.globalInfo.templateID)
  const fields = useSelector((state) => state.WHATEVER_REDUCER);
  const stackRef = useRef();
  const layout = props.layout;
  const stackMD = "/org.geppetto.frontend/geppetto/extensions/geppetto-vfb/mdHelpFiles/stack.md";
  let config = {
    serverUrl: 'http://www.virtualflybrain.org/fcgi/wlziipsrv.fcgi',
    templateId: 'NOTSET'
  };
  let voxelSize = { x:0.622088, y:0.622088, z:0.622088 };

  const [stackData, setStackData] = React.useState({
    id: props.id, height: props.defHeight, width: props.defWidth, instances: [], selected: []
  });

  const [canvasRef, setCanvasRef] = React.useState(props.canvasRef);
  
  // TODO : Ref or redux?
  const updateCanvasRef = (newRef) => {
    setCanvasRef(newRef);
  }

  const addSlices = (instances) => {
    let added = undefined;
    let curr = stackData.instances.length;
    let data = stackData;
    if (instances.length == undefined) {
      added = [instances];
      if (instances?.parent) {
        if (props.onLoad !== undefined) {
          props.onLoad(instances.parent.getId());
        }
        if (instances.parent.getId() == templateID){
          data.instances.unshift(instances);
        } else {
          data.instances[data.instances.length] = instances;
        }
      } else {
        // FIXME
        window.test = instances;
      }
    } else {
      added = instances;
      data.instances = instances;
    }
    setStackData(data);
  }

  const removeSlice = (path) => {
    let data = stackData;
    data?.instances?.forEach( i => {
      try {
        if (data?.instances[i]?.parent?.getId() == path?.split('.')?.[0]){
          data.instances.splice(i,1);
        }
      } catch (ignore){ // handling already deleted instance
      }
    });
    setStackData(data);
  }
  
  // TODO : Handle if connection is closed, and reload page.
  const checkConnection = () => {}

  const updateStackWidget = () => {
    addSlices(getSliceInstances());
  }

  // stack widget helper methods
  const getSliceInstances = () => {
    // FIXME
    var potentialInstances = window.GEPPETTO.ModelFactory.getAllPotentialInstancesEndingWith('_slices');
    var sliceInstances = [];
    var instance;
    // FIXME
    if (templateID !== undefined) {
      // Template ID must always be on top
      potentialInstances.sort(function (x,y) {
        return x.includes(templateID) ? -1 : y.includes(templateID) ? 1 : 0;
      });

      for (var i = 0; i < potentialInstances.length; i++) {
        instance = stackData.data[i];
        if (instance) {
          sliceInstances.push(instance);
        }
      }
      return sliceInstances;
    } else {
      return sliceInstances
    }
  }

  // FIXME
  useEffect( () => {
    console.log("term info data : ", stackViewerData);
  });

  // Update height and width of the stackwidget, happens when flex layout resizes tabs
  useEffect( () => {
    if (stackData?.height !== props?.defHeight || stackData?.width !== props?.defWidth) {
      let newData = stackData;
      newData.height = props.defHeight;
      newData.width = props.defWidth;
      setStackData(newData);
      updateStackWidget();
    }
  }, [props?.defHeight, props?.defWidth])


  // Update config and voxel size before re-rendering
  useMemo(() => {
    let sliceInstances = getSliceInstances();

    if (sliceInstances?.length > 0 && typeof sliceInstances[0] !== "undefined" && sliceInstances[0]?.getValue !== undefined) {
      config = JSON.parse(sliceInstances[0].getValue().wrappedObj.value.data);
    }
    if (config == undefined) {
      config = {
        serverUrl: 'http://www.virtualflybrain.org/fcgi/wlziipsrv.fcgi',
        templateId: 'NOTSET'
      };
    } else if (config?.subDomains != undefined && config?.subDomains[0] != undefined && config?.subDomains[0]?.length > 2) {
      voxelSize.x = Number(config.subDomains[0][0] || 0.622088);
      voxelSize.y = Number(config.subDomains[0][1] || 0.622088);
      voxelSize.z = Number(config.subDomains[0][2] || 0.622088);
    }
  }, [stackData]);

  return (
    <StackViewerComponent
      data={stackViewerData}
      config={config}
      voxel={voxelSize}
      canvasRef={canvasRef}
      ref={stackRef}
      layout={layout}/>
  )
}

export default VFBStackViewer;