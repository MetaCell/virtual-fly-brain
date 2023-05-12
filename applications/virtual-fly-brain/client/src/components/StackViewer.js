import React from 'react';
import { Box } from "@mui/material";
import StackViewerComponent from './StackViewerComponent';
import { useEffect, useMemo, useRef } from 'react';
import {useSelector, useDispatch} from 'react-redux'
import SimpleInstance from "@metacell/geppetto-meta-core/model/SimpleInstance";
import Resources from '@metacell/geppetto-meta-core/Resources';
import vars from "../theme/variables";
import { integerPropType } from '@mui/utils';

const {
  secondaryBg,
  whiteColor,
  blackColor
} = vars;


const VFBStackViewer = (props) => {
  const classes = {
    root: {
      height: 'calc(100% - 0.5rem)',
      width : '400px',
      color: whiteColor
    }
  }

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
    let instances = stackData.instances;
    let potentialInstances = instances;
    // window.GEPPETTO.ModelFactory.getAllPotentialInstancesEndingWith('_slices');
    var sliceInstances = [];
    var instance;
    // FIXME
    if (templateID !== undefined) {
      // Template ID must always be on top
      potentialInstances?.sort((x,y) => {
        return x.includes(templateID) ? -1 : y.includes(templateID) ? 1 : 0;
      });

      for (var i = 0; i < potentialInstances?.length; i++) {
        instance = potentialInstances[i];
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
    let instances = stackData.instances;
    if (!instances.find( i => i?.Id === stackViewerData?.Id) && stackViewerData) {
      let keys = Object.keys(stackViewerData.Images);

      const instancespec = {
        "eClass": "SimpleInstance",
        "id": stackViewerData.Id,
        "name": stackViewerData.Name,
        "type": { "eClass": "SimpleType" },
        "visualValue": {
          "eClass": Resources.IMAGE,
          data :stackViewerData.Images[keys[0]]?.[0].wlz.replace("https://www.virtualflybrain.org/data/","/disk/data/VFB/IMAGE_DATA/")
        }
      };

      const instance1spec = {
        "eClass": "SimpleInstance",
        "id": stackViewerData.Id + "_slices",
        "name": stackViewerData.Name + "_slices",
        "type": { "eClass": "SimpleType" },
        "visualValue": {
          "eClass": Resources.IMAGE,
          data :stackViewerData.Images[keys[0]]?.[0].wlz.replace("https://www.virtualflybrain.org/data/","/disk/data/VFB/IMAGE_DATA/")
        }
      };
      const parent = new SimpleInstance(instancespec);
      const slices = new SimpleInstance(instance1spec);
      slices.parent = parent;
      parent[stackViewerData.Id + "_slices"] = slices;
      instances.push(slices);
    }
    const newData = {...stackData , instances : instances };
    setStackData(newData);
  },[stackViewerData]);

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
    if (stackViewerData?.Images) {
      let keys = Object.keys(stackViewerData.Images);
      config = stackViewerData.Images[keys[0]]?.[0];
      config.serverUrl = 'http://www.virtualflybrain.org/fcgi/wlziipsrv.fcgi';
      keys = Object.keys(stackViewerData.Domains);
      let ids = [parseInt(keys[keys.length - 1]) + 1], labels = [parseInt(keys[keys.length - 1]) + 1], classID = [parseInt(keys[keys.length - 1]) + 1]; 
      keys.forEach( key => {
        ids[parseInt(key)] = (stackViewerData.Domains[key].id);
        labels[parseInt(key)] = (stackViewerData.Domains[key].type_label);
        classID[parseInt(key)] = (stackViewerData.Domains[key].type_id);
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
  }, [stackData]);

  const StackComponent = StackViewerComponent();
  return (
    <Box
      sx={{
        ...classes.root,
        background: {
          lg: blackColor
        },
        p: {
          xs: 2,
          lg: 0
        },
        borderColor: {
          lg: secondaryBg
        },
        borderStyle: {
          lg: 'solid'
        },
        borderRadius: {
          lg: 2
        },
        borderWidth: {
          xs: 0,
          lg: '0.0625rem 0.0625rem 0 0'
        }
      }}
    >
      Stack Viewer
      <StackComponent
      data={stackData}
      config={config}
      voxel={voxelSize}/>
    </Box>
  )
}

export default VFBStackViewer;