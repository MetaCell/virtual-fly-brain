import { KNOWN_NG_VIEWS, NG_DEFAULT_LAYOUT, NG_DEFAULT_MOBILE_LAYOUT } from './constants';

// ─── Coordinate space shared by all VFB instances ────────────────────────────
const SHARED_VIEWPORT = {
  dimensions: [
    { name: 'x', scale: [1e-9, 'm'] },
    { name: 'y', scale: [5.189161e-10, 'm'] },
    { name: 'z', scale: [5.189161e-10, 'm'] },
  ],
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

function buildNeuroglassLayerUrl(protocol, baseUrl, instanceId) {
  const path = instanceId;
  if (protocol === 'neuroglancer-precomputed' || protocol === 'n5') {
    // GCS / S3 require Neuroglancer's pipe notation
    return `${baseUrl}/${path}/|${protocol}:`;
  }
  // HTTP fileservers use a precomputed:// prefix
  return `precomputed://${baseUrl}/${path}`;
}

// Datasource configuration for Datasource
export const NEUROGLASS_DATASOURCE = {
  protocol: import.meta.env.NEUROGLASS_DATA_PROTOCOL,
  baseUrl: import.meta.env.NEUROGLASS_DATA_BASE_URL,
  buildUrl(instanceId) {
    return buildNeuroglassLayerUrl(
      NEUROGLASS_DATASOURCE.protocol,
      NEUROGLASS_DATASOURCE.baseUrl,
      instanceId,
    );
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

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function toHexByte(value) {
  const v = clamp(Math.round(value), 0, 255);
  return v.toString(16).padStart(2, '0');
}

function colorToHex(color = {}) {
  let { r = 255, g = 255, b = 255 } = color;

  // If RGB values look normalized (0–1), convert to 0–255.
  if (r <= 1 && g <= 1 && b <= 1) {
    r *= 255;
    g *= 255;
    b *= 255;
  }

  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`;
}

function alphaToOpacity(a = 1) {
  if (a == null) return 1;

  // If alpha looks like 0–255, normalize it.
  if (a > 1) return clamp(a / 255, 0, 1);

  // Otherwise assume already normalized 0–1.
  return clamp(a, 0, 1);
}

function normalizeContrast(inst) {
  const contrast = inst?.contrast;

  if (
    contrast &&
    typeof contrast === 'object' &&
    Array.isArray(contrast.range) &&
    contrast.range.length === 2
  ) {
    return contrast;
  }

  if (Array.isArray(contrast) && contrast.length === 2) {
    return { range: contrast };
  }

  return { range: [0, 123] };
}

// Per-instance layer builder: converts a VFB instance into a Neuroglancer layer config.
function buildSingleInstanceLayer(inst) {
  const layer = {
    type: 'image',
    source: NEUROGLASS_DATASOURCE.buildUrl(inst.metadata.Id),
    tab: 'rendering',
    opacity: alphaToOpacity(inst.color?.a),
    blend: 'additive',
    shader: LAYER_SHADER,
    shaderControls: {
      contrast: normalizeContrast(inst),
      color: colorToHex(inst.color),
    },
    volumeRenderingDepthSamples: 256,
    name: inst.metadata.Id,
  };

  // If the instance has visibleMesh set to false, hide the layer.
  if (inst.visibleMesh === false) layer.visible = false;

  return layer;
}

// Main state builder: converts loaded VFB instances + UI state into a Neuroglass viewer state object.
export function buildNeuroglassState(allLoadedInstances, focusedInstanceId, layout) {
  const instances = allLoadedInstances || [];
  const layers = instances
    .filter(inst => inst?.metadata?.Id)
    .map(inst => buildSingleInstanceLayer(inst));

  if (layers.length === 0) return null;

  const selectedLayerName =
    focusedInstanceId && layers.some(layer => layer.name === focusedInstanceId)
      ? focusedInstanceId
      : layers[0].name;

  return {
    ...SHARED_VIEWPORT,
    layers,
    showSlices: false,
    selectedLayer: { visible: false, layer: selectedLayerName },
    layout: layout || NG_DEFAULT_LAYOUT,
    layerListPanel: { visible: false },
  };
}