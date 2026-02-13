/**
 * Neuroglass State Mapper
 * 
 * Converts between VFB's Redux state and Neuroglass state schema
 * compatible with Neuroglass storage format.
 */

/**
 * Convert VFB Redux state to Neuroglass state schema
 * @param {Object} vfbState - Full Redux state from VFB
 * @returns {Object} Neuroglass state object
 */
export const vfbToNeuroglassState = (vfbState) => {
  const { instances, _globalInfo } = vfbState;
  const { allLoadedInstances, launchTemplate, focusedInstance } = instances;

  // Convert VFB instances to Neuroglass layers
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
  const _navigation = {
    pose: {
      position: {
        voxelSize: [1.0, 0.5189161, 0.5189161], // VFB default from precomputed data
        voxelCoordinates: [87, 283, 605], // Center of typical fly brain
      },
    },
    zoomFactor: 8,
  };

  // Build complete Neuroglass state
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
 * Convert Neuroglass state to VFB-compatible format
 * Note: This is a partial conversion for loading studies back into VFB
 * @param {Object} neuroglassState - Neuroglass state object
 * @returns {Object} VFB-compatible state updates
 */
export const neuroglassToVFBState = (neuroglassState) => {
  const { layers, selectedLayer } = neuroglassState;

  // Extract instance IDs from Neuroglass layers
  const instanceIds = layers
    ?.filter((layer) => layer.type === 'segmentation')
    ?.map((layer) => {
      // Try to extract VFB ID from source URL
      const match = layer.source?.match(/\/datasets\/([A-Z]+_[A-Za-z0-9]+)/);
      return match ? match[1] : null;
    })
    .filter(Boolean);

  // Determine focused instance from selectedLayer
  const focusedLayerName = selectedLayer?.layer;
  const focusedLayer = layers?.find((layer) => layer.name === focusedLayerName);
  const focusedId = focusedLayer?.source?.match(/\/datasets\/([A-Z]+_[A-Za-z0-9]+)/)?.[1];

  return {
    instanceIds,
    focusedId,
    // Camera/navigation state could be extracted from neuroglassState.position, etc.
  };
};

/**
 * Create a minimal Neuroglass state for a single VFB instance
 * Useful for quick sharing or bookmarking
 * @param {Object} instance - VFB instance object
 * @returns {Object} Minimal Neuroglass state
 */
export const instanceToNeuroglassState = (instance) => {
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
  vfbToNeuroglassState,
  neuroglassToVFBState,
  instanceToNeuroglassState,
};
