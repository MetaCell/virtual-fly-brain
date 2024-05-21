"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Attribute = _interopRequireDefault(require("../Attribute"));
var _AttributeDefinitions = _interopRequireDefault(require("../AttributeDefinitions"));
var _Node2 = _interopRequireDefault(require("./Node"));
var _TabNode;
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
var TabNode = /*#__PURE__*/function (_Node) {
  /** @hidden @internal */
  function TabNode(model, json) {
    var _this;
    var addToModel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    _classCallCheck(this, TabNode);
    _this = _callSuper(this, TabNode, [model]);
    /** @hidden @internal */
    _defineProperty(_this, "_tabRect", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "_renderedName", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "_extra", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "_window", void 0);
    _this._extra = {}; // extra data added to node not saved in json

    TabNode._attributeDefinitions.fromJson(json, _this._attributes);
    if (addToModel === true) {
      model._addNode(_this);
    }
    return _this;
  }
  _inherits(TabNode, _Node);
  return _createClass(TabNode, [{
    key: "getWindow",
    value: function getWindow() {
      return this._window;
    }
  }, {
    key: "getTabRect",
    value: function getTabRect() {
      return this._tabRect;
    }

    /** @hidden @internal */
  }, {
    key: "_setTabRect",
    value: function _setTabRect(rect) {
      this._tabRect = rect;
    }

    /** @hidden @internal */
  }, {
    key: "_setRenderedName",
    value: function _setRenderedName(name) {
      this._renderedName = name;
    }

    /** @hidden @internal */
  }, {
    key: "_getRenderedName",
    value: function _getRenderedName() {
      return this._renderedName;
    }
  }, {
    key: "getName",
    value: function getName() {
      return this._getAttr("name");
    }
  }, {
    key: "getComponent",
    value: function getComponent() {
      return this._getAttr("component");
    }

    /**
     * Returns the config attribute that can be used to store node specific data that
     * WILL be saved to the json. The config attribute should be changed via the action Actions.updateNodeAttributes rather
     * than directly, for example:
     * this.state.model.doAction(
     *   FlexLayout.Actions.updateNodeAttributes(node.getId(), {config:myConfigObject}));
     */
  }, {
    key: "getConfig",
    value: function getConfig() {
      return this._attributes.config;
    }

    /**
     * Returns an object that can be used to store transient node specific data that will
     * NOT be saved in the json.
     */
  }, {
    key: "getExtraData",
    value: function getExtraData() {
      return this._extra;
    }
  }, {
    key: "isFloating",
    value: function isFloating() {
      return this._getAttr("floating");
    }
  }, {
    key: "getIcon",
    value: function getIcon() {
      return this._getAttr("icon");
    }
  }, {
    key: "isEnableClose",
    value: function isEnableClose() {
      return this._getAttr("enableClose");
    }
  }, {
    key: "getCloseType",
    value: function getCloseType() {
      return this._getAttr("closeType");
    }
  }, {
    key: "isEnableFloat",
    value: function isEnableFloat() {
      return this._getAttr("enableFloat");
    }
  }, {
    key: "isEnableDrag",
    value: function isEnableDrag() {
      return this._getAttr("enableDrag");
    }
  }, {
    key: "isEnableRename",
    value: function isEnableRename() {
      return this._getAttr("enableRename");
    }
  }, {
    key: "getClassName",
    value: function getClassName() {
      return this._getAttr("className");
    }
  }, {
    key: "isEnableRenderOnDemand",
    value: function isEnableRenderOnDemand() {
      return this._getAttr("enableRenderOnDemand");
    }

    /** @hidden @internal */
  }, {
    key: "_setName",
    value: function _setName(name) {
      this._attributes.name = name;
      if (this._window && this._window.document) {
        this._window.document.title = name;
      }
    }

    /** @hidden @internal */
  }, {
    key: "_setFloating",
    value: function _setFloating(_float) {
      this._attributes.floating = _float;
    }

    /** @hidden @internal */
  }, {
    key: "_layout",
    value: function _layout(rect, metrics) {
      if (!rect.equals(this._rect)) {
        this._fireEvent("resize", {
          rect: rect
        });
      }
      this._rect = rect;
    }

    /** @hidden @internal */
  }, {
    key: "_delete",
    value: function _delete() {
      this._parent._remove(this);
      this._fireEvent("close", {});
    }

    /** @hidden @internal */
  }, {
    key: "_toJson",
    value: function _toJson() {
      var json = {};
      TabNode._attributeDefinitions.toJson(json, this._attributes);
      return json;
    }

    /** @hidden @internal */
  }, {
    key: "_updateAttrs",
    value: function _updateAttrs(json) {
      TabNode._attributeDefinitions.update(json, this._attributes);
    }

    /** @hidden @internal */
  }, {
    key: "_getAttributeDefinitions",
    value: function _getAttributeDefinitions() {
      return TabNode._attributeDefinitions;
    }

    /** @hidden @internal */
  }, {
    key: "_setWindow",
    value: function _setWindow(window) {
      this._window = window;
    }

    /** @hidden @internal */
  }], [{
    key: "_fromJson",
    value: /** @hidden @internal */
    function _fromJson(json, model) {
      var addToModel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var newLayoutNode = new TabNode(model, json, addToModel);
      return newLayoutNode;
    }
    /** @hidden @internal */
  }, {
    key: "_createAttributeDefinitions",
    value: /** @hidden @internal */
    function _createAttributeDefinitions() {
      var attributeDefinitions = new _AttributeDefinitions["default"]();
      attributeDefinitions.add("type", TabNode.TYPE, true).setType(_Attribute["default"].STRING);
      attributeDefinitions.add("id", undefined).setType(_Attribute["default"].STRING);
      attributeDefinitions.add("name", "[Unnamed Tab]").setType(_Attribute["default"].STRING);
      attributeDefinitions.add("component", undefined).setType(_Attribute["default"].STRING);
      attributeDefinitions.add("config", undefined).setType("any");
      attributeDefinitions.add("floating", false).setType(_Attribute["default"].BOOLEAN);
      attributeDefinitions.addInherited("enableClose", "tabEnableClose").setType(_Attribute["default"].BOOLEAN);
      attributeDefinitions.addInherited("closeType", "tabCloseType").setType("ICloseType");
      attributeDefinitions.addInherited("enableDrag", "tabEnableDrag").setType(_Attribute["default"].BOOLEAN);
      attributeDefinitions.addInherited("enableRename", "tabEnableRename").setType(_Attribute["default"].BOOLEAN);
      attributeDefinitions.addInherited("className", "tabClassName").setType(_Attribute["default"].STRING);
      attributeDefinitions.addInherited("icon", "tabIcon").setType(_Attribute["default"].STRING);
      attributeDefinitions.addInherited("enableRenderOnDemand", "tabEnableRenderOnDemand").setType(_Attribute["default"].BOOLEAN);
      attributeDefinitions.addInherited("enableFloat", "tabEnableFloat").setType(_Attribute["default"].BOOLEAN);
      return attributeDefinitions;
    }
  }, {
    key: "getAttributeDefinitions",
    value: function getAttributeDefinitions() {
      return TabNode._attributeDefinitions;
    }
  }]);
}(_Node2["default"]);
_TabNode = TabNode;
_defineProperty(TabNode, "TYPE", "tab");
_defineProperty(TabNode, "_attributeDefinitions", _TabNode._createAttributeDefinitions());
var _default = exports["default"] = TabNode;
//# sourceMappingURL=TabNode.js.map