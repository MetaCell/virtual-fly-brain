/**
 * Neuroglancer State Mapper
 * 
 * Converts between VFB's Redux state and Neuroglancer state schema
 * compatible with Neuroglass storage format.
 */

/**
 * Convert VFB Redux state to Neuroglancer state schema
 * @param {Object} vfbState - Full Redux state from VFB
 * @returns {Object} Neuroglancer state object
 */
export const vfbToNeuroglancerState = (vfbState) => {
  const { instances, globalInfo } = vfbState;
  const { allLoadedInstances, launchTemplate, focusedInstance } = instances;

  // Convert VFB instances to Neuroglancer layers
  const layers = [];

  // Add template as base layer if it exists
  if (launchTemplate) {
    layers.push({
      type: 'segmentation',
      source: `precomputed://https://neuroglass.metacell.us/datasets/${launchTemplate.metadata?.Id}`,
      tab: 'source',
      name: launchTemplate.metadata?.Label || 'Template',
      visible: true,
      opacity: 0.5,
    });
  }

  // Add all loaded instances as layers
  allLoadedInstances?.forEach((instance) => {
    const isFocused = focusedInstance?.metadata?.Id === instance.metadata?.Id;
    
    layers.push({
      type: 'segmentation',
      source: `precomputed://https://neuroglass.metacell.us/datasets/${instance.metadata?.Id}`,
      tab: 'segments',
      name: instance.metadata?.Label || instance.metadata?.Id,
      visible: true,
      segments: [instance.metadata?.Id],
      segmentColors: {
        [instance.metadata?.Id]: instance.color || '#ffffff',
      },
      // Highlight focused instance
      ...(isFocused && {
        selectedSegment: instance.metadata?.Id,
      }),
    });
  });

  // Build navigation/camera state
  const navigation = {
    pose: {
      position: {
        voxelSize: [1.0, 0.5189161, 0.5189161], // VFB default from precomputed data
        voxelCoordinates: [87, 283, 605], // Center of typical fly brain
      },
    },
    zoomFactor: 8,
  };

  // Build complete Neuroglancer state
  return {
    dimensions: {
      x: [1e-9, 'm'],
      y: [1e-9, 'm'],
      z: [1e-9, 'm'],
    },
    position: [87000, 283000, 605000],
    crossSectionOrientation: [0, 0, 0, 1],
    crossSectionScale: 1,
    projectionOrientation: [0, 0, 0, 1],
    projectionScale: 16384,
    layers,
    selectedLayer: {
      visible: true,
      layer: focusedInstance?.metadata?.Label || layers[0]?.name,
    },
    layout: '4panel',
  };
};

/**
 * Convert Neuroglancer state to VFB-compatible format
 * Note: This is a partial conversion for loading studies back into VFB
 * @param {Object} ngState - Neuroglancer state object
 * @returns {Object} VFB-compatible state updates
 */
export const neuroglancerToVFBState = (ngState) => {
  const { layers, selectedLayer } = ngState;

  // Extract instance IDs from Neuroglancer layers
  const instanceIds = layers
    ?.filter((layer) => layer.type === 'segmentation')
    ?.map((layer) => {
      // Try to extract VFB ID from source URL
      const match = layer.source?.match(/\/datasets\/([A-Z]+_\d+)/);
      return match ? match[1] : null;
    })
    .filter(Boolean);

  // Determine focused instance from selectedLayer
  const focusedLayerName = selectedLayer?.layer;
  const focusedLayer = layers?.find((layer) => layer.name === focusedLayerName);
  const focusedId = focusedLayer?.source?.match(/\/datasets\/([A-Z]+_\d+)/)?.[1];

  return {
    instanceIds,
    focusedId,
    // Camera/navigation state could be extracted from ngState.position, etc.
  };
};

/**
 * Create a minimal Neuroglancer state for a single VFB instance
 * Useful for quick sharing or bookmarking
 * @param {Object} instance - VFB instance object
 * @returns {Object} Minimal Neuroglancer state
 */
export const instanceToNeuroglancerState = (instance) => {
  return {
    layers: [
      {
        type: 'segmentation',
        source: `precomputed://https://neuroglass.metacell.us/datasets/${instance.metadata?.Id}`,
        name: instance.metadata?.Label || instance.metadata?.Id,
        segments: [instance.metadata?.Id],
      },
    ],
    layout: 'xy',
  };
};

export default {
  vfbToNeuroglancerState,
  neuroglancerToVFBState,
  instanceToNeuroglancerState,
};
