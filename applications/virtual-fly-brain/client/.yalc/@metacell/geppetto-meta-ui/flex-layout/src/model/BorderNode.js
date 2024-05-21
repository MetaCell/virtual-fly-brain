"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Attribute = _interopRequireDefault(require("../Attribute"));
var _AttributeDefinitions = _interopRequireDefault(require("../AttributeDefinitions"));
var _DockLocation = _interopRequireDefault(require("../DockLocation"));
var _DropInfo = _interopRequireDefault(require("../DropInfo"));
var _Orientation = _interopRequireDefault(require("../Orientation"));
var _Rect = _interopRequireDefault(require("../Rect"));
var _Node2 = _interopRequireDefault(require("./Node"));
var _SplitterNode = _interopRequireDefault(require("./SplitterNode"));
var _TabNode = _interopRequireDefault(require("./TabNode"));
var _Utils = require("./Utils");
var _BorderNode;
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
var BorderNode = /*#__PURE__*/function (_Node) {
  /** @hidden @internal */
  function BorderNode(location, json, model) {
    var _this;
    _classCallCheck(this, BorderNode);
    _this = _callSuper(this, BorderNode, [model]);
    /** @hidden @internal */
    _defineProperty(_this, "_contentRect", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "_tabHeaderRect", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "_location", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "_drawChildren", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "_adjustedSize", 0);
    /** @hidden @internal */
    _defineProperty(_this, "_calculatedBorderBarSize", 0);
    _this._location = location;
    _this._drawChildren = [];
    _this._attributes.id = "border_".concat(location.getName());
    BorderNode._attributeDefinitions.fromJson(json, _this._attributes);
    model._addNode(_this);
    return _this;
  }
  _inherits(BorderNode, _Node);
  return _createClass(BorderNode, [{
    key: "getLocation",
    value: function getLocation() {
      return this._location;
    }
  }, {
    key: "getTabHeaderRect",
    value: function getTabHeaderRect() {
      return this._tabHeaderRect;
    }
  }, {
    key: "getRect",
    value: function getRect() {
      return this._tabHeaderRect;
    }
  }, {
    key: "getContentRect",
    value: function getContentRect() {
      return this._contentRect;
    }
  }, {
    key: "isEnableDrop",
    value: function isEnableDrop() {
      return this._getAttr("enableDrop");
    }
  }, {
    key: "isAutoSelectTab",
    value: function isAutoSelectTab(whenOpen) {
      if (whenOpen == null) {
        whenOpen = this.getSelected() !== -1;
      }
      if (whenOpen) {
        return this._getAttr("autoSelectTabWhenOpen");
      } else {
        return this._getAttr("autoSelectTabWhenClosed");
      }
    }
  }, {
    key: "getClassName",
    value: function getClassName() {
      return this._getAttr("className");
    }

    /** @hidden @internal */
  }, {
    key: "calcBorderBarSize",
    value: function calcBorderBarSize(metrics) {
      var barSize = this._getAttr("barSize");
      if (barSize !== 0) {
        // its defined
        this._calculatedBorderBarSize = barSize;
      } else {
        this._calculatedBorderBarSize = metrics.borderBarSize;
      }
    }
  }, {
    key: "getBorderBarSize",
    value: function getBorderBarSize() {
      return this._calculatedBorderBarSize;
    }
  }, {
    key: "getSize",
    value: function getSize() {
      return this._getAttr("size");
    }
  }, {
    key: "getMinSize",
    value: function getMinSize() {
      return this._getAttr("minSize");
    }
  }, {
    key: "getSelected",
    value: function getSelected() {
      return this._attributes.selected;
    }
  }, {
    key: "getSelectedNode",
    value: function getSelectedNode() {
      if (this.getSelected() !== -1) {
        return this._children[this.getSelected()];
      }
      return undefined;
    }
  }, {
    key: "getOrientation",
    value: function getOrientation() {
      return this._location.getOrientation();
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
  }, {
    key: "isMaximized",
    value: function isMaximized() {
      return false;
    }
  }, {
    key: "isShowing",
    value: function isShowing() {
      return this._attributes.show;
    }

    /** @hidden @internal */
  }, {
    key: "_setSelected",
    value: function _setSelected(index) {
      this._attributes.selected = index;
    }

    /** @hidden @internal */
  }, {
    key: "_setSize",
    value: function _setSize(pos) {
      this._attributes.size = pos;
    }

    /** @hidden @internal */
  }, {
    key: "_updateAttrs",
    value: function _updateAttrs(json) {
      BorderNode._attributeDefinitions.update(json, this._attributes);
    }

    /** @hidden @internal */
  }, {
    key: "_getDrawChildren",
    value: function _getDrawChildren() {
      return this._drawChildren;
    }

    /** @hidden @internal */
  }, {
    key: "_setAdjustedSize",
    value: function _setAdjustedSize(size) {
      this._adjustedSize = size;
    }

    /** @hidden @internal */
  }, {
    key: "_getAdjustedSize",
    value: function _getAdjustedSize() {
      return this._adjustedSize;
    }

    /** @hidden @internal */
  }, {
    key: "_layoutBorderOuter",
    value: function _layoutBorderOuter(outer, metrics) {
      this.calcBorderBarSize(metrics);
      var split1 = this._location.split(outer, this.getBorderBarSize()); // split border outer
      this._tabHeaderRect = split1.start;
      return split1.end;
    }

    /** @hidden @internal */
  }, {
    key: "_layoutBorderInner",
    value: function _layoutBorderInner(inner, metrics) {
      var _this2 = this;
      this._drawChildren = [];
      var location = this._location;
      var split1 = location.split(inner, this._adjustedSize + this._model.getSplitterSize()); // split off tab contents
      var split2 = location.reflect().split(split1.start, this._model.getSplitterSize()); // split contents into content and splitter

      this._contentRect = split2.end;
      this._children.forEach(function (child, i) {
        child._layout(_this2._contentRect, metrics);
        child._setVisible(i === _this2.getSelected());
        _this2._drawChildren.push(child);
      });
      if (this.getSelected() === -1) {
        return inner;
      } else {
        var newSplitter = new _SplitterNode["default"](this._model);
        newSplitter._setParent(this);
        newSplitter._setRect(split2.start);
        this._drawChildren.push(newSplitter);
        return split1.end;
      }
    }

    /** @hidden @internal */
  }, {
    key: "_remove",
    value: function _remove(node) {
      var removedIndex = this._removeChild(node);
      if (this.getSelected() !== -1) {
        (0, _Utils.adjustSelectedIndex)(this, removedIndex);
      }
    }

    /** @hidden @internal */
  }, {
    key: "canDrop",
    value: function canDrop(dragNode, x, y) {
      if (dragNode.getType() !== _TabNode["default"].TYPE) {
        return undefined;
      }
      var dropInfo;
      var dockLocation = _DockLocation["default"].CENTER;
      if (this._tabHeaderRect.contains(x, y)) {
        if (this._location._orientation === _Orientation["default"].VERT) {
          if (this._children.length > 0) {
            var child = this._children[0];
            var childRect = child.getTabRect();
            var childY = childRect.y;
            var childHeight = childRect.height;
            var pos = this._tabHeaderRect.x;
            var childCenter = 0;
            for (var i = 0; i < this._children.length; i++) {
              child = this._children[i];
              childRect = child.getTabRect();
              childCenter = childRect.x + childRect.width / 2;
              if (x >= pos && x < childCenter) {
                var outlineRect = new _Rect["default"](childRect.x - 2, childY, 3, childHeight);
                dropInfo = new _DropInfo["default"](this, outlineRect, dockLocation, i, "flexlayout__outline_rect");
                break;
              }
              pos = childCenter;
            }
            if (dropInfo == null) {
              var _outlineRect = new _Rect["default"](childRect.getRight() - 2, childY, 3, childHeight);
              dropInfo = new _DropInfo["default"](this, _outlineRect, dockLocation, this._children.length, "flexlayout__outline_rect");
            }
          } else {
            var _outlineRect2 = new _Rect["default"](this._tabHeaderRect.x + 1, this._tabHeaderRect.y + 2, 3, 18);
            dropInfo = new _DropInfo["default"](this, _outlineRect2, dockLocation, 0, "flexlayout__outline_rect");
          }
        } else {
          if (this._children.length > 0) {
            var _child = this._children[0];
            var _childRect = _child.getTabRect();
            var childX = _childRect.x;
            var childWidth = _childRect.width;
            var _pos = this._tabHeaderRect.y;
            var _childCenter = 0;
            for (var _i = 0; _i < this._children.length; _i++) {
              _child = this._children[_i];
              _childRect = _child.getTabRect();
              _childCenter = _childRect.y + _childRect.height / 2;
              if (y >= _pos && y < _childCenter) {
                var _outlineRect3 = new _Rect["default"](childX, _childRect.y - 2, childWidth, 3);
                dropInfo = new _DropInfo["default"](this, _outlineRect3, dockLocation, _i, "flexlayout__outline_rect");
                break;
              }
              _pos = _childCenter;
            }
            if (dropInfo == null) {
              var _outlineRect4 = new _Rect["default"](childX, _childRect.getBottom() - 2, childWidth, 3);
              dropInfo = new _DropInfo["default"](this, _outlineRect4, dockLocation, this._children.length, "flexlayout__outline_rect");
            }
          } else {
            var _outlineRect5 = new _Rect["default"](this._tabHeaderRect.x + 2, this._tabHeaderRect.y + 1, 18, 3);
            dropInfo = new _DropInfo["default"](this, _outlineRect5, dockLocation, 0, "flexlayout__outline_rect");
          }
        }
        if (!dragNode._canDockInto(dragNode, dropInfo)) {
          return undefined;
        }
      } else if (this.getSelected() !== -1 && this._contentRect.contains(x, y)) {
        var _outlineRect6 = this._contentRect;
        dropInfo = new _DropInfo["default"](this, _outlineRect6, dockLocation, -1, "flexlayout__outline_rect");
        if (!dragNode._canDockInto(dragNode, dropInfo)) {
          return undefined;
        }
      }
      return dropInfo;
    }

    /** @hidden @internal */
  }, {
    key: "drop",
    value: function drop(dragNode, location, index, select) {
      var fromIndex = 0;
      var dragParent = dragNode.getParent();
      if (dragParent !== undefined) {
        fromIndex = dragParent._removeChild(dragNode);
        (0, _Utils.adjustSelectedIndex)(dragParent, fromIndex);
      }

      // if dropping a tab back to same tabset and moving to forward position then reduce insertion index
      if (dragNode.getType() === _TabNode["default"].TYPE && dragParent === this && fromIndex < index && index > 0) {
        index--;
      }

      // simple_bundled dock to existing tabset
      var insertPos = index;
      if (insertPos === -1) {
        insertPos = this._children.length;
      }
      if (dragNode.getType() === _TabNode["default"].TYPE) {
        this._addChild(dragNode, insertPos);
      }
      if (select || select !== false && this.isAutoSelectTab()) {
        this._setSelected(insertPos);
      }
      this._model._tidy();
    }

    /** @hidden @internal */
  }, {
    key: "_toJson",
    value: function _toJson() {
      var json = {};
      BorderNode._attributeDefinitions.toJson(json, this._attributes);
      json.location = this._location.getName();
      json.children = this._children.map(function (child) {
        return child._toJson();
      });
      return json;
    }

    /** @hidden @internal */
  }, {
    key: "_getSplitterBounds",
    value: function _getSplitterBounds(splitter) {
      var useMinSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var pBounds = [0, 0];
      var minSize = useMinSize ? this.getMinSize() : 0;
      var outerRect = this._model._getOuterInnerRects().outer;
      var innerRect = this._model._getOuterInnerRects().inner;
      if (this._location === _DockLocation["default"].TOP) {
        pBounds[0] = outerRect.y + minSize;
        pBounds[1] = innerRect.getBottom() - splitter.getHeight();
      } else if (this._location === _DockLocation["default"].LEFT) {
        pBounds[0] = outerRect.x + minSize;
        pBounds[1] = innerRect.getRight() - splitter.getWidth();
      } else if (this._location === _DockLocation["default"].BOTTOM) {
        pBounds[0] = innerRect.y;
        pBounds[1] = outerRect.getBottom() - splitter.getHeight() - minSize;
      } else if (this._location === _DockLocation["default"].RIGHT) {
        pBounds[0] = innerRect.x;
        pBounds[1] = outerRect.getRight() - splitter.getWidth() - minSize;
      }
      return pBounds;
    }

    /** @hidden @internal */
  }, {
    key: "_calculateSplit",
    value: function _calculateSplit(splitter, splitterPos) {
      var pBounds = this._getSplitterBounds(splitter);
      if (this._location === _DockLocation["default"].BOTTOM || this._location === _DockLocation["default"].RIGHT) {
        return Math.max(0, pBounds[1] - splitterPos);
      } else {
        return Math.max(0, splitterPos - pBounds[0]);
      }
    }

    /** @hidden @internal */
  }, {
    key: "_getAttributeDefinitions",
    value: function _getAttributeDefinitions() {
      return BorderNode._attributeDefinitions;
    }

    /** @hidden @internal */
  }], [{
    key: "_fromJson",
    value: /** @hidden @internal */
    function _fromJson(json, model) {
      var location = _DockLocation["default"].getByName(json.location);
      var border = new BorderNode(location, json, model);
      if (json.children) {
        border._children = json.children.map(function (jsonChild) {
          var child = _TabNode["default"]._fromJson(jsonChild, model);
          child._setParent(border);
          return child;
        });
      }
      return border;
    }
    /** @hidden @internal */
  }, {
    key: "_createAttributeDefinitions",
    value: /** @hidden @internal */
    function _createAttributeDefinitions() {
      var attributeDefinitions = new _AttributeDefinitions["default"]();
      attributeDefinitions.add("type", BorderNode.TYPE, true).setType(_Attribute["default"].STRING).setFixed();
      attributeDefinitions.add("selected", -1).setType(_Attribute["default"].NUMBER);
      attributeDefinitions.add("show", true).setType(_Attribute["default"].BOOLEAN);
      attributeDefinitions.add("config", undefined).setType("any");
      attributeDefinitions.addInherited("barSize", "borderBarSize").setType(_Attribute["default"].NUMBER);
      attributeDefinitions.addInherited("enableDrop", "borderEnableDrop").setType(_Attribute["default"].BOOLEAN);
      attributeDefinitions.addInherited("className", "borderClassName").setType(_Attribute["default"].STRING);
      attributeDefinitions.addInherited("autoSelectTabWhenOpen", "borderAutoSelectTabWhenOpen").setType(_Attribute["default"].BOOLEAN);
      attributeDefinitions.addInherited("autoSelectTabWhenClosed", "borderAutoSelectTabWhenClosed").setType(_Attribute["default"].BOOLEAN);
      attributeDefinitions.addInherited("size", "borderSize").setType(_Attribute["default"].NUMBER);
      attributeDefinitions.addInherited("minSize", "borderMinSize").setType(_Attribute["default"].NUMBER);
      return attributeDefinitions;
    }
  }, {
    key: "getAttributeDefinitions",
    value: function getAttributeDefinitions() {
      return BorderNode._attributeDefinitions;
    }
  }]);
}(_Node2["default"]);
_BorderNode = BorderNode;
_defineProperty(BorderNode, "TYPE", "border");
_defineProperty(BorderNode, "_attributeDefinitions", _BorderNode._createAttributeDefinitions());
var _default = exports["default"] = BorderNode;
//# sourceMappingURL=BorderNode.js.map