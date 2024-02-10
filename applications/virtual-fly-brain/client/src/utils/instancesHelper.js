import SimpleInstance from "@metacell/geppetto-meta-core/model/SimpleInstance";
import { augmentInstancesArray } from '@metacell/geppetto-meta-core/Instances';

export const loadInstances = (instance, loadedInstances) =>{
  const instance1 = new SimpleInstance(instance)
  instance1.color = instance.color;
  let instances = window.Instances;
  if ( instances === undefined ){
    instances = [];
  }
  instances?.find( i => i.wrappedObj?.id === instance.id ) ? null : window.Instances = [...instances, instance1]
  window.Instances.forEach( inst => {
    inst.color = loadedInstances?.find( i => inst.wrappedObj.id === i.metadata?.Id )?.color;
  })
  augmentInstancesArray(window.Instances);
}

export const getProxyInstances = (loadedInstances, instances) => {
  return window.Instances.map(i => (
    { ...i,
      instancePath: i.getId(),
      visibility : loadedInstances?.find( cd => cd.metadata?.Id === i.getId())?.visible,
      color : instances?.find( cd => cd.metadata?.Id === i.getId())?.color
    }
  ))
}