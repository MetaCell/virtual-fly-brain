"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applySelection = applySelection;
exports.mapToCanvasData = mapToCanvasData;
var _util = require("@metacell/geppetto-meta-ui/3d-canvas/threeDEngine/util");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var SELECTION_COLOR = {
  r: 0.8,
  g: 0.8,
  b: 0,
  a: 1
};
function mapToCanvasData(data) {
  return data.map(function (item) {
    return {
      color: item.selected ? SELECTION_COLOR : item.color,
      instancePath: item.instancePath,
      visibility: item.visibility ? item.visibility : true
    };
  });
}
function applySelection(data, selectedInstances) {
  var smap = new Map(selectedInstances.map(function (i) {
    return [i, true];
  }));
  var newData = data.map(function (item) {
    if (smap.get(item.instancePath)) {
      return _objectSpread(_objectSpread({}, item), {}, {
        selected: !item.selected
      });
    }
    return _objectSpread({}, item);
  });
  var dmap = new Map(newData.map(function (i) {
    return [i.instancePath, true];
  }));
  smap.forEach(function (value, key) {
    if (!dmap.get(key)) {
      newData.push({
        instancePath: key,
        color: undefined,
        selected: true
      });
    }
  });
  return newData;
}
//# sourceMappingURL=SelectionUtils.js.map