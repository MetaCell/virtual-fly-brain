import React from 'react';
import { useEffect, useMemo, useCallback, useRef } from 'react';
import {useSelector, useDispatch} from 'react-redux'
import StackViewerComponent from './StackViewerComponent';
import Resources from '@metacell/geppetto-meta-core/Resources';
import SimpleInstance from "@metacell/geppetto-meta-core/model/SimpleInstance";
import { modifySliceDisplay, showSliceDisplay } from '../reducers/actions/globals';

const VFBStackViewer = (props) => {
  const data = useSelector(state => state.instances.allLoadedInstances);
  const templateID = useSelector(state => state.globalInfo.templateID);
  const instanceEvent = useSelector(state => state.instances.event);
  const dispatch = useDispatch();
  
  const voxelSizeRef = useRef({ x:0.622088, y:0.622088, z:0.622088 });

  // Get the StackViewerComponent class - memoize to prevent recreating on every render
  const StackComponent = useMemo(() => StackViewerComponent(), []);

  const [stackData, setStackData] = React.useState({
    id: props.id, height: props.size?.height, width: props.size?.width, instances: [], selected: []
  });

  const addSlices = useCallback((instances) => {
    setStackData(prevData => {
      let newData = {...prevData};
      if (instances.length == undefined) {
        if (instances?.parent) {
          // FIXME
          // this.props.vfbIdLoaded(instances.parent.getId(), "StackViewer");
          if (instances.parent.getId() == templateID){
            newData.instances.unshift(instances);
          } else {
            newData.instances[newData.instances.length] = instances;
          }
        } else {
          // FIXME
          window.test = instances;
        }
      } else {
        newData.instances = instances;
      }
      return newData;
    });
  }, [templateID]);

  const getSliceInstances = useCallback(() => {
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
  }, [stackData.instances, templateID]);

  const updateStackWidget = useCallback(() => {
    addSlices(getSliceInstances());
  }, [addSlices, getSliceInstances]);

  const showSliceDisplayControl = useCallback((data) => {
    dispatch(showSliceDisplay(data))
  }, [dispatch]);

  const modifySliceDisplayControl = useCallback((data) => {
    dispatch(modifySliceDisplay(data))
  }, [dispatch]);

  // FIXME
  useEffect(() => {    
    const instances = [];
    data?.forEach((stackViewerData) => {      
      if (stackViewerData?.stackInstance) {
        const keys = Object.keys(stackViewerData.metadata?.Images);
        const instancespec = {
          eClass: "SimpleInstance",
          id: stackViewerData.metadata?.Id,
          name: stackViewerData.Name,
          type: { eClass: "SimpleType" },
          visualValue: {
            eClass: Resources.IMAGE,
            data: stackViewerData.metadata?.Images[keys[0]]?.[0].wlz.replace(
              "https://www.virtualflybrain.org/data/",
              "/disk/data/VFB/IMAGE_DATA/"
            ),
          },
        };

        const instance1spec = {
          eClass: "SimpleInstance",
          id: stackViewerData.metadata?.Id + "_slices",
          name: stackViewerData.metadata?.Name + "_slices",
          color: stackViewerData.color,
          type: { eClass: "SimpleType" },
          visualValue: {
            eClass: Resources.IMAGE,
            data: stackViewerData.metadata?.Images[keys[0]]?.[0].wlz.replace(
              "https://www.virtualflybrain.org/data/",
              "/disk/data/VFB/IMAGE_DATA/"
            ),
          },
        };
        const parent = new SimpleInstance(instancespec);
        const slices = new SimpleInstance(instance1spec);
        slices.parent = parent;
        parent[stackViewerData.metadata?.Id + "_slices"] = slices;
        if (stackViewerData.visible) {
          instances.push(slices);
        }
      }
    });
    
    setStackData(prevData => ({
      ...prevData,
      id: "VFB",
      height: props.size.height,
      width: props.size.width,
      instances: instances,
    }));

  }, [data, instanceEvent, props.size.height, props.size.width]);

  // Update height and width of the stackwidget, happens when flex layout resizes tabs
  useEffect( () => {
    if (stackData?.height !== props?.size?.height || stackData?.width !== props?.size?.width) {
      setStackData(prevData => ({
        ...prevData,
        height: props.size?.height,
        width: props.size?.width,
      }));
      updateStackWidget();
    }
  }, [props?.size?.height, props?.size?.width, stackData?.height, stackData?.width, updateStackWidget])


  // Update config and voxel size before re-rendering
  const config = useMemo(() => {
    let result = {
      serverUrl: 'http://www.virtualflybrain.org/fcgi/wlziipsrv.fcgi',
      templateId: 'NOTSET',
      templateDomainIds: [],
      templateDomainNames: [],
      templateDomainTypeIds: [],
      subDomains: []
    };

    data?.forEach(stackViewerData => {
      if (stackViewerData?.metadata?.IsTemplate) {
        const imageKeys = Object.keys(stackViewerData.metadata?.Images || {});
        if (!imageKeys.length) {
          return;
        }

        const imageMeta =
          stackViewerData.metadata?.Images[imageKeys[0]]?.[0];
        if (!imageMeta) {
          return;
        }

        const domains = stackViewerData.metadata?.Domains || {};
        const domainKeys = Object.keys(domains);
        const maxIndex = domainKeys.reduce(
          (acc, k) => Math.max(acc, Number(k) || 0),
          0
        );

        const ids = new Array(maxIndex + 1);
        const labels = new Array(maxIndex + 1);
        const classIDs = new Array(maxIndex + 1);

        domainKeys.forEach(key => {
          const idx = Number(key);
          const d = domains[key];
          ids[idx] = d?.id;
          labels[idx] = d?.type_label;
          classIDs[idx] = d?.type_id;
        });

        const voxels = [];
        if (imageMeta?.voxel) {
          voxelSizeRef.current.x = Number(imageMeta.voxel.X || 0.622088);
          voxelSizeRef.current.y = Number(imageMeta.voxel.Y || 0.622088);
          voxelSizeRef.current.z = Number(imageMeta.voxel.Z || 0.622088);
          voxels.push(
            voxelSizeRef.current.x,
            voxelSizeRef.current.y,
            voxelSizeRef.current.z
          );
        }

        result = {
          ...imageMeta,
          serverUrl: 'http://www.virtualflybrain.org/fcgi/wlziipsrv.fcgi',
          templateId: stackViewerData.metadata?.Id,
          templateDomainIds: ids,
          templateDomainNames: labels,
          templateDomainTypeIds: classIDs,
          subDomains: [voxels, ids, labels, classIDs]
        };
      }
    });

    return result;
  }, [data]);

  return (
      stackData?.instances?.length > 0 ? <StackComponent
      data={stackData}
      height={stackData.height}
      showSliceDisplay={showSliceDisplayControl}
      modifySliceDisplay={modifySliceDisplayControl}
      width={stackData.width}
      config={config}
      voxel={voxelSizeRef.current}/> : null
  )
}

export default VFBStackViewer;
