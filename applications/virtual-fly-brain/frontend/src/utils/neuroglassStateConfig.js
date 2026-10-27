import { KNOWN_NG_VIEWS, NG_DEFAULT_LAYOUT, NG_DEFAULT_MOBILE_LAYOUT } from './constants';

const DEFAULT_CONTRAST_RANGE = [0, 123];
const neuroglassLayerUrlCache = new Map();

// ─── Coordinate space shared by all VFB instances ────────────────────────────
// The precomputed datasets are X, Y, Z with resolution and mesh vertices in
// nanometres (the precomputed spec's unit; the pipeline converts VFB's micron
// sources), so the shared space is 1 nm per unit on every axis and positions are
// in nm. JRC2018U is 1210 x 566 x 174 voxels of 0.519 x 0.519 x 1.0 um, so its
// centre is (314, 147, 87) um. Identity orientation = the anterior view (x right,
// y down), which is how VFB shows the brain.
const SHARED_VIEWPORT = {
  dimensions: [
    { name: 'x', scale: [1e-9, 'm'] },
    { name: 'y', scale: [1e-9, 'm'] },
    { name: 'z', scale: [1e-9, 'm'] },
  ],
  position: [314000, 147000, 87000],
  crossSectionScale: 500,
  projectionOrientation: [0, 0, 0, 1],
  projectionScale: 700000,
};

// Each image folder holds one precomputed.zip (info, chunks, mesh/) that
// Neuroglancer reads through its zip kvstore via HTTP Range requests:
//   https://host/data/VFB/i/0010/1567/VFB_00101567/precomputed.zip|zip:|neuroglancer-precomputed:
const PRECOMPUTED_ZIP = 'precomputed.zip';

export const NEUROGLASS_DATASOURCE = {
  protocol: import.meta.env.NEUROGLASS_DATA_PROTOCOL,
  baseUrl: import.meta.env.NEUROGLASS_DATA_BASE_URL,
  async buildUrl(instanceId) {
    if (neuroglassLayerUrlCache.has(instanceId)) {
      return neuroglassLayerUrlCache.get(instanceId);
    }
  
    let instancePath = instanceId.replace(
      /^VFB_(\d{4})([a-zA-Z0-9]+)$/i,
      'VFB/i/$1/$2/'
    );
  
    const layerURLPromise = buildNeuroglassLayerUrl(
      this.protocol,
      this.baseUrl,
      instancePath
    );
  
    neuroglassLayerUrlCache.set(instanceId, layerURLPromise);
  
    try {
      const layerURL = await layerURLPromise;
      neuroglassLayerUrlCache.set(instanceId, layerURL);
      return layerURL;
    } catch (error) {
      neuroglassLayerUrlCache.delete(instanceId);
      throw error;
    }
  }
};

function isObjectStoreUrl(baseUrl = '') {
  return baseUrl.startsWith('gs://') || baseUrl.startsWith('s3://');
}

function isHttpUrl(baseUrl = '') {
  return baseUrl.startsWith('http://') || baseUrl.startsWith('https://');
}

// Default template folder for an instance: the KB knows which template(s) an
// image is registered to; until that is wired through, JRC2018U is the one
// every brain image in VFB3 is shown on.
const DEFAULT_TEMPLATE_ID = 'VFB_00101567';

async function buildNeuroglassLayerUrl(protocol, baseUrl, instancePath, templateId = DEFAULT_TEMPLATE_ID) {
  if (protocol === 'neuroglancer-precomputed') {
    if (isObjectStoreUrl(baseUrl)) {
      return `${baseUrl}/${instancePath}/|${protocol}:`;
    }
    if (isHttpUrl(baseUrl)) {
      // No directory listing round-trips: the layout is fixed, one zip per image folder.
      return `${baseUrl}/${instancePath}${templateId}/${PRECOMPUTED_ZIP}|zip:|${protocol}:`;
    }
    return `${baseUrl}/${instancePath}/|${protocol}:`;
  }

  if (protocol === 'gs' || protocol === 'n5') {
    return `${baseUrl}/${instancePath}/|${protocol}:`;
  }
}

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

  return { range: DEFAULT_CONTRAST_RANGE };
}

// Per-instance layer builder: converts a VFB instance into a Neuroglancer layer config.
async function buildSingleInstanceLayer(inst) {
  const source = await NEUROGLASS_DATASOURCE.buildUrl(inst.metadata.Id);

  // The pipeline writes templates and expression patterns as image layers
  // (intensities) and neurons/clones/domains as segmentation layers (segment 1
  // + mesh). 'auto' lets Neuroglancer pick the layer type from the source's
  // info; the image-only fields are ignored on a segmentation and vice versa.
  const layer = {
    type: 'auto',
    source: source,
    tab: 'rendering',
    opacity: alphaToOpacity(inst.color?.a),
    blend: 'additive',
    shader: LAYER_SHADER,
    shaderControls: {
      contrast: normalizeContrast(inst),
      color: colorToHex(inst.color),
    },
    volumeRenderingDepthSamples: 256,
    volumeRendering: 'on',
    // segmentation layers: show the one segment, in the instance colour
    segments: ['1'],
    segmentDefaultColor: colorToHex(inst.color),
    name: inst.metadata.Id,
  };

  if (inst.visibleMesh === false) layer.visible = false;

  return layer;
}

export async function buildNeuroglassState(allLoadedInstances, focusedInstanceId, layout) {
  const instances = allLoadedInstances || [];

  const layers = await Promise.all(
    instances
      .filter(inst => {
        if (!inst?.metadata?.Id) {
          console.warn(`[buildNeuroglassState] Instance missing metadata ID:`, inst);
          return false;
        }
        return true;
      })
      .map(inst => buildSingleInstanceLayer(inst))
  );

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