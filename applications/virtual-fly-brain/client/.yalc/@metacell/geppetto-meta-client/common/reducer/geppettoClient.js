"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clientInitialState = void 0;
exports["default"] = geppettoClientReducer;
var _actions = require("../actions");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var clientInitialState = {
  colorChanged: {
    instance: undefined,
    color: undefined
  },
  components: {
    help: {
      available: false,
      visible: false
    },
    logo: {
      latestUpdate: undefined,
      running: false
    },
    persist_spinner: {
      running: false
    },
    queryBuilder: {
      available: false,
      visible: false
    },
    spinner: {}
  },
  controls_disabled: false,
  error: {
    latestUpdate: undefined,
    message: undefined
  },
  info: {
    latestUpdate: undefined,
    message: undefined
  },
  instances: [],
  instance_focused: undefined,
  instance_selected: undefined,
  jupyter_geppetto_extension: {
    loaded: false
  },
  model: {
    id: undefined,
    status: undefined
  },
  project: {
    id: undefined,
    status: undefined,
    properties: {
      "public": false,
      properties_saved: false,
      config_loaded: false,
      configuration: undefined
    }
  },
  pythonMessages: {
    id: undefined,
    type: undefined,
    response: undefined,
    timestamp: undefined
  },
  visibility_records: [],
  websocket_status: undefined
};
exports.clientInitialState = clientInitialState;
function geppettoClientReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;
  return _objectSpread(_objectSpread({}, state), clientReducer(state, action));
}
function clientReducer(state, action) {
  var _state$components;
  // Hide the spinner when the correspondin offAction arrives
  if (state !== null && state !== void 0 && (_state$components = state.components) !== null && _state$components !== void 0 && _state$components.spinner && state.components.spinner[action.type]) {
    delete state.components.spinner[action.type];
    state.components.spinner = _objectSpread({}, state.components.spinner);
  }
  switch (action.type) {
    case _actions.clientActions.SELECT:
      if (action.data !== undefined) {
        return _objectSpread(_objectSpread({}, state), {}, {
          instance_selected: action.data
        });
      }
      break;
    case _actions.clientActions.VISIBILITY_CHANGED:
      if (action.data !== undefined && action.data.instance !== null && action.data.instance !== undefined) {
        var instanceName = action.data.instance.getName();
        var newVisibility = _toConsumableArray(state.visibility_records);
        newVisibility.unshift(instanceName);
        return _objectSpread(_objectSpread({}, state), {}, {
          visibility_records: newVisibility
        });
      }
      return _objectSpread({}, state);
    case _actions.clientActions.FOCUS_CHANGED:
      if (action.data !== undefined && action.data.instance !== null && action.data.instance !== undefined) {
        var instanceName = action.data.instance.getName();
        return _objectSpread(_objectSpread({}, state), {}, {
          instance_focused: instanceName
        });
      }
      return _objectSpread({}, state);
    case _actions.clientActions.PROJECT_LOADING:
      return _objectSpread(_objectSpread({}, state), {}, {
        project: _objectSpread(_objectSpread({}, state.project), {}, {
          status: action.data.project_status
        })
      });
    case _actions.clientActions.PROJECT_LOADED:
      return _objectSpread(_objectSpread({}, state), {}, {
        project: _objectSpread(_objectSpread({}, state.project), {}, {
          status: action.data.project_status
        })
      });
    case _actions.clientActions.PROJECT_DOWNLOADED:
      return _objectSpread(_objectSpread({}, state), {}, {
        project: _objectSpread(_objectSpread({}, state.project), {}, {
          status: action.data.project_status
        })
      });
    case _actions.clientActions.PROJECT_CONFIG_LOADED:
      return _objectSpread(_objectSpread({}, state), {}, {
        project: _objectSpread(_objectSpread({}, state.project), {}, {
          properties: _objectSpread(_objectSpread({}, state.project.properties), {}, {
            config_loaded: true,
            configuration: action.data
          })
        })
      });
    case _actions.clientActions.MODEL_LOADED:
      return _objectSpread(_objectSpread({}, state), {}, {
        model: _objectSpread(_objectSpread({}, state.model), {}, {
          status: action.data.model_status
        })
      });
    case _actions.clientActions.MODELTREE_POPULATED:
      return _objectSpread({}, state);
    case _actions.clientActions.SIMULATIONTREE_POPULATED:
      return _objectSpread({}, state);
    case _actions.clientActions.INSTANCE_DELETED:
      var deletedInstances = state.instances.filter(function (item) {
        item !== action.data;
      });
      return _objectSpread(_objectSpread({}, state), {}, {
        instances: deletedInstances
      });
    case _actions.clientActions.INSTANCES_CREATED:
      var createdInstances = _toConsumableArray(state.instances);
      action.data.forEach(function (instance) {
        var path = instance.getInstancePath();
        if (state.instances.indexOf(path) == -1) {
          createdInstances.push(path);
        }
      });
      return _objectSpread(_objectSpread({}, state), {}, {
        instances: createdInstances
      });
    case _actions.clientActions.SHOW_QUERYBUILDER:
      return _objectSpread(_objectSpread({}, state), {}, {
        components: _objectSpread(_objectSpread({}, state.components), {}, {
          queryBuilder: _objectSpread(_objectSpread({}, state.components.queryBuilder), {}, {
            visible: true
          })
        })
      });
    case _actions.clientActions.HIDE_QUERYBUILDER:
      return _objectSpread(_objectSpread({}, state), {}, {
        components: _objectSpread(_objectSpread({}, state.components), {}, {
          queryBuilder: _objectSpread(_objectSpread({}, state.components.queryBuilder), {}, {
            visible: false
          })
        })
      });
    case _actions.clientActions.SHOW_SPINNER:
      var _offAction = action.data.offAction || _actions.clientActions.HIDE_SPINNER;
      return _objectSpread(_objectSpread({}, state), {}, {
        components: _objectSpread(_objectSpread({}, state.components), {}, {
          spinner: _objectSpread(_objectSpread({}, state.components.spinner), {}, _defineProperty({}, _offAction, action.data.message))
        })
      });
    case _actions.clientActions.SHOW_HELP:
      return _objectSpread(_objectSpread({}, state), {}, {
        components: _objectSpread(_objectSpread({}, state.components), {}, {
          help: _objectSpread(_objectSpread({}, state.components.help), {}, {
            visible: true
          })
        })
      });
    case _actions.clientActions.HIDE_HELP:
      return _objectSpread(_objectSpread({}, state), {}, {
        components: _objectSpread(_objectSpread({}, state.components), {}, {
          help: _objectSpread(_objectSpread({}, state.components.help), {}, {
            visible: false
          })
        })
      });
    case _actions.clientActions.COLOR_SET:
      action.data.instance.setColor(action.data.color);
      return _objectSpread(_objectSpread({}, state), {}, {
        colorChanged: _objectSpread(_objectSpread({}, state.colorChanged), {}, {
          color: action.data.color,
          instance: action.data.instance
        })
      });
    case _actions.clientActions.PROJECT_MADE_PUBLIC:
      return _objectSpread(_objectSpread({}, state), {}, {
        project: _objectSpread(_objectSpread({}, state.project), {}, {
          properties: _objectSpread(_objectSpread({}, state.project.properties), {}, {
            "public": true
          })
        })
      });
    case _actions.clientActions.LIT_ENTITIES_CHANGED:
      return _objectSpread({}, state);
    case _actions.clientActions.COMPONENT_DESTROYED:
      return _objectSpread({}, state);
    case _actions.clientActions.PROJECT_PROPERTIES_SAVED:
      return _objectSpread(_objectSpread({}, state), {}, {
        project: _objectSpread(_objectSpread({}, state.project), {}, {
          properties: _objectSpread(_objectSpread({}, state.project.properties), {}, {
            properties_saved: true
          })
        })
      });
    case _actions.clientActions.RECEIVE_PYTHON_MESSAGE:
      return _objectSpread(_objectSpread({}, state), {}, {
        pythonMessages: _objectSpread(_objectSpread({}, state.pythonMessages), {}, {
          id: action.data.id,
          type: action.data.type,
          response: action.data.response,
          timestamp: action.data.timestamp
        })
      });
    case _actions.clientActions.ERROR_WHILE_EXEC_PYTHON_COMMAND:
      return _objectSpread(_objectSpread({}, state), {}, {
        pythonMessages: _objectSpread(_objectSpread({}, state.pythonMessages), {}, {
          id: action.data.id,
          type: action.data.type,
          response: action.data.response,
          timestamp: action.data.timestamp
        })
      });
    case _actions.clientActions.WEBSOCKET_DISCONNECTED:
      return _objectSpread(_objectSpread({}, state), {}, {
        websocket_status: _actions.clientActions.WEBSOCKET_DISCONNECTED
      });
    case _actions.clientActions.SPIN_LOGO:
      return _objectSpread(_objectSpread({}, state), {}, {
        components: _objectSpread(_objectSpread({}, state.components), {}, {
          logo: _objectSpread(_objectSpread({}, state.components.logo), {}, {
            running: true
          })
        })
      });
    case _actions.clientActions.STOP_LOGO:
      return _objectSpread(_objectSpread({}, state), {}, {
        components: _objectSpread(_objectSpread({}, state.components), {}, {
          logo: _objectSpread(_objectSpread({}, state.components.logo), {}, {
            running: false
          })
        })
      });
    case _actions.clientActions.GEPPETTO_ERROR:
      return _objectSpread(_objectSpread({}, state), {}, {
        error: _objectSpread(_objectSpread({}, state.error), {}, {
          latestUpdate: action.data.latestUpdate,
          message: action.data.message
        })
      });
    case _actions.clientActions.GEPPETTO_INFO:
      return _objectSpread(_objectSpread({}, state), {}, {
        info: _objectSpread(_objectSpread({}, state.info), {}, {
          latestUpdate: action.data.latestUpdate,
          message: action.data.message
        })
      });
    case _actions.clientActions.SPIN_PERSIST:
      return _objectSpread(_objectSpread({}, state), {}, {
        components: _objectSpread(_objectSpread({}, state.components), {}, {
          persist_spinner: _objectSpread(_objectSpread({}, state.components.persist_spinner), {}, {
            running: true
          })
        })
      });
    case _actions.clientActions.STOP_PERSIST:
      return _objectSpread(_objectSpread({}, state), {}, {
        components: _objectSpread(_objectSpread({}, state.components), {}, {
          persist_spinner: _objectSpread(_objectSpread({}, state.components.persist_spinner), {}, {
            running: false
          })
        })
      });
    case _actions.clientActions.JUPYTER_GEPPETTO_EXTENSION_READY:
      return _objectSpread(_objectSpread({}, state), {}, {
        jupyter_geppetto_extension: _objectSpread(_objectSpread({}, state.jupyter_geppetto_extension), {}, {
          loaded: true
        })
      });
    case _actions.clientActions.DISABLE_CONTROLS:
      return _objectSpread(_objectSpread({}, state), {}, {
        controls_disabled: true
      });
    default:
  }
}
//# sourceMappingURL=geppettoClient.js.map