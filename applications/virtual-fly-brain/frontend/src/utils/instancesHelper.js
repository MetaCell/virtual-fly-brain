import SimpleInstance from "@metacell/geppetto-meta-core/model/SimpleInstance";
import { augmentInstancesArray } from '@metacell/geppetto-meta-core/Instances';
import * as THREE from 'three';

export const loadInstances = (instance, loadedInstances) =>{
  const instance1 = new SimpleInstance(instance)
  instance1.color = instance.color;
  if ( instance1.wrappedObj?.visualValue?.obj ) { 
    instance1.wrappedObj.visualValue.obj = window[instance1.wrappedObj.visualValue.obj];
  }
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
      visibility : loadedInstances?.find( cd => cd.metadata?.Id === i.getId())?.visibleMesh,
      color : instances?.find( cd => cd.metadata?.Id === i.getId())?.color
    }
  ))
}

/**
     * Add a 3D plane to the scene at the given coordinates (4) points.
     * It could be any geometry really.
     */
export const add3DPlane = (params) => {  
  let geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3(params.data.vert1[0], params.data.vert1[1], params.data.vert1[2]),// vertex0
    new THREE.Vector3(params.data.vert2[0], params.data.vert2[1], params.data.vert2[2]),// 1
    new THREE.Vector3(params.data.vert3[0], params.data.vert3[1], params.data.vert3[2]),// 2
    new THREE.Vector3(params.data.vert4[0], params.data.vert4[1], params.data.vert4[2])// 3
  );
  geometry.faces.push(
    new THREE.Face3(2, 1, 0),// use vertices of rank 2,1,0
    new THREE.Face3(3, 1, 2)// vertices[3],1,2...
  );
  geometry.computeBoundingBox();
  console.log("Vertices ", geometry)
  let max = geometry.boundingBox.max,
    min = geometry.boundingBox.min;
  let offset = new THREE.Vector2(0 - min.x, 0 - min.y);
  let range = new THREE.Vector2(max.x - min.x, max.y - min.y);
  let faces = geometry.faces;

  geometry.faceVertexUvs[0] = [];

  for (let i = 0; i < faces.length; i++) {

    var v1 = geometry.vertices[faces[i].a],
      v2 = geometry.vertices[faces[i].b],
      v3 = geometry.vertices[faces[i].c];

    geometry.faceVertexUvs[0].push([
      new THREE.Vector2((v1.x + offset.x) / range.x, (v1.y + offset.y) / range.y),
      new THREE.Vector2((v2.x + offset.x) / range.x, (v2.y + offset.y) / range.y),
      new THREE.Vector2((v3.x + offset.x) / range.x, (v3.y + offset.y) / range.y)
    ]);
  }
  geometry.uvsNeedUpdate = true;
  geometry.dynamic = true;

  let material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
  material.name = params.id;
  material.nowireframe = true;
  if (params.textureURL != undefined) {
    let loader = new THREE.TextureLoader();
    // load a resource
    loader.load(
      // resource URL
      params.textureURL,
      // Function when resource is loaded
      (texture) => {
        // texture.minFilter = THREE.LinearFilter;
        material.map = texture;
        texture.flipY = false;
        material.opacity = 0.3;
        material.transparent = true;
        material.needsUpdate = true;

      },
      // Function called when download progresses
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      // Function called when download errors
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded - An error happened');
      }
    );

  } else {
    material.opacity = 0.3;
    material.transparent = true;
    material.color.setHex("0xb0b0b0");
  }

  let mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = 1;
  mesh.clickThrough = true;
  return mesh;
}

/**
 * Modify the coordinates (4) points of an existing plane.
 */
export const modify3DPlane = (object, params) => {
  if ( object?.geometry ){
    if ( params.visible ) {
      object.visible = true;
      object.geometry.vertices[0].set(params.data.vert1[0], params.data.vert1[1], params.data.vert1[2]);
      object.geometry.vertices[1].set(params.data.vert2[0], params.data.vert2[1], params.data.vert2[2]);
      object.geometry.vertices[2].set(params.data.vert3[0], params.data.vert3[1], params.data.vert3[2]);
      object.geometry.vertices[3].set(params.data.vert4[0], params.data.vert4[1], params.data.vert4[2]);
    } else {
      object.visible = false;
    }
    object.geometry.verticesNeedUpdate = true;
    object.geometry.dynamic = true;
  }
  return object;
}
