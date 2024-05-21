"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractGriddleData = extractGriddleData;
exports.isString = isString;
exports.mapSourceToRow = mapSourceToRow;
exports.mapToObject = mapToObject;
exports.reduceEntityToGriddleRow = reduceEntityToGriddleRow;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function mapToObject(aMap) {
  var obj = {};
  aMap.forEach(function (v, k) {
    obj[k] = v;
  });
  return obj;
}
function isString(obj) {
  return typeof obj === 'string' || obj instanceof String;
}
function extractGriddleData(data, listViewerColumnsConfiguration) {
  return data.map(function (row) {
    return listViewerColumnsConfiguration.reduce(reduceEntityToGriddleRow(row), {});
  });
}
function reduceEntityToGriddleRow(row) {
  return function (processedRow, _ref) {
    var id = _ref.id,
      source = _ref.source;
    return _objectSpread(_objectSpread({}, processedRow), {}, _defineProperty({}, id, mapSourceToRow(source, row)));
  };
}
function mapSourceToRow(source, row) {
  if (row.get) {
    // is a map coming from griddle. instanceof Map does not work here
    row = mapToObject(row);
  }
  return source === undefined ? row : source instanceof Function ? source(row) : row[source];
}
//# sourceMappingURL=utils.js.map