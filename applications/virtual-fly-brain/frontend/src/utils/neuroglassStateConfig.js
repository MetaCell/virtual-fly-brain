/**
 * Neuroglass state for VFB_00101567 (Template)
 * Shows all 3 layers with VFB_00101567_1567 selected
 * 
 * Source: gs://neuroglass/vfb/VFB_00101567_1567/
 */
export const NEUROGLASS_STATE_VFB_00101567 = {
  dimensions: {
    x: [1e-9, 'm'],
    y: [5.189161e-10, 'm'],
    z: [5.189161e-10, 'm'],
  },
  relativeDisplayScales: {
    x: 2,
    y: 2,
    z: 2,
  },
  position: [87.5, 280.5, 605.5],
  crossSectionScale: 0.5,
  projectionOrientation: [
    0.03356223925948143,
    -0.7611185908317566,
    -0.049303606152534485,
    -0.645864725112915,
  ],
  projectionScale: 1024,
  layers: [
    {
      type: 'image',
      source: 'gs://neuroglass/vfb/VFB_00101567_1567/|neuroglancer-precomputed:',
      tab: 'rendering',
      shader: '#uicontrol invlerp normalized\nvoid main() {\n  float val = toNormalized(getDataValue());\n  emitRGBA(vec4(val, val, val, val * 0.3));  // Grayscale with 30% opacity\n}\n\n',
      volumeRendering: 'on',
      renderingAccordion: {
        volumeRenderingExpanded: true,
      },
      name: 'VFB_00101567_1567',
    },
    {
      type: 'image',
      source: 'gs://neuroglass/vfb/VFB_00101567_12vj/|neuroglancer-precomputed:',
      tab: 'rendering',
      shader: '#uicontrol invlerp normalized\nvoid main() {\n  float val = toNormalized(getDataValue());\n  emitRGB(vec3(0.0, val, 0.0));  // Green\n}',
      volumeRendering: 'on',
      volumeRenderingDepthSamples: 90.50966799187809,
      renderingAccordion: {
        volumeRenderingExpanded: true,
      },
      name: 'VFB_00101567_12vj',
    },
    {
      type: 'image',
      source: 'gs://neuroglass/vfb/VFB_00101567/|neuroglancer-precomputed:',
      tab: 'source',
      shader: '#uicontrol invlerp normalized\nvoid main() {\n  float val = toNormalized(getDataValue());\n  emitRGB(vec3(val, 0.0, val));  // Magenta\n}\n',
      volumeRendering: 'on',
      volumeRenderingDepthSamples: 90.50966799187809,
      renderingAccordion: {
        volumeRenderingExpanded: true,
      },
      name: 'VFB_00101567_101b',
    },
  ],
  showSlices: false,
  selectedLayer: {
    visible: true,
    layer: 'VFB_00101567_1567',
  },
  layout: '4panel-alt',
  layerListPanel: {
    visible: true,
  },
};

/**
 * Neuroglass state for VFB_0010101b (Instance)
 * Shows all 3 layers with VFB_00101567_101b selected
 * 
 * Source: gs://neuroglass/vfb/VFB_00101567_101b/
 */
export const NEUROGLASS_STATE_VFB_0010101b = {
  dimensions: {
    x: [1e-9, 'm'],
    y: [5.189161e-10, 'm'],
    z: [5.189161e-10, 'm'],
  },
  relativeDisplayScales: {
    x: 2,
    y: 2,
    z: 2,
  },
  position: [87.5, 280.5, 605.5],
  crossSectionScale: 0.5,
  projectionOrientation: [
    0.03356223925948143,
    -0.7611185908317566,
    -0.049303606152534485,
    -0.645864725112915,
  ],
  projectionScale: 1024,
  layers: [
    {
      type: 'image',
      source: 'gs://neuroglass/vfb/VFB_00101567_1567/|neuroglancer-precomputed:',
      tab: 'rendering',
      shader: '#uicontrol invlerp normalized\nvoid main() {\n  float val = toNormalized(getDataValue());\n  emitRGBA(vec4(val, val, val, val * 0.3));  // Grayscale with 30% opacity\n}\n\n',
      volumeRendering: 'on',
      renderingAccordion: {
        volumeRenderingExpanded: true,
      },
      name: 'VFB_00101567_1567',
    },
    {
      type: 'image',
      source: 'gs://neuroglass/vfb/VFB_00101567_12vj/|neuroglancer-precomputed:',
      tab: 'rendering',
      shader: '#uicontrol invlerp normalized\nvoid main() {\n  float val = toNormalized(getDataValue());\n  emitRGB(vec3(0.0, val, 0.0));  // Green\n}',
      volumeRendering: 'on',
      volumeRenderingDepthSamples: 90.50966799187809,
      renderingAccordion: {
        volumeRenderingExpanded: true,
      },
      name: 'VFB_00101567_12vj',
    },
    {
      type: 'image',
      source: 'gs://neuroglass/vfb/VFB_00101567/|neuroglancer-precomputed:',
      tab: 'source',
      shader: '#uicontrol invlerp normalized\nvoid main() {\n  float val = toNormalized(getDataValue());\n  emitRGB(vec3(val, 0.0, val));  // Magenta\n}\n',
      volumeRendering: 'on',
      volumeRenderingDepthSamples: 90.50966799187809,
      renderingAccordion: {
        volumeRenderingExpanded: true,
      },
      name: 'VFB_00101567_101b',
    },
  ],
  showSlices: false,
  selectedLayer: {
    visible: true,
    layer: 'VFB_00101567_101b',
  },
  layout: '4panel-alt',
  layerListPanel: {
    visible: true,
  },
};

/**
 * Neuroglass state for VFB_001012vj (Instance)
 * Shows all 3 layers with VFB_00101567_12vj selected
 * 
 * Source: gs://neuroglass/vfb/VFB_00101567_12vj/
 */
export const NEUROGLASS_STATE_VFB_001012vj = {
  dimensions: {
    x: [1e-9, 'm'],
    y: [5.189161e-10, 'm'],
    z: [5.189161e-10, 'm'],
  },
  relativeDisplayScales: {
    x: 2,
    y: 2,
    z: 2,
  },
  position: [87.5, 280.5, 605.5],
  crossSectionScale: 0.5,
  projectionOrientation: [
    0.03356223925948143,
    -0.7611185908317566,
    -0.049303606152534485,
    -0.645864725112915,
  ],
  projectionScale: 1024,
  layers: [
    {
      type: 'image',
      source: 'gs://neuroglass/vfb/VFB_00101567_1567/|neuroglancer-precomputed:',
      tab: 'rendering',
      shader: '#uicontrol invlerp normalized\nvoid main() {\n  float val = toNormalized(getDataValue());\n  emitRGBA(vec4(val, val, val, val * 0.3));  // Grayscale with 30% opacity\n}\n\n',
      volumeRendering: 'on',
      renderingAccordion: {
        volumeRenderingExpanded: true,
      },
      name: 'VFB_00101567_1567',
    },
    {
      type: 'image',
      source: 'gs://neuroglass/vfb/VFB_00101567_12vj/|neuroglancer-precomputed:',
      tab: 'rendering',
      shader: '#uicontrol invlerp normalized\nvoid main() {\n  float val = toNormalized(getDataValue());\n  emitRGB(vec3(0.0, val, 0.0));  // Green\n}',
      volumeRendering: 'on',
      volumeRenderingDepthSamples: 90.50966799187809,
      renderingAccordion: {
        volumeRenderingExpanded: true,
      },
      name: 'VFB_00101567_12vj',
    },
    {
      type: 'image',
      source: 'gs://neuroglass/vfb/VFB_00101567/|neuroglancer-precomputed:',
      tab: 'source',
      shader: '#uicontrol invlerp normalized\nvoid main() {\n  float val = toNormalized(getDataValue());\n  emitRGB(vec3(val, 0.0, val));  // Magenta\n}\n',
      volumeRendering: 'on',
      volumeRenderingDepthSamples: 90.50966799187809,
      renderingAccordion: {
        volumeRenderingExpanded: true,
      },
      name: 'VFB_00101567_101b',
    },
  ],
  showSlices: false,
  selectedLayer: {
    visible: true,
    layer: 'VFB_00101567_12vj',
  },
  layout: '4panel-alt',
  layerListPanel: {
    visible: true,
  },
};

/**
 * Map of instance IDs to their corresponding Neuroglass states
 * 
 * Usage:
 * const state = NEUROGLASS_STATES_MAP['VFB_00101567'];
 */
export const NEUROGLASS_STATES_MAP = {
  'VFB_00101567': NEUROGLASS_STATE_VFB_00101567,
  'VFB_0010101b': NEUROGLASS_STATE_VFB_0010101b,
  'VFB_001012vj': NEUROGLASS_STATE_VFB_001012vj,
};

/**
 * Get Neuroglass state for a specific VFB instance ID
 * 
 * @param {string} instanceId - VFB instance ID (e.g., 'VFB_00101567')
 * @returns {Object|null} Neuroglass viewer state or null if not found
 */
export const getNeuroglassState = (instanceId) => {
  return NEUROGLASS_STATES_MAP[instanceId] || null;
};

/**
 * Check if a state exists for the given instance ID
 * 
 * @param {string} instanceId - VFB instance ID
 * @returns {boolean} True if state exists for this instance
 */
export const hasNeuroglassState = (instanceId) => {
  return instanceId in NEUROGLASS_STATES_MAP;
};
