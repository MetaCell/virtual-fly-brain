"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._extend = _extend;
exports._object = _object;
exports.appendTo = appendTo;
exports.countBy = countBy;
exports.createElement = createElement;
exports.extend = extend;
exports.filter = filter;
exports.map = map;
exports.offset = offset;
exports.pluck = pluck;
exports.strToFunc = strToFunc;
exports.uniq = uniq;
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/**
 *
 * Creates function from string
 *
 * @param body
 */
function strToFunc(body) {
  return new Function('x', 'return ' + body + ';');
}

/**
 *
 * Merge the contents of two or more objects together into the first object.
 *
 * @param obj1
 * @param obj2
 */
function extend(obj1, obj2) {
  Object.assign(obj1, obj2);
  return obj1;
}

/**
 *
 * Gets the current coordinates of element relative to the document.
 *
 * @param el
 */
function offset(el) {
  var rect = el.getBoundingClientRect();
  return {
    top: rect.top + document.body.scrollTop,
    left: rect.left + document.body.scrollLeft
  };
}

/**
 *
 * Copies the values of all enumerable own and inherited properties from one or more source objects to a target object.
 *
 * @param target
 * @param sources
 */
function _extend(target) {
  var source = [];
  for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }
  sources.forEach(function (src) {
    source = source.concat([src, Object.getPrototypeOf(src)]);
  });
  return Object.assign.apply(Object, [target].concat(_toConsumableArray(source)));
}

/**
 *
 * Converts an array of keys and values to an object.
 *
 * @param array
 */
function _object(array) {
  return array.reduce(function (result, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      key = _ref2[0],
      val = _ref2[1];
    return Object.assign(result, _defineProperty({}, key, val));
  }, {});
}

/**
 *
 * Produces a duplicate-free version of the array
 *
 * @param array
 */
function uniq(array) {
  return _toConsumableArray(new Set(array));
}

/**
 *
 * Creates a new array with the results of getting a property for every element in array.
 *
 * @param array
 * @param property
 */
function pluck(array, property) {
  return array.map(function (x) {
    return x[property];
  });
}

/**
 *
 * Creates a new array with the results of calling a function for every array element.
 *
 * @param array
 * @param func
 */
function map(array, func) {
  return array.map(function (x) {
    return func(x);
  });
}

/**
 *
 * Creates a new array with all elements that pass the test implemented by the provided function.
 *
 * @param array
 * @param func
 */
function filter(array, func) {
  return array.filter(function (x) {
    return func(x);
  });
}

/**
 *
 * Sorts a list into groups and returns a count for the number of objects in each group.
 *
 * @param list
 * @param func
 */
function countBy(list, func) {
  var dict = {};
  for (var index in list) {
    var key = func(list[index]);
    if (key in dict) {
      dict[key]++;
    } else {
      dict[key] = 1;
    }
  }
  return dict;
}

/**
 *
 * Creates the HTML element specified by tagName,
 *
 * @param tagName
 * @param options
 */
function createElement(tagName, options) {
  var el = document.createElement(tagName, options);
  for (var attr in options) {
    if (attr === "text") {
      el.innerHTML += options[attr];
    } else {
      el.setAttribute(attr, options[attr]);
    }
  }
  return el;
}

/**
 *
 * Insert child to the end of the target
 *
 * @param target
 * @param child
 */
function appendTo(target, child) {
  target.appendChild(child);
}
//# sourceMappingURL=utilities.js.map