"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasDifferentProxyInstances = hasDifferentProxyInstances;
exports.hasDifferentThreeDObjects = hasDifferentThreeDObjects;
exports.hasVisualType = hasVisualType;
exports.hasVisualValue = hasVisualValue;
exports.hexToRGBNormalized = hexToRGBNormalized;
exports.rgbToHex = rgbToHex;
exports.sortInstances = sortInstances;
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function hasVisualType(instance) {
  return instance.getVisualType() !== undefined || instance.getChildren().some(function (i) {
    return hasVisualType(i);
  });
}
function hasVisualValue(instance) {
  try {
    return instance.hasVisualValue();
  } catch (e) {
    return false;
  }
}
function hexToRGBNormalized(hex) {
  var rgb = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function (m, r, g, b) {
    return '#' + r + r + g + g + b + b;
  }).substring(1).match(/.{2}/g).map(function (x) {
    return parseInt(x, 16) / 255;
  });
  return {
    r: rgb[0],
    g: rgb[1],
    b: rgb[2],
    a: 1
  };
}
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}
function rgbToHex(r, g, b) {
  return '0X' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function sortInstances(proxyInstances) {
  var sortedInstances = [];
  sortedInstances = proxyInstances.sort(function (a, b) {
    if (a.instancePath < b.instancePath) {
      return -1;
    }
    if (a.instancePath > b.instancePath) {
      return 1;
    }
    return 0;
  });
  return sortedInstances;
}
function hasDifferentProxyInstances(data, prevData) {
  data = sortInstances(data);
  prevData = sortInstances(prevData);
  // FIXME: attribute order matters in the check below but it probably shouldn't:
  return JSON.stringify(data) !== JSON.stringify(prevData);
}
function hasDifferentThreeDObjects(threeDObjects, prevThreeDObjects) {
  var threeDObjectsUUIDs = new Set(threeDObjects.map(function (obj) {
    return obj.uuid;
  }));
  var prevThreeDObjectsUUIDs = new Set(prevThreeDObjects.map(function (obj) {
    return obj.uuid;
  }));
  return !eqSet(threeDObjectsUUIDs, prevThreeDObjectsUUIDs);
}
function eqSet(as, bs) {
  if (as.size !== bs.size) {
    return false;
  }
  var _iterator = _createForOfIteratorHelper(as),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var a = _step.value;
      if (!bs.has(a)) {
        return false;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return true;
}
//# sourceMappingURL=util.js.map