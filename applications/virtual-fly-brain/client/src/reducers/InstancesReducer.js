import { getGlobalTypes } from "./actions/types/GlobalTypes";
import { getInstancesTypes } from "./actions/types/getInstancesTypes";
import {
  SELECTED_COLOR,
  DESELECTED_COLOR,
  TEMPLATE_COLOR,
  SKELETON,
  CYLINDERS,
  getNextColor,
} from "./../utils/constants";
import { loadInstances } from "./../utils/instancesHelper";

export const initialStateInstancesReducer = {
  allPotentialInstances: [],
  allLoadedInstances: [],
  focusedInstance: undefined,
  threeDObjects: [],
  mappedCanvasData: [],
  event: {},
  isLoading: false,
  launchTemplate: null,
  error: false,
  errorMessage: undefined,
  cameraEvent: {},
};

const getMappedCanvasData = (loadedInstances) => {
  let updatedCanvasData = loadedInstances
    ?.filter((m) => m.meshCreated)
    ?.map((instance) => {
      let { color, visibleMesh, metadata, selected } = instance;
      return {
        instancePath: metadata?.Id,
        visibility: visibleMesh || false,
        color,
        selected: selected || false,
      };
    });

  return updatedCanvasData;
};

const InstancesReducer = (state = initialStateInstancesReducer, response) => {
  switch (response.type) {
    case getInstancesTypes.LAUNCH_TEMPLATE: {
      if (!response.payload.openTemplate) {
        let loadedInstances = [...state.allLoadedInstances];
        return Object.assign({}, state, {
          allLoadedInstances: loadedInstances,
          focusedInstance: loadedInstances?.find(
            (i) => i?.metadata?.Id === response.payload.id
          ),
          event: {
            action: getInstancesTypes.ADD_INSTANCE,
            id: response.payload.id,
            trigger: Date.now(),
          },
          isLoading: false,
        });
      } else {
        return Object.assign({}, state);
      }
    }
    case getInstancesTypes.GET_INSTANCES_STARTED: {
      return Object.assign({}, state, {
        isLoading: true,
      });
    }
    case getInstancesTypes.GET_INSTANCES_SUCCESS: {
      const newInstance = { metadata: response.payload };
      newInstance.stackInstance = response.payload.stackInstance;
      if (newInstance.metadata?.IsTemplate) {
        newInstance.color = TEMPLATE_COLOR;
        newInstance.userSetColor = TEMPLATE_COLOR;
        newInstance.stackInstance = true;
      } else {
        newInstance.color = DESELECTED_COLOR;
      }

      let launchTemplate = state.launchTemplate;
      if (
        newInstance.metadata.IsTemplate &&
        !state.allLoadedInstances?.find((i) => i?.metadata?.IsTemplate)
      ) {
        launchTemplate = newInstance;
      }

      let loadedInstances = state.allLoadedInstances?.find(
        (i) => i?.metadata?.Id === response.payload.Id
      )
        ? [...state.allLoadedInstances]
        : [...state.allLoadedInstances, newInstance];
      let focused = state.focusedInstance;
      if (response.payload.focus) {
        focused = loadedInstances?.find(
          (i) => i?.metadata?.Id === response.payload.Id
        );
      }
      if (response.payload.select && response.payload?.IsTemplate !== true) {
        focused = loadedInstances?.find(
          (i) => i?.metadata?.Id === response.payload.Id
        );
        focused.selected = true;
        focused.color = SELECTED_COLOR;
        loadedInstances?.forEach((i) => {
          if (i.metadata?.Id !== focused.metadata?.Id) {
            i.color = i.userSetColor || DESELECTED_COLOR;
            i.selected = false;
          }
        });
      }

      return Object.assign({}, state, {
        allLoadedInstances: loadedInstances,
        launchTemplate: launchTemplate,
        focusedInstance: focused,
        event: {
          action: getInstancesTypes.ADD_INSTANCE,
          id: response.payload.Id,
          trigger: Date.now(),
        },
        isLoading: false,
        error: false,
        errorMessage: undefined,
      });
    }
    case getInstancesTypes.GET_INSTANCES_FAILURE: {
      return Object.assign({}, state, {
        error: true,
        errorMessage: response.payload.error,
      });
    }
    case getInstancesTypes.REMOVE_INSTANCES_SUCCESS: {
      let loadedInstances = [
        ...state.allLoadedInstances.filter(
          (i) => i.metadata?.Id !== response.payload.query
        ),
      ];
      let focusedInstance = loadedInstances?.find(
        (i) => i?.metadata?.IsTemplate
      );

      const threeDObjects = [...state.threeDObjects];
      const matchObjects = threeDObjects.filter(
        (o) => !o.name.includes(response.payload.query)
      );

      return Object.assign({}, state, {
        allLoadedInstances: loadedInstances,
        mappedCanvasData: getMappedCanvasData(loadedInstances),
        threeDObjects: matchObjects,
        focusedInstance: focusedInstance,
        event: {
          action: getInstancesTypes.UPDATE_INSTANCES,
          id: response.payload.query,
          trigger: Date.now(),
        },
        isLoading: false,
      });
    }
    case getInstancesTypes.REMOVE_ALL_INSTANCES_SUCCESS: {
      let loadedInstances = state.allLoadedInstances.filter(
        (i) => i?.metadata?.IsTemplate
      );

      return Object.assign({}, state, {
        allLoadedInstances: loadedInstances,
        mappedCanvasData: getMappedCanvasData(loadedInstances),
        threeDObjects: [],
        focusedInstance: loadedInstances[0],
        event: {
          action: getInstancesTypes.UPDATE_INSTANCES,
          id: response.payload.query,
          trigger: Date.now(),
        },
        isLoading: false,
      });
    }
    case getInstancesTypes.SHOW_3D: {
      const allLoadedInstances = [...state.allLoadedInstances];
      const matchInstance = allLoadedInstances?.find(
        (i) => i.metadata?.Id === response.payload.id
      );
      matchInstance.visible = true;
      matchInstance.visibleMesh = true;
      return Object.assign({}, state, {
        allLoadedInstances: allLoadedInstances,
        mappedCanvasData: getMappedCanvasData(allLoadedInstances),
        event: {
          action: getInstancesTypes.UPDATE_INSTANCES,
          id: response.payload.id,
          trigger: Date.now(),
        },
        isLoading: false,
      });
    }
    case getInstancesTypes.HIDE_3D: {
      const allLoadedInstances = [...state.allLoadedInstances];
      const matchInstance = allLoadedInstances?.find(
        (i) => i.metadata?.Id === response.payload.id
      );
      matchInstance.visible = false;
      matchInstance.visibleMesh = false;
      return Object.assign({}, state, {
        allLoadedInstances: allLoadedInstances,
        mappedCanvasData: getMappedCanvasData(allLoadedInstances),
        event: {
          action: getInstancesTypes.UPDATE_INSTANCES,
          id: response.payload.id,
          trigger: Date.now(),
        },
        isLoading: false,
      });
    }
    case getInstancesTypes.SHOW_3D_MESH: {
      const allLoadedInstances = [...state.allLoadedInstances];
      const matchInstance = allLoadedInstances?.find(
        (i) => i.metadata?.Id === response.payload.id
      );
      matchInstance.visibleMesh = true;
      return Object.assign({}, state, {
        allLoadedInstances: allLoadedInstances,
        mappedCanvasData: getMappedCanvasData(allLoadedInstances),
        event: {
          action: getInstancesTypes.UPDATE_INSTANCES,
          id: response.payload.id,
          trigger: Date.now(),
        },
        isLoading: false,
      });
    }
    case getInstancesTypes.HIDE_3D_MESH: {
      const allLoadedInstances = [...state.allLoadedInstances];
      const matchInstance = allLoadedInstances?.find(
        (i) => i.metadata?.Id === response.payload.id
      );
      matchInstance.visibleMesh = false;
      return Object.assign({}, state, {
        allLoadedInstances: allLoadedInstances,
        mappedCanvasData: getMappedCanvasData(allLoadedInstances),
        event: {
          action: getInstancesTypes.UPDATE_INSTANCES,
          id: response.payload.id,
          trigger: Date.now(),
        },
        isLoading: false,
      });
    }
    case getInstancesTypes.CHANGE_COLOR: {
      const allLoadedInstances = [...state.allLoadedInstances];
      let matchInstance = allLoadedInstances?.find(
        (i) => i.metadata?.Id === response.payload.id
      );

      // Use the alpha from the color picker
      matchInstance.color = response.payload.color;

      // Update fullOpacityColor for skeletons (keep full opacity for skeletons)
      matchInstance.fullOpacityColor = { ...response.payload.color, a: 1.0 };

      // Update userSetColor with the user's choice including alpha
      matchInstance.userSetColor = response.payload.color;

      // Update 3D objects
      const threeDObjects = [...state.threeDObjects];
      const matchObjects = threeDObjects.filter((o) =>
        o.name.includes(response.payload.id)
      );
      if (matchObjects?.length > 0) {
        matchObjects?.forEach((mo) => {
          mo.children[0].material.color = response.payload.color;

          // Use the user-set alpha except for special cases
          if (mo.name.includes("_swc") || mo.name.includes(SKELETON)) {
            mo.children[0].material.opacity = 1.0;
          } else if (matchInstance.metadata?.IsTemplate) {
            mo.children[0].material.opacity = 0.4;
          } else {
            mo.children[0].material.opacity = response.payload.color.a || 0.3;
          }
        });
      }

      return Object.assign({}, state, {
        allLoadedInstances: allLoadedInstances,
        threeDObjects: threeDObjects,
        mappedCanvasData: getMappedCanvasData(allLoadedInstances),
        event: {
          action: getInstancesTypes.UPDATE_INSTANCES,
          id: response.payload.id,
          trigger: Date.now(),
        },
        isLoading: false,
      });
    }
    case getInstancesTypes.FOCUS_INSTANCE: {
      const loadedInstances = [...state.allLoadedInstances];
      const findInstance = loadedInstances?.find(
        (i) => i.metadata?.Id === response.payload.id
      );
      return Object.assign({}, state, {
        focusedInstance: findInstance,
        event: {
          action: getInstancesTypes.FOCUS_INSTANCE,
          id: response.payload.id,
          trigger: Date.now(),
        },
        isLoading: false,
      });
    }
    case getInstancesTypes.ZOOM_TO_INSTANCE: {
      const loadedInstances = [...state.allLoadedInstances];
      const findInstance = loadedInstances?.find(
        (i) => i.metadata?.Id === response.payload.id
      );
      return Object.assign({}, state, {
        focusedInstance: findInstance,
        event: {
          action: getInstancesTypes.ZOOM_TO_INSTANCE,
          id: response.payload.id,
          trigger: Date.now(),
        },
        isLoading: false,
      });
    }
    case getInstancesTypes.SELECT_INSTANCE: {
      const allLoadedInstances = [...state.allLoadedInstances];
      const findInstance = allLoadedInstances?.find(
        (i) => i.metadata?.Id === response.payload.id
      );
      if (findInstance && findInstance?.metadata?.IsTemplate != true) {
        findInstance.selected = !findInstance.selected;
        if (findInstance.selected) {
          findInstance.color = SELECTED_COLOR;
          allLoadedInstances?.forEach((i) => {
            if (i.metadata?.Id !== findInstance.metadata?.Id) {
              i.color = i.userSetColor || DESELECTED_COLOR;
              i.selected = false;
            }
          });
        } else {
          findInstance.color = findInstance.userSetColor || DESELECTED_COLOR;
        }
      }

      const threeDObjects = [...state.threeDObjects];
      const matchObject = threeDObjects.find(
        (o) => o.name === response.payload.id
      );
      if (matchObject) {
        matchObject.selected = !matchObject.selected;
        if (matchObject.selected) matchObject.color = SELECTED_COLOR;
        else {
          matchObject.color = DESELECTED_COLOR;
        }
      }

      return Object.assign({}, state, {
        allLoadedInstances: allLoadedInstances,
        threeDObjects: threeDObjects,
        mappedCanvasData: getMappedCanvasData(allLoadedInstances),
        event: {
          action: getInstancesTypes.UPDATE_INSTANCES,
          id: response.payload.id,
          trigger: Date.now(),
        },
        isLoading: false,
      });
    }
    case getInstancesTypes.GET_3D_OBJ_TYPE_STARTED:
      return Object.assign({}, state, {
        isLoading: true,
      });
    case getInstancesTypes.GET_3D_OBJ_TYPE_SUCCESS: {
      const loadedInstances = [...state.allLoadedInstances];
      const matchLoadedInstance = loadedInstances.find(
        (i) => i.metadata?.Id === response.payload.id
      );
      const simpleInstance = response.payload;
      simpleInstance.color = matchLoadedInstance?.color;
      if (matchLoadedInstance) {
        matchLoadedInstance.visible = true;
        matchLoadedInstance.visibleMesh = true;
        matchLoadedInstance.meshCreated = true;
      }

      if (matchLoadedInstance.selected) {
        matchLoadedInstance.color = SELECTED_COLOR;
      }

      loadInstances(simpleInstance, state.allLoadedInstances);

      return Object.assign({}, state, {
        allLoadedInstances: loadedInstances,
        mappedCanvasData: getMappedCanvasData(loadedInstances),
        event: {
          action: getInstancesTypes.UPDATE_INSTANCES,
          id: response.payload.id,
          trigger: Date.now(),
        },
        isLoading: false,
      });
    }
    case getInstancesTypes.GET_3D_OBJ_TYPE_FAILURE:
      return Object.assign({}, state, {
        instanceOnFocus: response.payload.error,
        error: true,
      });
    case getInstancesTypes.ADD_SKELETON: {
      const allLoadedInstances = [...state.allLoadedInstances];
      const instance = allLoadedInstances?.find(
        (i) => i.metadata?.Id === response.payload.id
      );
      const mode = response.payload.mode;
      const objectName = response.payload.id + mode;

      let skeleton = response.payload.skeleton;
      skeleton.visible = true;
      skeleton.name = objectName;

      const threeDObjects = [...state.threeDObjects];
      let matchMode = SKELETON;
      if (mode === SKELETON) matchMode = CYLINDERS;
      const matchObject = threeDObjects.find(
        (o) => o.name === response.payload.id + matchMode
      );
      if (matchObject) {
        matchObject.visible = false;
        instance.skeleton[matchMode].visible = false;
      }

      if (instance.skeleton) {
        instance.skeleton[mode] = skeleton;
      } else {
        instance.skeleton = {};
        instance.skeleton[mode] = skeleton;
      }

      if (!threeDObjects?.find((o) => o.name === objectName)) {
        threeDObjects.push(skeleton);
      }

      return Object.assign({}, state, {
        threeDObjects: threeDObjects,
        allLoadedInstances: allLoadedInstances,
        mappedCanvasData: getMappedCanvasData(allLoadedInstances),
        event: {
          action: getInstancesTypes.UPDATE_INSTANCES,
          id: response.payload.id,
          mode: SKELETON,
          trigger: Date.now(),
        },
        isLoading: false,
      });
    }
    case getInstancesTypes.SHOW_SKELETON: {
      const allLoadedInstances = [...state.allLoadedInstances];
      const instance = allLoadedInstances?.find(
        (i) => i.metadata?.Id === response.payload.id
      );

      if (instance.skeleton?.skeleton) {
        instance.skeleton.skeleton.visible = true;
      }

      const threeDObjects = [...state.threeDObjects];
      const matchObject = threeDObjects.find(
        (o) => o.name === response.payload.id + SKELETON
      );
      if (matchObject) {
        matchObject.visible = true;
      }
      return Object.assign({}, state, {
        threeDObjects: threeDObjects,
        allLoadedInstances: allLoadedInstances,
        event: {
          action: getInstancesTypes.UPDATE_SKELETON,
          id: response.payload.id,
          mode: SKELETON,
          visible: true,
          trigger: Date.now(),
        },
        isLoading: false,
      });
    }
    case getInstancesTypes.HIDE_SKELETON: {
      const allLoadedInstances = [...state.allLoadedInstances];
      const instance = allLoadedInstances?.find(
        (i) => i.metadata?.Id === response.payload.id
      );

      if (instance.skeleton?.[SKELETON]) {
        instance.skeleton[SKELETON].visible = false;
      }

      const threeDObjects = [...state.threeDObjects];
      const matchObject = threeDObjects.find(
        (o) => o.name === response.payload.id + SKELETON
      );
      if (matchObject) {
        matchObject.visible = false;
      }
      return Object.assign({}, state, {
        threeDObjects: threeDObjects,
        allLoadedInstances: allLoadedInstances,
        event: {
          action: getInstancesTypes.UPDATE_SKELETON,
          mode: SKELETON,
          id: response.payload.id,
          visible: false,
          trigger: Date.now(),
        },
        isLoading: false,
      });
    }
    case getInstancesTypes.SHOW_CYLINDERS: {
      const allLoadedInstances = [...state.allLoadedInstances];
      const instance = allLoadedInstances?.find(
        (i) => i.metadata?.Id === response.payload.id
      );

      if (instance.skeleton?.[CYLINDERS]) {
        instance.skeleton[CYLINDERS].visible = true;
      }

      if (instance.skeleton?.skeleton) {
        instance.skeleton.skeleton.visible = false;
      }

      const threeDObjects = [...state.threeDObjects];
      const matchObject = threeDObjects.find(
        (o) => o.name === response.payload.id + CYLINDERS
      );
      if (matchObject) {
        matchObject.visible = true;
      }
      const matchSkeleton = threeDObjects.find(
        (o) => o.name === response.payload.id + SKELETON
      );
      if (matchSkeleton) {
        matchSkeleton.visible = false;
      }

      return Object.assign({}, state, {
        threeDObjects: threeDObjects,
        allLoadedInstances: allLoadedInstances,
        event: {
          action: getInstancesTypes.UPDATE_SKELETON,
          id: response.payload.id,
          mode: CYLINDERS,
          visible: true,
          trigger: Date.now(),
        },
        isLoading: false,
      });
    }
    case getInstancesTypes.SHOW_LINES: {
      const allLoadedInstances = [...state.allLoadedInstances];
      const instance = allLoadedInstances?.find(
        (i) => i.metadata?.Id === response.payload.id
      );

      if (instance.skeleton?.[CYLINDERS]) {
        instance.skeleton[CYLINDERS].visible = false;
      }

      if (instance.skeleton?.[SKELETON]) {
        instance.skeleton[SKELETON].visible = true;
      }

      const threeDObjects = [...state.threeDObjects];
      const matchObject = threeDObjects.forEach((o) =>
        o.name.includes(response.payload.id)
          ? (o.visible = true)
          : null
      );
      if (matchObject) {
        matchObject.visible = true;
      }
      const matchLines = threeDObjects.find(
        (o) => o.name === response.payload.id + CYLINDERS
      );
      if (matchLines) {
        matchLines.visible = false;
      }
      return Object.assign({}, state, {
        threeDObjects: threeDObjects,
        allLoadedInstances: allLoadedInstances,
        event: {
          action: getInstancesTypes.UPDATE_SKELETON,
          id: response.payload.id,
          mode: SKELETON,
          visible: true,
          trigger: Date.now(),
        },
        isLoading: false,
      });
    }
    case getGlobalTypes.SHOW_SLICE_DISPLAY: {
      let objectFound = null;
      for (let child of state.threeDObjects) {
        if (params.id === child.material?.name) {
          objectFound = true;
          break;
        }
      }

      if (objectFound) return;

      return Object.assign({}, state, {
        threeDObjects: [...state.threeDObjects, response.payload.data.plane],
      });
    }
    case getGlobalTypes.MODIFY_SLICE_DISPLAY: {
      return Object.assign({}, state, {
        threeDObjects: [...state.threeDObjects],
      });
    }
    case getGlobalTypes.RESET_ERRORS: {
      return Object.assign({}, state, {
        error: false,
        errorMessage: undefined,
      });
    }
    case getGlobalTypes.CAMERA_EVENT: {
      return Object.assign({}, state, {
        cameraEvent: { action: response.payload.action, date: Date.now() },
        event: {
          action: getGlobalTypes.CAMERA_EVENT,
          id: response.payload.id,
          trigger: Date.now(),
        },
      });
    }
    case getInstancesTypes.ADD_INSTANCE_SUCCESS: {
      let newInstance = response.payload;
      if (
        state.allLoadedInstances?.find(
          (i) =>
            i.metadata?.Id === newInstance.metadata?.Id &&
            i?.metadata?.IsTemplate !== true
        )
      ) {
        newInstance = state.allLoadedInstances?.find(
          (i) => i.metadata?.Id === newInstance.metadata?.Id
        );
      } else {
        // If it's a template, use TEMPLATE_COLOR with opacity 0.4
        if (newInstance.metadata?.IsTemplate) {
          newInstance.color = { ...TEMPLATE_COLOR, a: 0.4 };
        } else {
          // For other instances, use next color from palette with opacity 0.3
          newInstance.color = getNextColor(0.3);
          // Store original color with full opacity for potential skeleton use
          newInstance.fullOpacityColor = { ...newInstance.color, a: 1.0 };
        }
      }

      let launchTemplate = state.launchTemplate;
      if (
        newInstance.metadata.IsTemplate &&
        !state.allLoadedInstances?.find((i) => i?.metadata?.IsTemplate)
      ) {
        launchTemplate = newInstance;
      }

      let loadedInstances = state.allLoadedInstances?.find(
        (i) => i?.metadata?.Id === response.payload.Id
      )
        ? [...state.allLoadedInstances]
        : [...state.allLoadedInstances, newInstance];

      let focused = state.focusedInstance;
      if (response.payload.focus) {
        focused = loadedInstances?.find(
          (i) => i?.metadata?.Id === response.payload.Id
        );
      }

      return Object.assign({}, state, {
        allLoadedInstances: loadedInstances,
        launchTemplate: launchTemplate,
        focusedInstance: focused,
        event: {
          action: getInstancesTypes.ADD_INSTANCE,
          id: response.payload.Id,
          trigger: Date.now(),
        },
        isLoading: false,
        error: false,
        errorMessage: undefined,
      });
    }
    default:
      return state;
  }
};

export default InstancesReducer;
