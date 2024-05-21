"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Orientation = _interopRequireDefault(require("./Orientation"));
var _Rect = _interopRequireDefault(require("./Rect"));
var _DockLocation;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var DockLocation = /*#__PURE__*/function () {
  /** @hidden @internal */
  function DockLocation(name, orientation, indexPlus) {
    _classCallCheck(this, DockLocation);
    /** @hidden @internal */
    _defineProperty(this, "_name", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_orientation", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_indexPlus", void 0);
    this._name = name;
    this._orientation = orientation;
    this._indexPlus = indexPlus;
    DockLocation.values[this._name] = this;
  }
  return _createClass(DockLocation, [{
    key: "getName",
    value: function getName() {
      return this._name;
    }
  }, {
    key: "getOrientation",
    value: function getOrientation() {
      return this._orientation;
    }

    /** @hidden @internal */
  }, {
    key: "getDockRect",
    value: function getDockRect(r) {
      if (this === DockLocation.TOP) {
        return new _Rect["default"](r.x, r.y, r.width, r.height / 2);
      } else if (this === DockLocation.BOTTOM) {
        return new _Rect["default"](r.x, r.getBottom() - r.height / 2, r.width, r.height / 2);
      }
      if (this === DockLocation.LEFT) {
        return new _Rect["default"](r.x, r.y, r.width / 2, r.height);
      } else if (this === DockLocation.RIGHT) {
        return new _Rect["default"](r.getRight() - r.width / 2, r.y, r.width / 2, r.height);
      } else {
        return r.clone();
      }
    }

    /** @hidden @internal */
  }, {
    key: "split",
    value: function split(rect, size) {
      if (this === DockLocation.TOP) {
        var r1 = new _Rect["default"](rect.x, rect.y, rect.width, size);
        var r2 = new _Rect["default"](rect.x, rect.y + size, rect.width, rect.height - size);
        return {
          start: r1,
          end: r2
        };
      } else if (this === DockLocation.LEFT) {
        var _r = new _Rect["default"](rect.x, rect.y, size, rect.height);
        var _r2 = new _Rect["default"](rect.x + size, rect.y, rect.width - size, rect.height);
        return {
          start: _r,
          end: _r2
        };
      }
      if (this === DockLocation.RIGHT) {
        var _r3 = new _Rect["default"](rect.getRight() - size, rect.y, size, rect.height);
        var _r4 = new _Rect["default"](rect.x, rect.y, rect.width - size, rect.height);
        return {
          start: _r3,
          end: _r4
        };
      } else {
        // if (this === DockLocation.BOTTOM) {
        var _r5 = new _Rect["default"](rect.x, rect.getBottom() - size, rect.width, size);
        var _r6 = new _Rect["default"](rect.x, rect.y, rect.width, rect.height - size);
        return {
          start: _r5,
          end: _r6
        };
      }
    }

    /** @hidden @internal */
  }, {
    key: "reflect",
    value: function reflect() {
      if (this === DockLocation.TOP) {
        return DockLocation.BOTTOM;
      } else if (this === DockLocation.LEFT) {
        return DockLocation.RIGHT;
      }
      if (this === DockLocation.RIGHT) {
        return DockLocation.LEFT;
      } else {
        // if (this === DockLocation.BOTTOM) {
        return DockLocation.TOP;
      }
    }
  }, {
    key: "toString",
    value: function toString() {
      return "(DockLocation: name=" + this._name + ", orientation=" + this._orientation + ")";
    }
  }], [{
    key: "getByName",
    value: /** @hidden @internal */
    function getByName(name) {
      return DockLocation.values[name];
    }

    /** @hidden @internal */
  }, {
    key: "getLocation",
    value: function getLocation(rect, x, y) {
      if (x < rect.x + rect.width / 4) {
        return DockLocation.LEFT;
      } else if (x > rect.getRight() - rect.width / 4) {
        return DockLocation.RIGHT;
      } else if (y < rect.y + rect.height / 4) {
        return DockLocation.TOP;
      } else if (y > rect.getBottom() - rect.height / 4) {
        return DockLocation.BOTTOM;
      } else {
        return DockLocation.CENTER;
      }
    }
  }]);
}();
_DockLocation = DockLocation;
_defineProperty(DockLocation, "values", {});
_defineProperty(DockLocation, "TOP", new _DockLocation("top", _Orientation["default"].VERT, 0));
_defineProperty(DockLocation, "BOTTOM", new _DockLocation("bottom", _Orientation["default"].VERT, 1));
_defineProperty(DockLocation, "LEFT", new _DockLocation("left", _Orientation["default"].HORZ, 0));
_defineProperty(DockLocation, "RIGHT", new _DockLocation("right", _Orientation["default"].HORZ, 1));
_defineProperty(DockLocation, "CENTER", new _DockLocation("center", _Orientation["default"].VERT, 0));
var _default = exports["default"] = DockLocation;
//# sourceMappingURL=DockLocation.js.map