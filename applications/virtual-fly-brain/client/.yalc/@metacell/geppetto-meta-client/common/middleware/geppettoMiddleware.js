"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callbacksMiddleware = callbacksMiddleware;
var _Resources = _interopRequireDefault(require("@metacell/geppetto-meta-core/Resources"));
var _actions = require("../actions");
var _GeppettoManager = _interopRequireDefault(require("../../common/GeppettoManager"));
var _EventManager = _interopRequireWildcard(require("../../common/EventManager"));
var _MessageSocket = _interopRequireDefault(require("../../communication/MessageSocket"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function callbacksMiddleware(_ref) {
  var getState = _ref.getState,
    dispatch = _ref.dispatch;
  return function (next) {
    return function (action) {
      var onError = function onError(payload) {
        _EventManager["default"].geppettoError(payload.message);
      };
      var onGeppettoVersion = function onGeppettoVersion(payload) {
        var version = payload;
        var geppettoVersion = _Resources["default"].GEPPETTO_VERSION_HOLDER.replace("$1", version);
        console.log(geppettoVersion);
      };
      var actionTriggered = false;
      if (_EventManager.callbacksList[action.type] !== undefined && _EventManager.callbacksList[action.type].size > 0) {
        _EventManager.callbacksList[action.type].forEach(function (item) {
          item(action);
        });
      }
      switch (action.type) {
        case _actions.clientActions.PROJECT_LOAD_FROM_ID:
          _MessageSocket["default"].loadProjectFromId(action.data);
          break;
        case _actions.clientActions.PROJECT_LOAD_FROM_URL:
          _MessageSocket["default"].loadProjectFromUrl(action.data);
          break;
        case _actions.backendActions.GEPPETTO_VERSION:
          onGeppettoVersion(action.data);
          break;
        case _actions.backendActions.IMPORT_TYPE_RESOLVED:
          _GeppettoManager["default"].swapResolvedType(action.data);
          break;
        case _actions.backendActions.IMPORT_VALUE_RESOLVED:
          _GeppettoManager["default"].swapResolvedValue(action.data);
          break;
        case _actions.backendActions.FETCHED:
        case _actions.backendActions.VARIABLE_FETCHED:
          {
            _GeppettoManager["default"].addVariableToModel(action.data);
            break;
          }
        case _actions.backendActions.MODEL_LOADED:
          {
            console.time(_Resources["default"].PARSING_MODEL);
            _GeppettoManager["default"].loadModel(action.data);
            break;
          }
        case _actions.backendActions.PROJECT_LOADED:
          {
            var message = action.data;
            _MessageSocket["default"].projectId = message.project.id;
            _GeppettoManager["default"].loadProject(message.project, message.persisted);
            break;
          }
        case _actions.backendActions.ERROR_DOWNLOADING_MODEL:
        case _actions.backendActions.ERROR_DOWNLOADING_RESULTS:
        case _actions.backendActions.ERROR_LOADING_PROJECT:
        case _actions.backendActions.ERROR_LOADING_SIM:
        case _actions.backendActions.ERROR:
          onError(action.data);
          break;
        default:
          break;
      }
      if (!actionTriggered) {
        next(action);
      }
      return;
    };
  };
}
//# sourceMappingURL=geppettoMiddleware.js.map