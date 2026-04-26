import { KNOWN_NG_VIEWS, NG_DEFAULT_LAYOUT, NG_DEFAULT_MOBILE_LAYOUT } from './constants';

const DEFAULT_CONTRAST_RANGE = [0, 123];

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

export const NEUROGLASS_DATASOURCE = {
  protocol: import.meta.env.NEUROGLASS_DATA_PROTOCOL,
  baseUrl: import.meta.env.NEUROGLASS_DATA_BASE_URL,
  async buildUrl(instanceId) {
    let instancePath = instanceId.replace(
      /^VFB_(\d{4})([a-zA-Z0-9]+)$/i,
      "VFB/i/$1/$2/"
    );
    const layerURL = await buildNeuroglassLayerUrl(
      this.protocol,
      this.baseUrl,
      instancePath,
    );
    console.log(`[NEUROGLASS_DATASOURCE] Built URL for instance ${instanceId}: ${layerURL}`);
    return layerURL;
  },
};

async function buildNeuroglassLayerUrl(protocol, baseUrl, instanceId) {
  let path = instanceId;

  // Check if the protocol is 'neuroglancer-precomputed' or 'n5'
  if (protocol === 'neuroglancer-precomputed') {
    const url = `${baseUrl}/${path}`;
    try {
      // Fetch the folder contents of the URL
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${url}`);
      }

      // Check if the response is HTML
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('text/html')) {
        // Parse the HTML response
        const html = await response.text();
        const folderNames = extractFolderNamesFromHtml(html);

        // Find the folder starting with VFB_
        const vfbFolder = folderNames.find((name) => name.startsWith('VFB_'));

        if (vfbFolder) {
          // Check if the VFB_ folder contains a 'neuroglancer' folder
          const vfbFolderUrl = `${url}/${vfbFolder}`;
          const vfbResponse = await fetch(vfbFolderUrl);
          if (!vfbResponse.ok) {
            throw new Error(`Failed to fetch VFB folder: ${vfbFolderUrl}`);
          }

          const vfbHtml = await vfbResponse.text();
          const vfbFolderNames = extractFolderNamesFromHtml(vfbHtml);
          const neuroglancerFolder = vfbFolderNames.find(
            (name) => name === 'neuroglancer/'
          );

          if (neuroglancerFolder) {
            return `${vfbFolderUrl}/${neuroglancerFolder}|${protocol}:`;
          }
        }
      } else {
        throw new Error(`Unexpected Content-Type: ${contentType}`);
      }
    } catch (error) {
      console.error(`[buildNeuroglassLayerUrl] Error: ${error.message}`);
    }
  } else if (protocol === 'gs' || protocol === 'n5') {
    return `${baseUrl}/${path}/|${protocol}:`;
  }

  return `precomputed://${baseUrl}/${path}`;
}

function extractFolderNamesFromHtml(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const links = doc.querySelectorAll('a'); // Select all <a> tags
  const folderNames = Array.from(links)
    .map((link) => link.textContent.trim()) // Extract text content
    .filter((name) => name && !name.startsWith('..')); // Exclude parent directory links
  return folderNames;
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

  const layer = {
    type: 'image',
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
    name: inst.metadata.Id,
  };

  console.log(`[buildSingleInstanceLayer] Built layer for instance ${inst.metadata.Id}:`, layer);

  if (inst.visibleMesh === false) layer.visible = false;

  return layer;
}
// Main state builder: converts loaded VFB instances + UI state into a Neuroglass viewer state object.
export function buildNeuroglassState(allLoadedInstances, focusedInstanceId, layout) {
  const instances = allLoadedInstances || [];
  const layers = instances
    .filter(inst => {
      if (!inst?.metadata?.Id) {
        console.warn(`[buildNeuroglassState] Instance missing metadata ID:`, inst);
        return false;
      }
      return true;
    })
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