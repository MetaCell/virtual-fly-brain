"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Attribute = _interopRequireDefault(require("../Attribute"));
var _AttributeDefinitions = _interopRequireDefault(require("../AttributeDefinitions"));
var _DockLocation = _interopRequireDefault(require("../DockLocation"));
var _Orientation = _interopRequireDefault(require("../Orientation"));
var _Rect = _interopRequireDefault(require("../Rect"));
var _Actions = _interopRequireDefault(require("./Actions"));
var _BorderNode = _interopRequireDefault(require("./BorderNode"));
var _BorderSet = _interopRequireDefault(require("./BorderSet"));
var _RowNode = _interopRequireDefault(require("./RowNode"));
var _TabNode = _interopRequireDefault(require("./TabNode"));
var _TabSetNode = _interopRequireDefault(require("./TabSetNode"));
var _Utils = require("./Utils");
var _Model;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/** @hidden @internal */
/**
 * Class containing the Tree of Nodes used by the FlexLayout component
 */
var Model = /*#__PURE__*/function () {
  /**
   * 'private' constructor. Use the static method Model.fromJson(json) to create a model
   *  @hidden @internal
   */

  function Model() {
    _classCallCheck(this, Model);
    /** @hidden @internal */
    _defineProperty(this, "_attributes", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_idMap", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_nextId", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_changeListener", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_root", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_borders", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_onAllowDrop", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_maximizedTabSet", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_activeTabSet", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_borderRects", {
      inner: _Rect["default"].empty(),
      outer: _Rect["default"].empty()
    });
    /** @hidden @internal */
    _defineProperty(this, "_pointerFine", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_onCreateTabSet", void 0);
    this._attributes = {};
    this._idMap = {};
    this._nextId = 0;
    this._borders = new _BorderSet["default"](this);
    this._pointerFine = true;
  }

  /** @hidden @internal */
  return _createClass(Model, [{
    key: "_setChangeListener",
    value: function _setChangeListener(listener) {
      this._changeListener = listener;
    }

    /**
     * Get the currently active tabset node
     */
  }, {
    key: "getActiveTabset",
    value: function getActiveTabset() {
      if (this._activeTabSet && this.getNodeById(this._activeTabSet.getId())) {
        return this._activeTabSet;
      } else {
        return undefined;
      }
    }

    /** @hidden @internal */
  }, {
    key: "_setActiveTabset",
    value: function _setActiveTabset(tabsetNode) {
      this._activeTabSet = tabsetNode;
    }

    /**
     * Get the currently maximized tabset node
     */
  }, {
    key: "getMaximizedTabset",
    value: function getMaximizedTabset() {
      return this._maximizedTabSet;
    }

    /** @hidden @internal */
  }, {
    key: "_setMaximizedTabset",
    value: function _setMaximizedTabset(tabsetNode) {
      this._maximizedTabSet = tabsetNode;
    }

    /**
     * Gets the root RowNode of the model
     * @returns {RowNode}
     */
  }, {
    key: "getRoot",
    value: function getRoot() {
      return this._root;
    }
  }, {
    key: "isRootOrientationVertical",
    value: function isRootOrientationVertical() {
      return this._attributes.rootOrientationVertical;
    }

    /**
     * Gets the
     * @returns {BorderSet|*}
     */
  }, {
    key: "getBorderSet",
    value: function getBorderSet() {
      return this._borders;
    }

    /** @hidden @internal */
  }, {
    key: "_getOuterInnerRects",
    value: function _getOuterInnerRects() {
      return this._borderRects;
    }

    /** @hidden @internal */
  }, {
    key: "_getPointerFine",
    value: function _getPointerFine() {
      return this._pointerFine;
    }

    /** @hidden @internal */
  }, {
    key: "_setPointerFine",
    value: function _setPointerFine(pointerFine) {
      this._pointerFine = pointerFine;
    }

    /**
     * Visits all the nodes in the model and calls the given function for each
     * @param fn a function that takes visited node and a integer level as parameters
     */
  }, {
    key: "visitNodes",
    value: function visitNodes(fn) {
      this._borders._forEachNode(fn);
      this._root._forEachNode(fn, 0);
    }

    /**
     * Gets a node by its id
     * @param id the id to find
     */
  }, {
    key: "getNodeById",
    value: function getNodeById(id) {
      return this._idMap[id];
    }

    /**
     * Update the node tree by performing the given action,
     * Actions should be generated via static methods on the Actions class
     * @param action the action to perform
     * @returns added Node for Actions.addNode; undefined otherwise
     */
  }, {
    key: "doAction",
    value: function doAction(action) {
      var returnVal = undefined;
      // console.log(action);
      switch (action.type) {
        case _Actions["default"].ADD_NODE:
          {
            var newNode = new _TabNode["default"](this, action.data.json, true);
            var toNode = this._idMap[action.data.toNode];
            if (toNode instanceof _TabSetNode["default"] || toNode instanceof _BorderNode["default"] || toNode instanceof _RowNode["default"]) {
              toNode.drop(newNode, _DockLocation["default"].getByName(action.data.location), action.data.index, action.data.select);
              returnVal = newNode;
            }
            break;
          }
        case _Actions["default"].MOVE_NODE:
          {
            var fromNode = this._idMap[action.data.fromNode];
            if (fromNode instanceof _TabNode["default"] || fromNode instanceof _TabSetNode["default"]) {
              var _toNode = this._idMap[action.data.toNode];
              if (_toNode instanceof _TabSetNode["default"] || _toNode instanceof _BorderNode["default"] || _toNode instanceof _RowNode["default"]) {
                _toNode.drop(fromNode, _DockLocation["default"].getByName(action.data.location), action.data.index, action.data.select);
              }
            }
            break;
          }
        case _Actions["default"].DELETE_TAB:
          {
            var node = this._idMap[action.data.node];
            if (node instanceof _TabNode["default"]) {
              delete this._idMap[action.data.node];
              node._delete();
            }
            break;
          }
        case _Actions["default"].FLOAT_TAB:
          {
            var _node = this._idMap[action.data.node];
            if (_node instanceof _TabNode["default"]) {
              _node._setFloating(true);
              (0, _Utils.adjustSelectedIndexAfterFloat)(_node);
            }
            break;
          }
        case _Actions["default"].UNFLOAT_TAB:
          {
            var _node2 = this._idMap[action.data.node];
            if (_node2 instanceof _TabNode["default"]) {
              _node2._setFloating(false);
              (0, _Utils.adjustSelectedIndexAfterDock)(_node2);
            }
            break;
          }
        case _Actions["default"].RENAME_TAB:
          {
            var _node3 = this._idMap[action.data.node];
            if (_node3 instanceof _TabNode["default"]) {
              _node3._setName(action.data.text);
            }
            break;
          }
        case _Actions["default"].SELECT_TAB:
          {
            var tabNode = this._idMap[action.data.tabNode];
            if (tabNode instanceof _TabNode["default"]) {
              var parent = tabNode.getParent();
              var pos = parent.getChildren().indexOf(tabNode);
              if (parent instanceof _BorderNode["default"]) {
                if (parent.getSelected() === pos) {
                  parent._setSelected(-1);
                } else {
                  parent._setSelected(pos);
                }
              } else if (parent instanceof _TabSetNode["default"]) {
                if (parent.getSelected() !== pos) {
                  parent._setSelected(pos);
                }
                this._activeTabSet = parent;
              }
            }
            break;
          }
        case _Actions["default"].SET_ACTIVE_TABSET:
          {
            var tabsetNode = this._idMap[action.data.tabsetNode];
            if (tabsetNode instanceof _TabSetNode["default"]) {
              this._activeTabSet = tabsetNode;
            }
            break;
          }
        case _Actions["default"].ADJUST_SPLIT:
          {
            var node1 = this._idMap[action.data.node1];
            var node2 = this._idMap[action.data.node2];
            if ((node1 instanceof _TabSetNode["default"] || node1 instanceof _RowNode["default"]) && (node2 instanceof _TabSetNode["default"] || node2 instanceof _RowNode["default"])) {
              this._adjustSplitSide(node1, action.data.weight1, action.data.pixelWidth1);
              this._adjustSplitSide(node2, action.data.weight2, action.data.pixelWidth2);
            }
            break;
          }
        case _Actions["default"].ADJUST_BORDER_SPLIT:
          {
            var _node4 = this._idMap[action.data.node];
            if (_node4 instanceof _BorderNode["default"]) {
              _node4._setSize(action.data.pos);
            }
            break;
          }
        case _Actions["default"].MAXIMIZE_TOGGLE:
          {
            var _node5 = this._idMap[action.data.node];
            if (_node5 instanceof _TabSetNode["default"]) {
              if (_node5 === this._maximizedTabSet) {
                this._maximizedTabSet = undefined;
              } else {
                this._maximizedTabSet = _node5;
                this._activeTabSet = _node5;
              }
            }
            break;
          }
        case _Actions["default"].UPDATE_MODEL_ATTRIBUTES:
          {
            this._updateAttrs(action.data.json);
            break;
          }
        case _Actions["default"].UPDATE_NODE_ATTRIBUTES:
          {
            var _node6 = this._idMap[action.data.node];
            _node6._updateAttrs(action.data.json);
            break;
          }
        default:
          break;
      }
      this._updateIdMap();
      if (this._changeListener !== undefined) {
        this._changeListener();
      }
      return returnVal;
    }

    /** @hidden @internal */
  }, {
    key: "_updateIdMap",
    value: function _updateIdMap() {
      var _this = this;
      // regenerate idMap to stop it building up
      this._idMap = {};
      this.visitNodes(function (node) {
        return _this._idMap[node.getId()] = node;
      });
      // console.log(JSON.stringify(Object.keys(this._idMap)));
    }

    /** @hidden @internal */
  }, {
    key: "_adjustSplitSide",
    value: function _adjustSplitSide(node, weight, pixels) {
      node._setWeight(weight);
      if (node.getWidth() != null && node.getOrientation() === _Orientation["default"].VERT) {
        node._updateAttrs({
          width: pixels
        });
      } else if (node.getHeight() != null && node.getOrientation() === _Orientation["default"].HORZ) {
        node._updateAttrs({
          height: pixels
        });
      }
    }

    /**
     * Converts the model to a json object
     * @returns {IJsonModel} json object that represents this model
     */
  }, {
    key: "toJson",
    value: function toJson() {
      var json = {
        global: {},
        layout: {}
      };
      Model._attributeDefinitions.toJson(json.global, this._attributes);

      // save state of nodes
      this.visitNodes(function (node) {
        node._fireEvent("save", undefined);
      });
      json.borders = this._borders._toJson();
      json.layout = this._root._toJson();
      return json;
    }
  }, {
    key: "getSplitterSize",
    value: function getSplitterSize() {
      var splitterSize = this._attributes.splitterSize;
      if (splitterSize === -1) {
        // use defaults
        splitterSize = this._pointerFine ? 8 : 12; // larger for mobile
      }
      return splitterSize;
    }
  }, {
    key: "isEnableEdgeDock",
    value: function isEnableEdgeDock() {
      return this._attributes.enableEdgeDock;
    }

    /** @hidden @internal */
  }, {
    key: "_addNode",
    value: function _addNode(node) {
      var id = node.getId();
      if (this._idMap[id] !== undefined) {
        throw new Error("Error: each node must have a unique id, duplicate id:".concat(node.getId()));
      }
      if (node.getType() !== "splitter") {
        this._idMap[id] = node;
      }
    }

    /** @hidden @internal */
  }, {
    key: "_layout",
    value: function _layout(rect, metrics) {
      var _this$_root;
      // let start = Date.now();
      this._borderRects = this._borders._layoutBorder({
        outer: rect,
        inner: rect
      }, metrics);
      rect = this._borderRects.inner.removeInsets(this._getAttribute("marginInsets"));
      (_this$_root = this._root) === null || _this$_root === void 0 || _this$_root.calcMinSize();
      this._root._layout(rect, metrics);
      // console.log("layout time: " + (Date.now() - start));
      return rect;
    }

    /** @hidden @internal */
  }, {
    key: "_findDropTargetNode",
    value: function _findDropTargetNode(dragNode, x, y) {
      var node = this._root._findDropTargetNode(dragNode, x, y);
      if (node === undefined) {
        node = this._borders._findDropTargetNode(dragNode, x, y);
      }
      return node;
    }

    /** @hidden @internal */
  }, {
    key: "_tidy",
    value: function _tidy() {
      // console.log("before _tidy", this.toString());
      this._root._tidy();
      // console.log("after _tidy", this.toString());
    }

    /** @hidden @internal */
  }, {
    key: "_updateAttrs",
    value: function _updateAttrs(json) {
      Model._attributeDefinitions.update(json, this._attributes);
    }

    /** @hidden @internal */
  }, {
    key: "_nextUniqueId",
    value: function _nextUniqueId() {
      this._nextId++;
      while (this._idMap["#" + this._nextId] !== undefined) {
        this._nextId++;
      }
      return "#" + this._nextId;
    }

    /** @hidden @internal */
  }, {
    key: "_getAttribute",
    value: function _getAttribute(name) {
      return this._attributes[name];
    }

    /**
     * Sets a function to allow/deny dropping a node
     * @param onAllowDrop function that takes the drag node and DropInfo and returns true if the drop is allowed
     */
  }, {
    key: "setOnAllowDrop",
    value: function setOnAllowDrop(onAllowDrop) {
      this._onAllowDrop = onAllowDrop;
    }

    /** @hidden @internal */
  }, {
    key: "_getOnAllowDrop",
    value: function _getOnAllowDrop() {
      return this._onAllowDrop;
    }

    /**
     * set callback called when a new TabSet is created.
     * The tabNode can be undefined if it's the auto created first tabset in the root row (when the last
     * tab is deleted, the root tabset can be recreated)
     * @param onCreateTabSet 
     */
  }, {
    key: "setOnCreateTabSet",
    value: function setOnCreateTabSet(onCreateTabSet) {
      this._onCreateTabSet = onCreateTabSet;
    }

    /** @hidden @internal */
  }, {
    key: "_getOnCreateTabSet",
    value: function _getOnCreateTabSet() {
      return this._onCreateTabSet;
    }
  }, {
    key: "toString",
    value: function toString() {
      return JSON.stringify(this.toJson());
    }
  }], [{
    key: "fromJson",
    value:
    /**
     * Loads the model from the given json object
     * @param json the json model to load
     * @returns {Model} a new Model object
     */
    function fromJson(json) {
      var model = new Model();
      Model._attributeDefinitions.fromJson(json.global, model._attributes);
      if (json.borders) {
        model._borders = _BorderSet["default"]._fromJson(json.borders, model);
      }
      model._root = _RowNode["default"]._fromJson(json.layout, model);
      model._tidy(); // initial tidy of node tree
      return model;
    }
    /** @hidden @internal */
  }, {
    key: "_createAttributeDefinitions",
    value: /** @hidden @internal */
    function _createAttributeDefinitions() {
      var attributeDefinitions = new _AttributeDefinitions["default"]();
      // splitter
      attributeDefinitions.add("splitterSize", -1).setType(_Attribute["default"].NUMBER);
      attributeDefinitions.add("enableEdgeDock", true).setType(_Attribute["default"].BOOLEAN);
      attributeDefinitions.add("rootOrientationVertical", false).setType(_Attribute["default"].BOOLEAN);
      attributeDefinitions.add("marginInsets", {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }).setType("IInsets");

      // tab
      attributeDefinitions.add("tabEnableClose", true).setType(_Attribute["default"].BOOLEAN);
      attributeDefinitions.add("tabCloseType", 1).setType("ICloseType");
      attributeDefinitions.add("tabEnableFloat", false).setType(_Attribute["default"].BOOLEAN);
      attributeDefinitions.add("tabEnableDrag", true).setType(_Attribute["default"].BOOLEAN);
      attributeDefinitions.add("tabEnableRename", true).setType(_Attribute["default"].BOOLEAN);
      attributeDefinitions.add("tabClassName", undefined).setType(_Attribute["default"].STRING);
      attributeDefinitions.add("tabIcon", undefined).setType(_Attribute["default"].STRING);
      attributeDefinitions.add("tabEnableRenderOnDemand", true).setType(_Attribute["default"].BOOLEAN);
      attributeDefinitions.add("tabDragSpeed", 0.3).setType(_Attribute["default"].NUMBER);

      // tabset
      attributeDefinitions.add("tabSetEnableDeleteWhenEmpty", true).setType(_Attribute["default"].BOOLEAN);
      attributeDefinitions.add("tabSetEnableDrop", true).setType(_Attribute["default"].BOOLEAN);
      attributeDefinitions.add("tabSetEnableDrag", true).setType(_Attribute["default"].BOOLEAN);
      attributeDefinitions.add("tabSetEnableDivide", true).setType(_Attribute["default"].BOOLEAN);
      attributeDefinitions.add("tabSetEnableMaximize", true).setType(_Attribute["default"].BOOLEAN);
      attributeDefinitions.add("tabSetAutoSelectTab", true).setType(_Attribute["default"].BOOLEAN);
      attributeDefinitions.add("tabSetClassNameTabStrip", undefined).setType(_Attribute["default"].STRING);
      attributeDefinitions.add("tabSetClassNameHeader", undefined).setType(_Attribute["default"].STRING);
      attributeDefinitions.add("tabSetEnableTabStrip", true).setType(_Attribute["default"].BOOLEAN);
      attributeDefinitions.add("tabSetHeaderHeight", 0).setType(_Attribute["default"].NUMBER);
      attributeDefinitions.add("tabSetTabStripHeight", 0).setType(_Attribute["default"].NUMBER);
      attributeDefinitions.add("tabSetMarginInsets", {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }).setType("IInsets");
      attributeDefinitions.add("tabSetBorderInsets", {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }).setType("IInsets");
      attributeDefinitions.add("tabSetTabLocation", "top").setType("ITabLocation");
      attributeDefinitions.add("tabSetMinWidth", 0).setType(_Attribute["default"].NUMBER);
      attributeDefinitions.add("tabSetMinHeight", 0).setType(_Attribute["default"].NUMBER);

      // border
      attributeDefinitions.add("borderSize", 200).setType(_Attribute["default"].NUMBER);
      attributeDefinitions.add("borderMinSize", 0).setType(_Attribute["default"].NUMBER);
      attributeDefinitions.add("borderBarSize", 0).setType(_Attribute["default"].NUMBER);
      attributeDefinitions.add("borderEnableDrop", true).setType(_Attribute["default"].BOOLEAN);
      attributeDefinitions.add("borderAutoSelectTabWhenOpen", true).setType(_Attribute["default"].BOOLEAN);
      attributeDefinitions.add("borderAutoSelectTabWhenClosed", false).setType(_Attribute["default"].BOOLEAN);
      attributeDefinitions.add("borderClassName", undefined).setType(_Attribute["default"].STRING);
      return attributeDefinitions;
    }
  }, {
    key: "toTypescriptInterfaces",
    value: function toTypescriptInterfaces() {
      console.log(Model._attributeDefinitions.toTypescriptInterface("Global", undefined));
      console.log(_RowNode["default"].getAttributeDefinitions().toTypescriptInterface("Row", Model._attributeDefinitions));
      console.log(_TabSetNode["default"].getAttributeDefinitions().toTypescriptInterface("TabSet", Model._attributeDefinitions));
      console.log(_TabNode["default"].getAttributeDefinitions().toTypescriptInterface("Tab", Model._attributeDefinitions));
      console.log(_BorderNode["default"].getAttributeDefinitions().toTypescriptInterface("Border", Model._attributeDefinitions));
    }
  }]);
}();
_Model = Model;
_defineProperty(Model, "_attributeDefinitions", _Model._createAttributeDefinitions());
var _default = exports["default"] = Model;
//# sourceMappingURL=Model.js.map