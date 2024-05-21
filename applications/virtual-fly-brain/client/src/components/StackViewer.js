import React from 'react';
import vars from "../theme/variables";
import { useEffect, useMemo, useRef } from 'react';
import {useSelector, useDispatch} from 'react-redux'
import StackViewerComponent from './StackViewerComponent';
import Resources from '@metacell/geppetto-meta-core/Resources';
import SimpleInstance from "@metacell/geppetto-meta-core/model/SimpleInstance";
import { modifySliceDisplay, showSliceDisplay } from '../reducers/actions/globals';

const {
  secondaryBg,
  whiteColor,
  blackColor
} = vars;

let StackComponent = null;

const VFBStackViewer = (props) => {
  const data = useSelector(state => state.instances.allLoadedInstances);
  const dispatch = useDispatch();
  
  let config = {
    serverUrl: 'http://www.virtualflybrain.org/fcgi/wlziipsrv.fcgi',
    templateId: 'NOTSET'
  };
  let voxelSize = { x:0.622088, y:0.622088, z:0.622088 };

  if ( StackComponent == null ){
    StackComponent = StackViewerComponent()
  }

  const [stackData, setStackData] = React.useState({
    id: props.id, height: props.size?.height, width: props.size?.width, instances: [], selected: []
  });

  const addSlices = (instances) => {
    let added = undefined;
    let curr = stackData.instances.length;
    let data = stackData;
    if (instances.length == undefined) {
      added = [instances];
      if (instances?.parent) {
        // FIXME
        // this.props.vfbIdLoaded(instances.parent.getId(), "StackViewer");
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

  const updateStackWidget = () => {
    addSlices(getSliceInstances());
  }

  const showSliceDisplayControl = (data) => {
    dispatch(showSliceDisplay(data))
  }

  const modifySliceDisplayControl = (data) => {
    dispatch(modifySliceDisplay(data))
  }

  // stack widget helper methods
  const getSliceInstances = () => {
    // FIXME
    let instances = stackData.instances;
    let potentialInstances = instances;
    // window.GEPPETTO.ModelFactory.getAllPotentialInstancesEndingWith('_slices');
    let sliceInstances = [];
    let instance;
    // FIXME
    if (templateID !== undefined) {
      // Template ID must always be on top
      potentialInstances?.sort((x,y) => {
        return x.includes(templateID) ? -1 : y.includes(templateID) ? 1 : 0;
      });

      for (let i = 0; i < potentialInstances?.length; i++) {
        instance = potentialInstances[i];
        if (instance && sliceInstances?.find( i => i.wrappedObj?.id == instance?.wrappedObj?.id ) === undefined ) {
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
    let instances = stackData.instances;
    data?.forEach( stackViewerData => {
      if (stackViewerData?.stackInstance) {
        let keys = Object.keys(stackViewerData.metadata?.Images);
        const instancespec = {
          "eClass": "SimpleInstance",
          "id": stackViewerData.metadata?.Id,
          "name": stackViewerData.Name,
          "type": { "eClass": "SimpleType" },
          "visualValue": {
            "eClass": Resources.IMAGE,
            data :stackViewerData.metadata?.Images[keys[0]]?.[0].wlz.replace("https://www.virtualflybrain.org/data/","/disk/data/VFB/IMAGE_DATA/")
          }
        };

        const instance1spec = {
          "eClass": "SimpleInstance",
          "id": stackViewerData.metadata?.Id + "_slices",
          "name": stackViewerData.metadata?.Name + "_slices",
          "color" : stackViewerData.color,
          "type": { "eClass": "SimpleType" },
          "visualValue": {
            "eClass": Resources.IMAGE,
            data :stackViewerData.metadata?.Images[keys[0]]?.[0].wlz.replace("https://www.virtualflybrain.org/data/","/disk/data/VFB/IMAGE_DATA/")
          }
        };
        const parent = new SimpleInstance(instancespec);
        const slices = new SimpleInstance(instance1spec);
        slices.parent = parent;
        parent[stackViewerData.metadata?.Id + "_slices"] = slices;
        if ( instances.find( i => i.wrappedObj.id == slices.wrappedObj.id ) === undefined  ){
          instances.push(slices);
        } else {
          let instance = instances.find( i => i.wrappedObj.id == slices.wrappedObj.id );
          instance.wrappedObj.color = stackViewerData.color;
          if ( !stackViewerData.visible ){
            let instanceIndex = instances.findIndex( i => i.wrappedObj.id == slices.wrappedObj.id );
            instances.splice(instanceIndex, 1);
          }
        }
      }
  });
  const newData = {
    ...stackData ,
    id : "VFB",
    height: props.size.height,
    width: props.size.width,
    instances : instances };
  setStackData(newData);
  },[data]);

  // Update height and width of the stackwidget, happens when flex layout resizes tabs
  useEffect( () => {
    if (stackData?.height !== props?.size?.height || stackData?.width !== props?.size?.width) {
      let newData = stackData;
      newData.height = props.size?.height;
      newData.width = props.size?.width;
      setStackData(newData);
      updateStackWidget();
    }
  }, [props?.size?.height, props?.size?.width])


  // Update config and voxel size before re-rendering
  useMemo(() => {
    data?.forEach( stackViewerData => {
    if (stackViewerData?.metadata?.IsTemplate) {
      let keys = Object.keys(stackViewerData.metadata?.Images);
      config = stackViewerData.metadata?.Images[keys[0]]?.[0];
      config.serverUrl = 'http://www.virtualflybrain.org/fcgi/wlziipsrv.fcgi';
      if ( stackViewerData?.metadata?.Domains ){
        keys = Object.keys(stackViewerData?.metadata?.Domains);
      }
      let ids = [parseInt(keys[keys?.length - 1]) + 1], labels = [parseInt(keys[keys?.length - 1]) + 1], classID = [parseInt(keys[keys?.length - 1]) + 1]; 
      keys?.forEach( key => {
        ids[parseInt(key)] = (stackViewerData?.metadata?.Domains?.[key]?.id);
        labels[parseInt(key)] = (stackViewerData?.metadata?.Domains?.[key]?.type_label);
        classID[parseInt(key)] = (stackViewerData?.metadata?.Domains?.[key]?.type_id);
      })
      let voxels = [];
      if (config?.voxel != undefined) {
        voxelSize.x = Number(config.voxel.X || 0.622088);
        voxelSize.y = Number(config.voxel.Y || 0.622088);
        voxelSize.z = Number(config.voxel.Z || 0.622088);
        voxels = [voxelSize.x, voxelSize.y, voxelSize.z];
      }

      let subDomains = [voxels, ids, labels, classID]
      config.subDomains = subDomains;
    }
    if (config == undefined) {
      config = {
        serverUrl: 'http://www.virtualflybrain.org/fcgi/wlziipsrv.fcgi',
        templateId: 'NOTSET'
      };
    }
  });
  }, [stackData]);

  return (
      stackData?.instances?.length > 0 ? <StackComponent
      data={stackData}
      height={stackData.height}
      showSliceDisplay={showSliceDisplayControl}
      modifySliceDisplay={modifySliceDisplayControl}
      width={stackData.width}
      config={config}
      voxel={voxelSize}/> : null
  )
}

export default VFBStackViewer;