## Contents

1. [URL Parameter for Neuroglass Layout](#requirement--url-parameter-for-neuroglass-layout-layout)
2. [Responsive Layout — Mobile vs Desktop](#requirement--responsive-layout-mobile-vs-desktop)
3. [Layer Sync from VFBListViewer Actions](#requirement--layer-sync-from-vfblistviewer-actions)
4. [Configurable Datasource](#requirement--configurable-datasource)
5. [Redux State Architecture](#redux-state-architecture)

---

## Requirement — URL Parameter for Neuroglass Layout (`layout`)

Add a param in the URL to handle the NG widget view (1 VS 4 quadrants). Neuroglass handles this with the layout query parameter, the following proposal uses the same name ‘layout’ as query parameter in VFB URL. `?id=VFB_001012vj&layout=3d` — the `layout` parameter sets the Neuroglancer layout. Must survive page refresh and be shareable.

<img width="6926" height="1504" alt="image" src="https://github.com/user-attachments/assets/97c3652e-6d5a-4af9-8cf7-64783f419d85" />

### 3 Scenarios → Neuroglancer Layout Values

Possible Scenarios for Layout:

| Scenario | `layout` value(s) | Neuroglancer layout | Notes |
|---|---|---|---|
| **All quadrants** | `4panel-alt` *(default)*, `4panel` | `"4panel-alt"`, `"4panel"` | XY + XZ + YZ + 3D panels |
| **One panel fullscreen** | `3d`, `xy`, `xz`, `yz` | `"3d"`, `"xy"`, `"xz"`, `"yz"` | Single panel; `3d` = volumetric, others = slice |
| **Slice + volumetric side-by-side** | `xy-3d`, `xz-3d`, `yz-3d` | `"xy-3d"`, `"xz-3d"`, `"yz-3d"` | Which slice is not fixed — all three variants accepted |
| *(omitted)* | *(no param)* | `"4panel-alt"` | Desktop default fallback |

### Files Changes Needed

| File | What changes |
|---|---|
| `applications/virtual-fly-brain/frontend/src/reducers/actions/types/GlobalTypes.js` | Add `SET_NEUROGLASS_VIEW` constant |
| `applications/virtual-fly-brain/frontend/src/reducers/actions/globals.js` | Add `setNeuroglassView(view)` action creator |
| `applications/virtual-fly-brain/frontend/src/reducers/GlobalReducer.js` | Add `neuroglassView: null` field + case handler |
| `applications/virtual-fly-brain/frontend/src/reducers/middleware/urlUpdaterMiddleware.js` | Read `layout` on first load; write on `SET_NEUROGLASS_VIEW` |
| `applications/virtual-fly-brain/frontend/src/utils/neuroglassStateConfig.js` | Add `VALID_NG_VIEWS` array + `resolveNeuroglassLayout()` |
| `applications/virtual-fly-brain/frontend/src/components/NeuroglassViewer.jsx` | Read `neuroglassView` from Redux, pass to `resolveNeuroglassLayout` |


---

## Requirement — Responsive Layout (Mobile vs Desktop)

On small screens (mobile), default to `"3d"` layout. On desktop, default to `"4panel-alt"`. A user-provided `layout` param always overrides the responsive default.
When VFB switches to mobile layout mode, the Neuroglass widget simultaneously switches to fullscreen `'3d'` — the two states are always in sync.
The user's explicit `?layout=` param always wins over the responsive default.

### Files Changed

| File | What changes |
|---|---|
| `applications/virtual-fly-brain/frontend/src/utils/neuroglassStateConfig.js` | `resolveNeuroglassLayout(userPref, isMobile)` function |
| `applications/virtual-fly-brain/frontend/src/components/NeuroglassViewer.jsx` | `const isMobile = !useMediaQuery(theme.breakpoints.up('lg'))` (1200px) + call `resolveNeuroglassLayout` |

---

## Requirement — Layer Sync from VFBListViewer Actions

This [FigJam](https://www.figma.com/board/wChto0YkFbMyoPNmXoRn8Y/VFB-Neuroglass-Synchrinozation?node-id=4-328&t=fQ8YdeWz2JKfFWP5-0) below is the flow proposed for VFBListViewer to Neuroglass synchronization actions. NO changes are needed on the Redux state, or middleware. NeuroglassViewer component already responds to allLoadedInstances in global state. To prevent iframe re-rendering multiple times when multiple actions are triggered from VFBListViewer fast, e.g. color slider changes, a debouncer needs to be added in the NeuroglassViewer component to prevent iframe re-rendering on every change when not needed.

<img width="6628" height="3076" alt="image" src="https://github.com/user-attachments/assets/bf1e72de-fdd8-4c91-aeff-717000346d00" />


### How VFBListViewer Actions Reach the Iframe

`NeuroglassViewer.jsx` subscribes to `allLoadedInstances` via `useSelector`.

### Mapping VFB Instance State → Neuroglancer Layer

Each VFB instance in `allLoadedInstances` maps to exactly one Neuroglancer image layer:

| VFB Instance field | Neuroglancer layer field | Notes |
|---|---|---|
| `instance.metadata.Id` | `layer.name` | Unique layer identifier |
| `instance.visibleMesh` | `layer.visible` | `false` hides the layer; omitting = visible |
| `instance.color.{r,g,b}` | `layer.shaderControls.color` | `vec3` uniform `[r, g, b]` — passed via `shaderControls`, not baked into GLSL |
| `instance.color.a` | `layer.opacity` | Separate top-level field — not in the GLSL |
| *(instance removed)* | *(layer absent)* | Layer simply not included in `layers[]` |

**Which `ListViewerControlsMenu` actions map to which changes:**

| Menu action | Redux action type | Change in `allLoadedInstances` | Change in NG layer |
|---|---|---|---|
| Show | `SHOW_3D` | `visible=true, visibleMesh=true` | `layer.visible` omitted (defaults true) |
| Hide | `HIDE_3D` | `visible=false, visibleMesh=false` | `layer.visible = false` |
| Enable 3D Volume | `SHOW_3D_MESH` | `visibleMesh=true` | `layer.visible` omitted |
| Disable 3D Volume | `HIDE_3D_MESH` | `visibleMesh=false` | `layer.visible = false` |
| **Colour** | `CHANGE_COLOR` | `color = {r, g, b, a}` | `layer.shaderControls.color = [r, g, b]` — passed as `vec3` uniform |
| **Opacity** | `CHANGE_COLOR` *(same action)* | `color.a` updated | `layer.opacity = a` — **separate field**, not in GLSL |
| Delete | `REMOVE_INSTANCES_SUCCESS` | Instance removed from array | Layer absent from `layers[]` |
| Delete *(template)* | — | **Not possible via UI** | `controlsMenuConfiguration.jsx` hides DELETE when `entity.metadata?.IsTemplate === true` |

> **Opacity:** VFB's ChromePicker returns `{r, g, b, a}` where `a` is the opacity slider. Both colour and opacity are dispatched via the same `CHANGE_COLOR` action. In Neuroglancer, colour becomes `shaderControls.color = [r, g, b]` and opacity becomes `layer.opacity = a`. The GLSL shader itself is a fixed template — it never needs to be regenerated.
>
> **Template deletion protection:** `buildNeuroglassState` does not need to guard against template deletion — it is structurally impossible. `controlsMenuConfiguration.jsx` conditionally hides the DELETE action for any instance where `entity.metadata?.IsTemplate === true`. The template is always present in `allLoadedInstances` and always appears as a layer.


### Files Changed

| File | What changes |
|---|---|
| `applications/virtual-fly-brain/frontend/src/utils/neuroglassStateConfig.js` | Add `buildNeuroglassState()`, `LAYER_SHADER` fixed template, `INSTANCE_TO_DATASET_PATH` lookup table |
| `applications/virtual-fly-brain/frontend/src/components/NeuroglassViewer.jsx` | `useSelector(allLoadedInstances)`, `useMemo` + 300ms debounce → rebuild iframe src on every instance change |

---

## Requirement — Configurable Datasource

Replace hardcoded `gs://neuroglass/vfb/...` URLs with a configurable object driven by environment variables.

For this all we need is to make it as the proposed configuration file with server location and protocol. If data is stored in VFB Server, with expected format for Neuroglass, should be nothing else left to do from VFB app except fetch data from that location.

### Configuration Object Proposed

`buildUrl` is protocol-aware — GCS/S3 require Neuroglancer's pipe notation; HTTP fileservers use a `precomputed://` prefix:

```javascript
function defaultBuildUrl(instanceId) {
  const path = INSTANCE_TO_DATASET_PATH[instanceId] || instanceId;
  const { protocol, baseUrl } = NEUROGLASS_DATASOURCE;
  if (protocol === 'neuroglancer-precomputed' || protocol === 'n5') {
    return `${baseUrl}/${path}/|${protocol}:`;       // e.g. gs://neuroglass/vfb/VFB_x/|neuroglancer-precomputed:
  }
  return `precomputed://${baseUrl}/${path}`;          // e.g. precomputed://https://files.vfb.org/VFB_x
}
```

```javascript
export const NEUROGLASS_DATASOURCE = {
  protocol: import.meta.env.VITE_NEUROGLASS_DATA_PROTOCOL,  // e.g. 'neuroglancer-precomputed'
  baseUrl:  import.meta.env.VITE_NEUROGLASS_DATA_BASE_URL,  // e.g. 'gs://neuroglass/vfb'
  buildUrl: defaultBuildUrl,  // function: instanceId → full source URL
};
```

### Files Changes Needed

| File | What changes |
|---|---|
| `applications/virtual-fly-brain/frontend/src/utils/neuroglassStateConfig.js` | Add `NEUROGLASS_DATASOURCE = { protocol, baseUrl, buildUrl(id) }` |
| `applications/virtual-fly-brain/frontend/src/frontend/.env.example` | Document `VITE_NEUROGLASS_DATA_PROTOCOL`, `VITE_NEUROGLASS_DATA_BASE_URL` |

---

## Redux State Architecture

### What Neuroglass-Related State Is Needed in Redux?

| State item | Needed? | Where |
|---|---|---|
| `neuroglassView` — layout string preference | ✅ Yes | `globalInfo` (new field) |
| Layer list (visible, color, opacity) | ✅ Already in Redux | `instances.allLoadedInstances` — no new state needed |
| Datasource config | ❌ Static | Config file |
| Camera position | ❌ Not in requirements | Potentially Needed if required |
| iframe loading state | ❌ Not in requirements | Component-local `useState` if needed |

I think our current setup works well with the Neuroglass integration, and we don’t need to store any other setting from Neuroglass as far as I can tell.  

Possible other Use Cases that could change state :

-  Camera position for each given quadrant on Neuroglass. If these are saved as part of Neuroglass state, and updated in URL as well, we could extract this information from the IFrame as it updates and save the camera position for each quadrant in Global Redux state of VFB.

- Missing data in VFB Server, if a loaded instance doesn’t have data in the VFB Server we can use in Neuroglass, we can’t render this instance in Neuroglass. NeuroglassViewer component will need to remember not to keep trying to fetch data for this instance when not available, maybe here we need to expand the global state to flag a VFB loaded instance as non Neuroglass candidate and avoid retrying in future component updates. 


### Files Changed Needed

| File | What changes |
|---|---|
| `applications/virtual-fly-brain/frontend/src/reducers/actions/types/GlobalTypes.js` | Add `SET_NEUROGLASS_VIEW` |
| `applications/virtual-fly-brain/frontend/src/reducers/actions/globals.js` | Add `setNeuroglassView(view)` action creator |
| `applications/virtual-fly-brain/frontend/src/reducers/GlobalReducer.js` | Add `neuroglassView: null` + `SET_NEUROGLASS_VIEW` case |
| `applications/virtual-fly-brain/frontend/src/educers/middleware/urlUpdaterMiddleware.js` | Read `?layout` on first load → dispatch `setNeuroglassView`; write URL back on `SET_NEUROGLASS_VIEW` |
