"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.layout = void 0;
Object.defineProperty(exports, "layoutInitialState", {
  enumerable: true,
  get: function get() {
    return _defaultLayout["default"];
  }
});
exports.widgets = void 0;
var _actions = require("./actions");
var General = _interopRequireWildcard(require("../actions"));
var _model = require("./model");
var _defaultLayout = _interopRequireDefault(require("./defaultLayout"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
/**
 * Layout state update handling.
 * Logic comes from the layout manager.
 * 
 * @alias layoutReducer
 * @memberof Control
 */
var layout = function layout() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _defaultLayout["default"];
  var action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case _actions.layoutActions.SET_LAYOUT:
      {
        return _objectSpread(_objectSpread({}, state), action.data);
      }
    case _actions.layoutActions.UPDATE_LAYOUT:
      {
        return _objectSpread(_objectSpread({}, state), action.data.toJson());
      }
    case General.IMPORT_APPLICATION_STATE:
      {
        var incomingState = action.data.redux.layout;
        return incomingState;
      }
    default:
      return state;
  }
};

/**
 * Ensure there is one only active widget in the same panel
 * @param {*} widgets 
 * @param {*} param1 
 */
exports.layout = layout;
function updateWidgetStatus(widgets, _ref) {
  var status = _ref.status,
    panelName = _ref.panelName;
  if (status != _model.WidgetStatus.ACTIVE) {
    return widgets;
  }
  return Object.fromEntries(Object.values(widgets).filter(function (widget) {
    return widget;
  }).map(function (widget) {
    return [widget.id, _objectSpread(_objectSpread({}, widget), {}, {
      status: widget.panelName == panelName ? _model.WidgetStatus.HIDDEN : widget.status
    })];
  }));
}
function removeUndefined(obj) {
  return Object.keys(obj).forEach(function (key) {
    return obj[key] === undefined ? delete obj[key] : '';
  });
}
function extractPanelName(action) {
  return action.data.component == "Plot" ? "bottomPanel" : "leftPanel";
}
var widgets = function widgets() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;
  if (action.data) {
    removeUndefined(action.data); // Prevent deletion in case of unpolished update action
  }

  switch (action.type) {
    case _actions.layoutActions.ADD_WIDGET:
    case _actions.layoutActions.ACTIVATE_WIDGET:
    case _actions.layoutActions.UPDATE_WIDGET:
      {
        var newWidget = _objectSpread(_objectSpread({}, state[action.data.id]), {}, {
          panelName: extractPanelName(action)
        }, action.data);
        return _objectSpread(_objectSpread({}, updateWidgetStatus(state, newWidget)), {}, _defineProperty({}, action.data.id, newWidget));
      }
    case _actions.layoutActions.SET_WIDGETS:
      {
        return _objectSpread({}, action.data);
      }
    case _actions.layoutActions.ADD_WIDGETS:
      {
        return _objectSpread(_objectSpread({}, state), action.data);
      }
    case _actions.layoutActions.REMOVE_WIDGET:
    case _actions.layoutActions.DESTROY_WIDGET:
      {
        var newWidgets = _objectSpread({}, state);
        delete newWidgets[action.data.id];
        return newWidgets;
      }
    case _actions.layoutActions.UPDATE_LAYOUT:
      {
        var model = action.data;
        var updatedWidgets = _objectSpread({}, state);
        var parents = new Set(Object.keys(updatedWidgets).map(function (widgetId) {
          return model.getNodeById(widgetId);
        }).filter(function (n) {
          return n;
        }).map(function (n) {
          return n === null || n === void 0 ? void 0 : n.getParent();
        }));
        var _iterator = _createForOfIteratorHelper(parents),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var parent = _step.value;
            for (var i in parent.getChildren()) {
              var node = parent.getChildren()[i];
              if (!updatedWidgets[node.getId()]) {
                continue;
              }
              updatedWidgets[node.getId()] = _objectSpread({}, updatedWidgets[node.getId()]);
              updatedWidgets[node.getId()].name = node.getName();
              if (parent.getType() !== 'border') {
                // want to restore previous position when activated
                updatedWidgets[node.getId()].pos = parseInt(i);
              }
              updatedWidgets[node.getId()].panelName = parent.getId();
              if (parent.isMaximized() && node.isVisible()) {
                updatedWidgets[node.getId()].status = _model.WidgetStatus.MAXIMIZED;
              } else if (parent.getType() === 'border') {
                updatedWidgets[node.getId()].status = _model.WidgetStatus.MINIMIZED;
              } else if (parent.getSelectedNode().getId() == node.getId()) {
                updatedWidgets[node.getId()].status = _model.WidgetStatus.ACTIVE;
              } else {
                updatedWidgets[node.getId()].status = _model.WidgetStatus.HIDDEN;
              }
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        return updatedWidgets;
      }
    default:
      return state;
  }
};
exports.widgets = widgets;
//# sourceMappingURL=reducer.js.map