import { KNOWN_NG_VIEWS, NG_DEFAULT_LAYOUT, NG_DEFAULT_MOBILE_LAYOUT } from './constants';

// ─── Coordinate space shared by all VFB instances ────────────────────────────
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

// Datasource configuration for Datasource
export const NEUROGLASS_DATASOURCE = {
  protocol: import.meta.env.VITE_NEUROGLASS_DATA_PROTOCOL || 'neuroglancer-precomputed',
  baseUrl: import.meta.env.VITE_NEUROGLASS_DATA_BASE_URL || 'gs://neuroglass/vfb',
  buildUrl(instanceId) {
    const path = instanceId;
    if (this.protocol === 'neuroglancer-precomputed' || this.protocol === 'n5') {
      // GCS / S3 reqire Neuroglancer's pipe notation
      return `${this.baseUrl}/${path}/|${this.protocol}:`;
    }
    // HTTP fileservers use a precomputed:// prefix
    return `precomputed://${this.baseUrl}/${path}`;
  },
};

// Fixed GLSL shader template : Only shaderControls.color and layer.opacity change per instance.
export const LAYER_SHADER = [
  '#uicontrol invlerp contrast',
  '#uicontrol vec3 color color',
  'void main() {',
  '  float contrast_value = contrast();',
  '  if (VOLUME_RENDERING) {',
  '    emitRGBA(vec4(color * contrast_value, contrast_value));',
  '  }',
  '  else {',
  '    emitRGB(color * contrast_value);',
  '  }',
  '}',
].join('\n');

// Layout resolver : mobile (< 1200 px) → '3d', desktop → '4panel-alt'.
export function resolveNeuroglassLayout(userPref, isMobile) {
  if (userPref && KNOWN_NG_VIEWS.includes(userPref)) return userPref;
  return isMobile ? NG_DEFAULT_MOBILE_LAYOUT : NG_DEFAULT_LAYOUT;
}

// Per-instance layer builder: Converts a VFB instance into a Neuroglancer layer config.
function buildSingleInstanceLayer(inst) {
  const { r = 1, g = 1, b = 1, a = 1 } = inst.color || {};
  const layer = {
    type: 'image',
    source: NEUROGLASS_DATASOURCE.buildUrl(inst.metadata.Id),
    tab: 'rendering',
    opacity: a,
    blend: 'additive',
    shader: LAYER_SHADER,
    shaderControls: { color: [r, g, b] },
    volumeRenderingDepthSamples: 256,
    name: inst.metadata.Id,
  };
  if (inst.visibleMesh === false) layer.visible = false;
  return layer;
}

// Main state builder: Converts all loaded VFB instances + UI state into a Neuroglass viewer state object.
export function buildNeuroglassState(allLoadedInstances, focusedInstanceId, layout) {
  const instances = allLoadedInstances || [];
  // Only render instances whose data exists in the VFB datasource.
  const layers = instances
    .filter(inst => inst?.metadata?.Id)
    .map(inst => buildSingleInstanceLayer(inst));

  if (layers.length === 0) return null;

  return {
    ...SHARED_VIEWPORT,
    layers,
    showSlices: false,
    selectedLayer: { visible: false, layer: focusedInstanceId || layers[0].name },
    layout: layout || NG_DEFAULT_LAYOUT,
    layerListPanel: { visible: false },
  };
}

