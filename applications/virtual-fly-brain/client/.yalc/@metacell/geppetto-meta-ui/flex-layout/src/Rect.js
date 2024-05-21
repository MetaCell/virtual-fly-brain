"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Orientation = _interopRequireDefault(require("./Orientation"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Rect = /*#__PURE__*/function () {
  function Rect(x, y, width, height) {
    _classCallCheck(this, Rect);
    _defineProperty(this, "x", void 0);
    _defineProperty(this, "y", void 0);
    _defineProperty(this, "width", void 0);
    _defineProperty(this, "height", void 0);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  return _createClass(Rect, [{
    key: "clone",
    value: function clone() {
      return new Rect(this.x, this.y, this.width, this.height);
    }
  }, {
    key: "equals",
    value: function equals(rect) {
      if (this.x === rect.x && this.y === rect.y && this.width === rect.width && this.height === rect.height) {
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "getBottom",
    value: function getBottom() {
      return this.y + this.height;
    }
  }, {
    key: "getRight",
    value: function getRight() {
      return this.x + this.width;
    }
  }, {
    key: "positionElement",
    value: function positionElement(element, position) {
      this.styleWithPosition(element.style, position);
    }
  }, {
    key: "styleWithPosition",
    value: function styleWithPosition(style) {
      var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "absolute";
      style.left = this.x + "px";
      style.top = this.y + "px";
      style.width = Math.max(0, this.width) + "px"; // need Math.max to prevent -ve, cause error in IE
      style.height = Math.max(0, this.height) + "px";
      style.position = position;
      return style;
    }
  }, {
    key: "contains",
    value: function contains(x, y) {
      if (this.x <= x && x <= this.getRight() && this.y <= y && y <= this.getBottom()) {
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "removeInsets",
    value: function removeInsets(insets) {
      return new Rect(this.x + insets.left, this.y + insets.top, Math.max(0, this.width - insets.left - insets.right), Math.max(0, this.height - insets.top - insets.bottom));
    }
  }, {
    key: "centerInRect",
    value: function centerInRect(outerRect) {
      this.x = (outerRect.width - this.width) / 2;
      this.y = (outerRect.height - this.height) / 2;
    }

    /** @hidden @internal */
  }, {
    key: "_getSize",
    value: function _getSize(orientation) {
      var prefSize = this.width;
      if (orientation === _Orientation["default"].VERT) {
        prefSize = this.height;
      }
      return prefSize;
    }
  }, {
    key: "toString",
    value: function toString() {
      return "(Rect: x=" + this.x + ", y=" + this.y + ", width=" + this.width + ", height=" + this.height + ")";
    }
  }], [{
    key: "empty",
    value: function empty() {
      return new Rect(0, 0, 0, 0);
    }
  }, {
    key: "fromElement",
    value: function fromElement(element) {
      var _element$getBoundingC = element.getBoundingClientRect(),
        x = _element$getBoundingC.x,
        y = _element$getBoundingC.y,
        width = _element$getBoundingC.width,
        height = _element$getBoundingC.height;
      return new Rect(x, y, width, height);
    }
  }]);
}();
var _default = exports["default"] = Rect;
//# sourceMappingURL=Rect.js.map