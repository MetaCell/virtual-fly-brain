"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findBorderToMinimizeTo = findBorderToMinimizeTo;
exports.getWidget = getWidget;
exports.isEqual = isEqual;
exports.widget2Node = widget2Node;
var _excluded = ["id", "name", "component", "status", "panelName", "enableClose"];
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
/**
 * Transforms a widget configuration into a flexlayout node descriptor
 */
function widget2Node(configuration) {
  var id = configuration.id,
    name = configuration.name,
    component = configuration.component,
    status = configuration.status,
    panelName = configuration.panelName,
    _configuration$enable = configuration.enableClose,
    enableClose = _configuration$enable === void 0 ? true : _configuration$enable,
    others = _objectWithoutProperties(configuration, _excluded);
  return _objectSpread(_objectSpread({
    id: id,
    name: name,
    status: status,
    component: component,
    type: "tab",
    enableRename: false,
    enableClose: enableClose,
    panelName: panelName
  }, others), {}, {
    // attr defined inside config, will also be available from within flexlayout nodes.  For example:  node.getNodeById(id).getConfig()
    config: _objectSpread({}, configuration)
  });
}

/**
 * Deep object comparison
 * @param {*} a 
 * @param {*} b 
 */
function isEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  if (!a || !b || _typeof(a) !== 'object' && _typeof(b) !== 'object') {
    return a === b;
  }
  if (a === null || a === undefined || b === null || b === undefined) {
    return false;
  }
  if (a.prototype !== b.prototype) {
    return false;
  }
  var keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) {
    return false;
  }
  return keys.every(function (k) {
    return isEqual(a[k], b[k]);
  });
}
function findBorderToMinimizeTo(borderNodes) {
  var _iterator = _createForOfIteratorHelper(borderNodes),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _borderNode$getConfig;
      var borderNode = _step.value;
      if ((_borderNode$getConfig = borderNode.getConfig()) !== null && _borderNode$getConfig !== void 0 && _borderNode$getConfig.isMinimizedPanel) {
        return borderNode;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return null;
}
function getWidget(store, id) {
  return store.getState().widgets[id];
}
//# sourceMappingURL=utils.js.map