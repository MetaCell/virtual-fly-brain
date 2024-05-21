"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Orientation;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Orientation = /*#__PURE__*/function () {
  /** @hidden @internal */
  function Orientation(name) {
    _classCallCheck(this, Orientation);
    /** @hidden @internal */
    _defineProperty(this, "_name", void 0);
    this._name = name;
  }
  return _createClass(Orientation, [{
    key: "getName",
    value: function getName() {
      return this._name;
    }
  }, {
    key: "toString",
    value: function toString() {
      return this._name;
    }
  }], [{
    key: "flip",
    value: function flip(from) {
      if (from === Orientation.HORZ) {
        return Orientation.VERT;
      } else {
        return Orientation.HORZ;
      }
    }
  }]);
}();
_Orientation = Orientation;
_defineProperty(Orientation, "HORZ", new _Orientation("horz"));
_defineProperty(Orientation, "VERT", new _Orientation("vert"));
var _default = exports["default"] = Orientation;
//# sourceMappingURL=Orientation.js.map