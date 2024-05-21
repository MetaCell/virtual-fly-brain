"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _DockLocation = _interopRequireDefault(require("../DockLocation"));
var _Orientation = _interopRequireDefault(require("../Orientation"));
var _Rect = _interopRequireDefault(require("../Rect"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Node = /*#__PURE__*/function () {
  /** @hidden @internal */
  function Node(model) {
    _classCallCheck(this, Node);
    /** @hidden @internal */
    _defineProperty(this, "_model", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_attributes", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_parent", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_children", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_fixed", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_rect", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_visible", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_listeners", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_dirty", false);
    /** @hidden @internal */
    _defineProperty(this, "_tempSize", 0);
    this._model = model;
    this._attributes = {};
    this._children = [];
    this._fixed = false;
    this._rect = _Rect["default"].empty();
    this._visible = false;
    this._listeners = {};
  }
  return _createClass(Node, [{
    key: "getId",
    value: function getId() {
      var id = this._attributes.id;
      if (id !== undefined) {
        return id;
      }
      id = this._model._nextUniqueId();
      this._setId(id);
      return id;
    }
  }, {
    key: "getModel",
    value: function getModel() {
      return this._model;
    }
  }, {
    key: "getType",
    value: function getType() {
      return this._attributes.type;
    }
  }, {
    key: "getParent",
    value: function getParent() {
      return this._parent;
    }
  }, {
    key: "getChildren",
    value: function getChildren() {
      return this._children;
    }
  }, {
    key: "getRect",
    value: function getRect() {
      return this._rect;
    }
  }, {
    key: "isVisible",
    value: function isVisible() {
      return this._visible;
    }
  }, {
    key: "getOrientation",
    value: function getOrientation() {
      if (this._parent === undefined) {
        return this._model.isRootOrientationVertical() ? _Orientation["default"].VERT : _Orientation["default"].HORZ;
      } else {
        return _Orientation["default"].flip(this._parent.getOrientation());
      }
    }

    // event can be: resize, visibility, maximize (on tabset), close
  }, {
    key: "setEventListener",
    value: function setEventListener(event, callback) {
      this._listeners[event] = callback;
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(event) {
      delete this._listeners[event];
    }

    /** @hidden @internal */
  }, {
    key: "_setId",
    value: function _setId(id) {
      this._attributes.id = id;
    }

    /** @hidden @internal */
  }, {
    key: "_fireEvent",
    value: function _fireEvent(event, params) {
      // console.log(this._type, " fireEvent " + event + " " + JSON.stringify(params));
      if (this._listeners[event] !== undefined) {
        this._listeners[event](params);
      }
    }

    /** @hidden @internal */
  }, {
    key: "_getAttr",
    value: function _getAttr(name) {
      var val = this._attributes[name];
      if (val === undefined) {
        var modelName = this._getAttributeDefinitions().getModelName(name);
        if (modelName !== undefined) {
          val = this._model._getAttribute(modelName);
        }
      }

      // console.log(name + "=" + val);
      return val;
    }

    /** @hidden @internal */
  }, {
    key: "_forEachNode",
    value: function _forEachNode(fn, level) {
      fn(this, level);
      level++;
      this._children.forEach(function (node) {
        node._forEachNode(fn, level);
      });
    }

    /** @hidden @internal */
  }, {
    key: "_setVisible",
    value: function _setVisible(visible) {
      if (visible !== this._visible) {
        this._fireEvent("visibility", {
          visible: visible
        });
        this._visible = visible;
      }
    }

    /** @hidden @internal */
  }, {
    key: "_getDrawChildren",
    value: function _getDrawChildren() {
      return this._children;
    }

    /** @hidden @internal */
  }, {
    key: "_setParent",
    value: function _setParent(parent) {
      this._parent = parent;
    }

    /** @hidden @internal */
  }, {
    key: "_setRect",
    value: function _setRect(rect) {
      this._rect = rect;
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
    key: "_isFixed",
    value: function _isFixed() {
      return this._fixed;
    }

    /** @hidden @internal */
  }, {
    key: "_layout",
    value: function _layout(rect, metrics) {
      this._rect = rect;
    }

    /** @hidden @internal */
  }, {
    key: "_findDropTargetNode",
    value: function _findDropTargetNode(dragNode, x, y) {
      var rtn;
      if (this._rect.contains(x, y)) {
        rtn = this.canDrop(dragNode, x, y);
        if (rtn === undefined) {
          if (this._children.length !== 0) {
            var _iterator = _createForOfIteratorHelper(this._children),
              _step;
            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var child = _step.value;
                rtn = child._findDropTargetNode(dragNode, x, y);
                if (rtn !== undefined) {
                  break;
                }
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          }
        }
      }
      return rtn;
    }

    /** @hidden @internal */
  }, {
    key: "canDrop",
    value: function canDrop(dragNode, x, y) {
      return undefined;
    }

    /** @hidden @internal */
  }, {
    key: "_canDockInto",
    value: function _canDockInto(dragNode, dropInfo) {
      if (dropInfo != null) {
        if (dropInfo.location === _DockLocation["default"].CENTER && dropInfo.node.isEnableDrop() === false) {
          return false;
        }

        // prevent named tabset docking into another tabset, since this would lose the header
        if (dropInfo.location === _DockLocation["default"].CENTER && dragNode.getType() === "tabset" && dragNode.getName() !== undefined) {
          return false;
        }
        if (dropInfo.location !== _DockLocation["default"].CENTER && dropInfo.node.isEnableDivide() === false) {
          return false;
        }

        // finally check model callback to check if drop allowed
        if (this._model._getOnAllowDrop()) {
          return this._model._getOnAllowDrop()(dragNode, dropInfo);
        }
      }
      return true;
    }

    /** @hidden @internal */
  }, {
    key: "_removeChild",
    value: function _removeChild(childNode) {
      var pos = this._children.indexOf(childNode);
      if (pos !== -1) {
        this._children.splice(pos, 1);
      }
      this._dirty = true;
      return pos;
    }

    /** @hidden @internal */
  }, {
    key: "_addChild",
    value: function _addChild(childNode, pos) {
      if (pos != null) {
        this._children.splice(pos, 0, childNode);
      } else {
        this._children.push(childNode);
        pos = this._children.length - 1;
      }
      childNode._parent = this;
      this._dirty = true;
      return pos;
    }

    /** @hidden @internal */
  }, {
    key: "_removeAll",
    value: function _removeAll() {
      this._children = [];
      this._dirty = true;
    }

    /** @hidden @internal */
  }, {
    key: "_styleWithPosition",
    value: function _styleWithPosition(style) {
      if (style == null) {
        style = {};
      }
      // return this._rect.styleWithPosition(style);
      var tempStyle = this._rect.styleWithPosition(style);
      var sidesValue = this.getModel()._getAttribute("sideBorders");
      if (sidesValue != undefined && sidesValue > 0) {
        var tempWidth = tempStyle.width.replace('px', '');
        var tempLeft = tempStyle.left.replace('px', '');
        if (Number(tempWidth) + Number(tempLeft) >= window.innerWidth) {
          tempWidth = tempWidth - sidesValue * 2 + "px";
          tempStyle.width = tempWidth;
          return tempStyle;
        }
      }
      return tempStyle;
    }

    /** @hidden @internal */
  }, {
    key: "_getTempSize",
    value: function _getTempSize() {
      return this._tempSize;
    }

    /** @hidden @internal */
  }, {
    key: "_setTempSize",
    value: function _setTempSize(value) {
      this._tempSize = value;
    }

    /** @hidden @internal */
  }, {
    key: "isEnableDivide",
    value: function isEnableDivide() {
      return true;
    }

    /** @hidden @internal */
  }, {
    key: "_toAttributeString",
    value: function _toAttributeString() {
      return JSON.stringify(this._attributes, undefined, "\t");
    }

    // implemented by subclasses
    /** @hidden @internal */
  }]);
}();
var _default = exports["default"] = Node;
//# sourceMappingURL=Node.js.map