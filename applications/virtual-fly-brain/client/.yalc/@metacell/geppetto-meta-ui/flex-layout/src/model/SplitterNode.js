"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _AttributeDefinitions = _interopRequireDefault(require("../AttributeDefinitions"));
var _Orientation = _interopRequireDefault(require("../Orientation"));
var _Node2 = _interopRequireDefault(require("./Node"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var SplitterNode = /*#__PURE__*/function (_Node) {
  /** @hidden @internal */
  function SplitterNode(model) {
    var _this;
    _classCallCheck(this, SplitterNode);
    _this = _callSuper(this, SplitterNode, [model]);
    _this._fixed = true;
    _this._attributes.type = SplitterNode.TYPE;
    model._addNode(_this);
    return _this;
  }

  /** @hidden @internal */
  _inherits(SplitterNode, _Node);
  return _createClass(SplitterNode, [{
    key: "getWidth",
    value: function getWidth() {
      return this._model.getSplitterSize();
    }

    /** @hidden @internal */
  }, {
    key: "getMinWidth",
    value: function getMinWidth() {
      if (this.getOrientation() === _Orientation["default"].VERT) {
        return this._model.getSplitterSize();
      } else {
        return 0;
      }
    }

    /** @hidden @internal */
  }, {
    key: "getHeight",
    value: function getHeight() {
      return this._model.getSplitterSize();
    }

    /** @hidden @internal */
  }, {
    key: "getMinHeight",
    value: function getMinHeight() {
      if (this.getOrientation() === _Orientation["default"].HORZ) {
        return this._model.getSplitterSize();
      } else {
        return 0;
      }
    }

    /** @hidden @internal */
  }, {
    key: "getMinSize",
    value: function getMinSize(orientation) {
      if (orientation === _Orientation["default"].HORZ) {
        return this.getMinWidth();
      } else {
        return this.getMinHeight();
      }
    }

    /** @hidden @internal */
  }, {
    key: "getWeight",
    value: function getWeight() {
      return 0;
    }

    /** @hidden @internal */
  }, {
    key: "_setWeight",
    value: function _setWeight(value) {}

    /** @hidden @internal */
  }, {
    key: "_getPrefSize",
    value: function _getPrefSize(orientation) {
      return this._model.getSplitterSize();
    }

    /** @hidden @internal */
  }, {
    key: "_updateAttrs",
    value: function _updateAttrs(json) {}

    /** @hidden @internal */
  }, {
    key: "_getAttributeDefinitions",
    value: function _getAttributeDefinitions() {
      return new _AttributeDefinitions["default"]();
    }

    /** @hidden @internal */
  }, {
    key: "_toJson",
    value: function _toJson() {
      return undefined;
    }
  }]);
}(_Node2["default"]);
_defineProperty(SplitterNode, "TYPE", "splitter");
var _default = exports["default"] = SplitterNode;
//# sourceMappingURL=SplitterNode.js.map