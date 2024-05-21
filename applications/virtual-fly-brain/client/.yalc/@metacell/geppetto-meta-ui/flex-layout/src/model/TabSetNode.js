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
var _RowNode = _interopRequireDefault(require("./RowNode"));
var _TabNode = _interopRequireDefault(require("./TabNode"));
var _Utils = require("./Utils");
var _TabSetNode;
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
var TabSetNode = /*#__PURE__*/function (_Node) {
  /** @hidden @internal */
  function TabSetNode(model, json) {
    var _this;
    _classCallCheck(this, TabSetNode);
    _this = _callSuper(this, TabSetNode, [model]);
    /** @hidden @internal */
    _defineProperty(_this, "_contentRect", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "_tabHeaderRect", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "calculatedTabBarHeight", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "calculatedHeaderBarHeight", void 0);
    TabSetNode._attributeDefinitions.fromJson(json, _this._attributes);
    model._addNode(_this);
    _this.calculatedTabBarHeight = 0;
    _this.calculatedHeaderBarHeight = 0;
    return _this;
  }
  _inherits(TabSetNode, _Node);
  return _createClass(TabSetNode, [{
    key: "getName",
    value: function getName() {
      return this._getAttr("name");
    }
  }, {
    key: "getSelected",
    value: function getSelected() {
      var selected = this._attributes.selected;
      if (selected !== undefined) {
        return selected;
      }
      return -1;
    }
  }, {
    key: "getSelectedNode",
    value: function getSelectedNode() {
      var selected = this.getSelected();
      if (selected !== -1) {
        return this._children[selected];
      }
      return undefined;
    }
  }, {
    key: "getWeight",
    value: function getWeight() {
      return this._getAttr("weight");
    }
  }, {
    key: "getWidth",
    value: function getWidth() {
      return this._getAttr("width");
    }
  }, {
    key: "getMinWidth",
    value: function getMinWidth() {
      return this._getAttr("minWidth");
    }
  }, {
    key: "getHeight",
    value: function getHeight() {
      return this._getAttr("height");
    }
  }, {
    key: "getMinHeight",
    value: function getMinHeight() {
      return this._getAttr("minHeight");
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
      return this._model.getMaximizedTabset() === this;
    }
  }, {
    key: "isActive",
    value: function isActive() {
      return this._model.getActiveTabset() === this;
    }
  }, {
    key: "isEnableDeleteWhenEmpty",
    value: function isEnableDeleteWhenEmpty() {
      return this._getAttr("enableDeleteWhenEmpty");
    }
  }, {
    key: "isEnableDrop",
    value: function isEnableDrop() {
      return this._getAttr("enableDrop");
    }
  }, {
    key: "isEnableDrag",
    value: function isEnableDrag() {
      return this._getAttr("enableDrag");
    }
  }, {
    key: "isEnableDivide",
    value: function isEnableDivide() {
      return this._getAttr("enableDivide");
    }
  }, {
    key: "isEnableMaximize",
    value: function isEnableMaximize() {
      return this._getAttr("enableMaximize");
    }
  }, {
    key: "canMaximize",
    value: function canMaximize() {
      if (this.isEnableMaximize()) {
        // always allow maximize toggle if already maximized
        if (this.getModel().getMaximizedTabset() === this) {
          return true;
        }
        // only one tabset, so disable
        if (this.getParent() === this.getModel().getRoot() && this.getModel().getRoot().getChildren().length === 1) {
          return false;
        }
        return true;
      }
      return false;
    }
  }, {
    key: "isEnableTabStrip",
    value: function isEnableTabStrip() {
      return this._getAttr("enableTabStrip");
    }
  }, {
    key: "isAutoSelectTab",
    value: function isAutoSelectTab() {
      return this._getAttr("autoSelectTab");
    }
  }, {
    key: "getClassNameTabStrip",
    value: function getClassNameTabStrip() {
      return this._getAttr("classNameTabStrip");
    }
  }, {
    key: "getClassNameHeader",
    value: function getClassNameHeader() {
      return this._getAttr("classNameHeader");
    }

    /** @hidden @internal */
  }, {
    key: "calculateHeaderBarHeight",
    value: function calculateHeaderBarHeight(metrics) {
      var headerBarHeight = this._getAttr("headerHeight");
      if (headerBarHeight !== 0) {
        // its defined
        this.calculatedHeaderBarHeight = headerBarHeight;
      } else {
        this.calculatedHeaderBarHeight = metrics.headerBarSize;
      }
    }

    /** @hidden @internal */
  }, {
    key: "calculateTabBarHeight",
    value: function calculateTabBarHeight(metrics) {
      var tabBarHeight = this._getAttr("tabStripHeight");
      if (tabBarHeight !== 0) {
        // its defined
        this.calculatedTabBarHeight = tabBarHeight;
      } else {
        this.calculatedTabBarHeight = metrics.tabBarSize;
      }
    }
  }, {
    key: "getHeaderHeight",
    value: function getHeaderHeight() {
      return this.calculatedHeaderBarHeight;
    }
  }, {
    key: "getTabStripHeight",
    value: function getTabStripHeight() {
      return this.calculatedTabBarHeight;
    }
  }, {
    key: "getTabLocation",
    value: function getTabLocation() {
      return this._getAttr("tabLocation");
    }

    /** @hidden @internal */
  }, {
    key: "_setWeight",
    value: function _setWeight(weight) {
      this._attributes.weight = weight;
    }

    /** @hidden @internal */
  }, {
    key: "_setSelected",
    value: function _setSelected(index) {
      this._attributes.selected = index;
    }

    /** @hidden @internal */
  }, {
    key: "canDrop",
    value: function canDrop(dragNode, x, y) {
      var dropInfo;
      if (dragNode === this) {
        var dockLocation = _DockLocation["default"].CENTER;
        var outlineRect = this._tabHeaderRect;
        var _sideBorders = this._model._getAttribute('sideBorders');
        if (_sideBorders > 0 && outlineRect.width + outlineRect.x >= window.innerWidth) {
          outlineRect.width = outlineRect.width - _sideBorders * 2;
        }
        dropInfo = new _DropInfo["default"](this, outlineRect, dockLocation, -1, "flexlayout__outline_rect");
      } else if (this._contentRect.contains(x, y)) {
        var _dockLocation = _DockLocation["default"].getLocation(this._contentRect, x, y);
        var _outlineRect = _dockLocation.getDockRect(this._rect);
        var _sideBorders2 = this._model._getAttribute('sideBorders');
        if (_sideBorders2 > 0 && _outlineRect.width + _outlineRect.x >= window.innerWidth) {
          _outlineRect.width = _outlineRect.width - _sideBorders2 * 2;
        }
        dropInfo = new _DropInfo["default"](this, _outlineRect, _dockLocation, -1, "flexlayout__outline_rect");
      } else if (this._children.length > 0 && this._tabHeaderRect != null && this._tabHeaderRect.contains(x, y)) {
        var child = this._children[0];
        var r = child.getTabRect();
        var yy = r.y;
        var h = r.height;
        var p = this._tabHeaderRect.x;
        var childCenter = 0;
        for (var i = 0; i < this._children.length; i++) {
          child = this._children[i];
          r = child.getTabRect();
          childCenter = r.x + r.width / 2;
          if (x >= p && x < childCenter) {
            var _dockLocation2 = _DockLocation["default"].CENTER;
            var _outlineRect2 = new _Rect["default"](r.x - 2, yy, 3, h);
            var _sideBorders3 = this._model._getAttribute('sideBorders');
            if (_sideBorders3 > 0 && _outlineRect2.width + _outlineRect2.x >= window.innerWidth) {
              _outlineRect2.width = _outlineRect2.width - _sideBorders3 * 2;
            }
            dropInfo = new _DropInfo["default"](this, _outlineRect2, _dockLocation2, i, "flexlayout__outline_rect");
            break;
          }
          p = childCenter;
        }
        if (dropInfo == null) {
          var _dockLocation3 = _DockLocation["default"].CENTER;
          var _outlineRect3 = new _Rect["default"](r.getRight() - 2, yy, 3, h);
          var _sideBorders4 = this._model._getAttribute('sideBorders');
          if (_sideBorders4 > 0 && _outlineRect3.width + _outlineRect3.x >= window.innerWidth) {
            _outlineRect3.width = _outlineRect3.width - _sideBorders4 * 2;
          }
          dropInfo = new _DropInfo["default"](this, _outlineRect3, _dockLocation3, this._children.length, "flexlayout__outline_rect");
        }
      }
      if (!dragNode._canDockInto(dragNode, dropInfo)) {
        return undefined;
      }
      return dropInfo;
    }

    /** @hidden @internal */
  }, {
    key: "_layout",
    value: function _layout(rect, metrics) {
      var _this2 = this;
      this.calculateHeaderBarHeight(metrics);
      this.calculateTabBarHeight(metrics);
      if (this.isMaximized()) {
        rect = this._model.getRoot().getRect();
      }
      rect = rect.removeInsets(this._getAttr("marginInsets"));
      this._rect = rect;
      rect = rect.removeInsets(this._getAttr("borderInsets"));
      var showHeader = this.getName() !== undefined;
      var y = 0;
      var h = 0;
      if (showHeader) {
        y += this.calculatedHeaderBarHeight;
        h += this.calculatedHeaderBarHeight;
      }
      if (this.isEnableTabStrip()) {
        if (this.getTabLocation() === "top") {
          this._tabHeaderRect = new _Rect["default"](rect.x, rect.y + y, rect.width, this.calculatedTabBarHeight);
        } else {
          this._tabHeaderRect = new _Rect["default"](rect.x, rect.y + rect.height - this.calculatedTabBarHeight, rect.width, this.calculatedTabBarHeight);
        }
        h += this.calculatedTabBarHeight;
        if (this.getTabLocation() === "top") {
          y += this.calculatedTabBarHeight;
        }
      }
      this._contentRect = new _Rect["default"](rect.x, rect.y + y, rect.width, rect.height - h);
      this._children.forEach(function (child, i) {
        child._layout(_this2._contentRect, metrics);
        child._setVisible(i === _this2.getSelected());
      });
    }

    /** @hidden @internal */
  }, {
    key: "_remove",
    value: function _remove(node) {
      var removedIndex = this._removeChild(node);
      this._model._tidy();
      (0, _Utils.adjustSelectedIndex)(this, removedIndex);
    }

    /** @hidden @internal */
  }, {
    key: "drop",
    value: function drop(dragNode, location, index, select) {
      var _this3 = this;
      var dockLocation = location;
      if (this === dragNode) {
        // tabset drop into itself
        return; // dock back to itself
      }
      var dragParent = dragNode.getParent();
      var fromIndex = 0;
      if (dragParent !== undefined) {
        fromIndex = dragParent._removeChild(dragNode);
        (0, _Utils.adjustSelectedIndex)(dragParent, fromIndex);
      }

      // if dropping a tab back to same tabset and moving to forward position then reduce insertion index
      if (dragNode.getType() === _TabNode["default"].TYPE && dragParent === this && fromIndex < index && index > 0) {
        index--;
      }

      // simple_bundled dock to existing tabset
      if (dockLocation === _DockLocation["default"].CENTER) {
        var insertPos = index;
        if (insertPos === -1) {
          insertPos = this._children.length;
        }
        if (dragNode.getType() === _TabNode["default"].TYPE) {
          this._addChild(dragNode, insertPos);
          if (select || select !== false && this.isAutoSelectTab()) {
            this._setSelected(insertPos);
          }
          // console.log("added child at : " + insertPos);
        } else {
          dragNode.getChildren().forEach(function (child, i) {
            _this3._addChild(child, insertPos);
            // console.log("added child at : " + insertPos);
            insertPos++;
          });
        }
        this._model._setActiveTabset(this);
      } else {
        var tabSet;
        if (dragNode instanceof _TabNode["default"]) {
          // create new tabset parent
          // console.log("create a new tabset");
          var callback = this._model._getOnCreateTabSet();
          tabSet = new TabSetNode(this._model, callback ? callback(dragNode) : {});
          tabSet._addChild(dragNode);
          // console.log("added child at end");
          dragParent = tabSet;
        } else {
          tabSet = dragNode;
        }
        var parentRow = this._parent;
        var pos = parentRow.getChildren().indexOf(this);
        if (parentRow.getOrientation() === dockLocation._orientation) {
          tabSet._setWeight(this.getWeight() / 2);
          this._setWeight(this.getWeight() / 2);
          // console.log("added child 50% size at: " +  pos + dockLocation.indexPlus);
          parentRow._addChild(tabSet, pos + dockLocation._indexPlus);
        } else {
          // create a new row to host the new tabset (it will go in the opposite direction)
          // console.log("create a new row");
          var newRow = new _RowNode["default"](this._model, {});
          newRow._setWeight(this.getWeight());
          newRow._addChild(this);
          this._setWeight(50);
          tabSet._setWeight(50);
          // console.log("added child 50% size at: " +  dockLocation.indexPlus);
          newRow._addChild(tabSet, dockLocation._indexPlus);
          parentRow._removeChild(this);
          parentRow._addChild(newRow, pos);
        }
        this._model._setActiveTabset(tabSet);
      }
      this._model._tidy();
    }

    /** @hidden @internal */
  }, {
    key: "_toJson",
    value: function _toJson() {
      var json = {};
      TabSetNode._attributeDefinitions.toJson(json, this._attributes);
      json.children = this._children.map(function (child) {
        return child._toJson();
      });
      if (this.isActive()) {
        json.active = true;
      }
      if (this.isMaximized()) {
        json.maximized = true;
      }
      return json;
    }

    /** @hidden @internal */
  }, {
    key: "_updateAttrs",
    value: function _updateAttrs(json) {
      TabSetNode._attributeDefinitions.update(json, this._attributes);
    }

    /** @hidden @internal */
  }, {
    key: "_getAttributeDefinitions",
    value: function _getAttributeDefinitions() {
      return TabSetNode._attributeDefinitions;
    }

    /** @hidden @internal */
  }, {
    key: "_getPrefSize",
    value: function _getPrefSize(orientation) {
      var prefSize = this.getWidth();
      if (orientation === _Orientation["default"].VERT) {
        prefSize = this.getHeight();
      }
      return prefSize;
    }

    /** @hidden @internal */
  }], [{
    key: "_fromJson",
    value: /** @hidden @internal */
    function _fromJson(json, model) {
      var newLayoutNode = new TabSetNode(model, json);
      if (json.children != null) {
        json.children.forEach(function (jsonChild) {
          var child = _TabNode["default"]._fromJson(jsonChild, model);
          newLayoutNode._addChild(child);
        });
      }
      if (json.maximized && json.maximized === true) {
        model._setMaximizedTabset(newLayoutNode);
      }
      if (json.active && json.active === true) {
        model._setActiveTabset(newLayoutNode);
      }
      return newLayoutNode;
    }
    /** @hidden @internal */
  }, {
    key: "_createAttributeDefinitions",
    value: /** @hidden @internal */
    function _createAttributeDefinitions() {
      var attributeDefinitions = new _AttributeDefinitions["default"]();
      attributeDefinitions.add("type", TabSetNode.TYPE, true).setType(_Attribute["default"].STRING).setFixed();
      attributeDefinitions.add("id", undefined).setType(_Attribute["default"].STRING);
      attributeDefinitions.add("weight", 100).setType(_Attribute["default"].NUMBER);
      attributeDefinitions.add("width", undefined).setType(_Attribute["default"].NUMBER);
      attributeDefinitions.add("height", undefined).setType(_Attribute["default"].NUMBER);
      attributeDefinitions.add("selected", 0).setType(_Attribute["default"].NUMBER);
      attributeDefinitions.add("name", undefined).setType(_Attribute["default"].STRING);
      attributeDefinitions.add("config", undefined).setType("any");
      attributeDefinitions.addInherited("enableDeleteWhenEmpty", "tabSetEnableDeleteWhenEmpty");
      attributeDefinitions.addInherited("enableDrop", "tabSetEnableDrop");
      attributeDefinitions.addInherited("enableDrag", "tabSetEnableDrag");
      attributeDefinitions.addInherited("enableDivide", "tabSetEnableDivide");
      attributeDefinitions.addInherited("enableMaximize", "tabSetEnableMaximize");
      attributeDefinitions.addInherited("classNameTabStrip", "tabSetClassNameTabStrip");
      attributeDefinitions.addInherited("classNameHeader", "tabSetClassNameHeader");
      attributeDefinitions.addInherited("enableTabStrip", "tabSetEnableTabStrip");
      attributeDefinitions.addInherited("borderInsets", "tabSetBorderInsets");
      attributeDefinitions.addInherited("marginInsets", "tabSetMarginInsets");
      attributeDefinitions.addInherited("minWidth", "tabSetMinWidth");
      attributeDefinitions.addInherited("minHeight", "tabSetMinHeight");
      attributeDefinitions.addInherited("headerHeight", "tabSetHeaderHeight");
      attributeDefinitions.addInherited("tabStripHeight", "tabSetTabStripHeight");
      attributeDefinitions.addInherited("tabLocation", "tabSetTabLocation");
      attributeDefinitions.addInherited("autoSelectTab", "tabSetAutoSelectTab").setType(_Attribute["default"].BOOLEAN);
      return attributeDefinitions;
    }
  }, {
    key: "getAttributeDefinitions",
    value: function getAttributeDefinitions() {
      return TabSetNode._attributeDefinitions;
    }
  }]);
}(_Node2["default"]);
_TabSetNode = TabSetNode;
_defineProperty(TabSetNode, "TYPE", "tabset");
_defineProperty(TabSetNode, "_attributeDefinitions", _TabSetNode._createAttributeDefinitions());
var _default = exports["default"] = TabSetNode;
//# sourceMappingURL=TabSetNode.js.map