const SHARED_VIEWPORT = {
  dimensions: {
    x: [1e-9, 'm'],
    y: [5.189161e-10, 'm'],
    z: [5.189161e-10, 'm'],
  },
  relativeDisplayScales: { x: 2, y: 2, z: 2 },
  position: [87.5, 280.5, 605.5],
  crossSectionScale: 0.5,
  projectionOrientation: [
    0.03356223925948143,
    -0.7611185908317566,
    -0.049303606152534485,
    -0.645864725112915,
  ],
  projectionScale: 1024,
};

const SHARED_LAYERS = [
  {
    type: 'image',
    source: 'gs://neuroglass/vfb/VFB_00101567_1567/|neuroglancer-precomputed:',
    tab: 'rendering',
    shader: '#uicontrol invlerp normalized\nvoid main() {\n  float val = toNormalized(getDataValue());\n  emitRGBA(vec4(val, val, val, val * 0.3));  // Grayscale with 30% opacity\n}\n\n',
    volumeRendering: 'on',
    renderingAccordion: { volumeRenderingExpanded: true },
    name: 'VFB_00101567_1567',
  },
  {
    type: 'image',
    source: 'gs://neuroglass/vfb/VFB_00101567_12vj/|neuroglancer-precomputed:',
    tab: 'rendering',
    shader: '#uicontrol invlerp normalized\nvoid main() {\n  float val = toNormalized(getDataValue());\n  emitRGB(vec3(0.0, val, 0.0));  // Green\n}',
    volumeRendering: 'on',
    volumeRenderingDepthSamples: 90.50966799187809,
    renderingAccordion: { volumeRenderingExpanded: true },
    name: 'VFB_00101567_12vj',
  },
  {
    type: 'image',
    source: 'gs://neuroglass/vfb/VFB_00101567/|neuroglancer-precomputed:',
    tab: 'source',
    shader: '#uicontrol invlerp normalized\nvoid main() {\n  float val = toNormalized(getDataValue());\n  emitRGB(vec3(val, 0.0, val));  // Magenta\n}\n',
    volumeRendering: 'on',
    volumeRenderingDepthSamples: 90.50966799187809,
    renderingAccordion: { volumeRenderingExpanded: true },
    name: 'VFB_00101567_101b',
  },
];

const createNeuroglassState = (selectedLayerId) => ({
  ...SHARED_VIEWPORT,
  layers: SHARED_LAYERS,
  showSlices: false,
  selectedLayer: { visible: false, layer: selectedLayerId },
  layout: '4panel-alt',
  layerListPanel: { visible: false },
});

export const NEUROGLASS_STATE_VFB_00101567 = createNeuroglassState('VFB_00101567_1567');

export const NEUROGLASS_STATE_VFB_0010101b = createNeuroglassState('VFB_00101567_101b');

export const NEUROGLASS_STATE_VFB_001012vj = createNeuroglassState('VFB_00101567_12vj');

export const NEUROGLASS_STATES_MAP = {
  'VFB_00101567': NEUROGLASS_STATE_VFB_00101567,
  'VFB_0010101b': NEUROGLASS_STATE_VFB_0010101b,
  'VFB_001012vj': NEUROGLASS_STATE_VFB_001012vj,
};

export const SUPPORTED_NEUROGLASS_INSTANCES = Object.freeze([
  'VFB_00101567',
  'VFB_0010101b',
  'VFB_001012vj',
]);

const validateInstanceId = (instanceId) => {
  if (typeof instanceId !== 'string') {
    return { valid: false, error: `Expected string, got ${typeof instanceId}` };
  }
  if (!/^VFB_[A-Za-z0-9]+$/.test(instanceId)) {
    return { valid: false, error: `Invalid VFB ID format: ${instanceId}` };
  }
  return { valid: true };
};

export const getNeuroglassState = (instanceId) => {
  const validation = validateInstanceId(instanceId);
  if (!validation.valid) {
    console.error(`[Neuroglass] ${validation.error}`);
    return null;
  }
  const state = NEUROGLASS_STATES_MAP[instanceId];
  if (!state) console.warn(`[Neuroglass] No state for instance: ${instanceId}`);
  return state || null;
};

export const hasNeuroglassState = (instanceId) => {
  const validation = validateInstanceId(instanceId);
  if (!validation.valid) return false;
  return Object.prototype.hasOwnProperty.call(NEUROGLASS_STATES_MAP, instanceId);
};

export const isNeuroglassSupportedInstance = (instanceId) => {
  const validation = validateInstanceId(instanceId);
  if (!validation.valid) return false;
  return SUPPORTED_NEUROGLASS_INSTANCES.includes(instanceId);
};

export const NEUROGLASS_CONFIG = {
  instances: SUPPORTED_NEUROGLASS_INSTANCES,
  layers: SHARED_LAYERS,
  viewport: SHARED_VIEWPORT,
};
