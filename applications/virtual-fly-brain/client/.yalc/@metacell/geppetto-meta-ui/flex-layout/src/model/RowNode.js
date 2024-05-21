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
var _BorderNode = _interopRequireDefault(require("./BorderNode"));
var _Node2 = _interopRequireDefault(require("./Node"));
var _SplitterNode = _interopRequireDefault(require("./SplitterNode"));
var _TabSetNode = _interopRequireDefault(require("./TabSetNode"));
var _RowNode;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var RowNode = /*#__PURE__*/function (_Node) {
  /** @hidden @internal */
  function RowNode(model, json) {
    var _this;
    _classCallCheck(this, RowNode);
    _this = _callSuper(this, RowNode, [model]);
    /** @hidden @internal */
    _defineProperty(_this, "_drawChildren", void 0);
    _defineProperty(_this, "minHeight", void 0);
    _defineProperty(_this, "minWidth", void 0);
    _this._dirty = true;
    _this._drawChildren = [];
    _this.minHeight = 0;
    _this.minWidth = 0;
    RowNode._attributeDefinitions.fromJson(json, _this._attributes);
    model._addNode(_this);
    return _this;
  }
  _inherits(RowNode, _Node);
  return _createClass(RowNode, [{
    key: "getWeight",
    value: function getWeight() {
      return this._attributes.weight;
    }
  }, {
    key: "getWidth",
    value: function getWidth() {
      return this._getAttr("width");
    }
  }, {
    key: "getHeight",
    value: function getHeight() {
      return this._getAttr("height");
    }

    /** @hidden @internal */
  }, {
    key: "_setWeight",
    value: function _setWeight(weight) {
      this._attributes.weight = weight;
    }

    /** @hidden @internal */
  }, {
    key: "_layout",
    value: function _layout(rect, metrics) {
      _get(_getPrototypeOf(RowNode.prototype), "_layout", this).call(this, rect, metrics);
      var pixelSize = this._rect._getSize(this.getOrientation());
      var totalWeight = 0;
      var fixedPixels = 0;
      var prefPixels = 0;
      var totalPrefWeight = 0;
      var drawChildren = this._getDrawChildren();
      var _iterator = _createForOfIteratorHelper(drawChildren),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _child3 = _step.value;
          var _prefSize = _child3._getPrefSize(this.getOrientation());
          if (_child3._isFixed()) {
            if (_prefSize !== undefined) {
              fixedPixels += _prefSize;
            }
          } else {
            if (_prefSize === undefined) {
              totalWeight += _child3.getWeight();
            } else {
              prefPixels += _prefSize;
              totalPrefWeight += _child3.getWeight();
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var resizePreferred = false;
      var availablePixels = pixelSize - fixedPixels - prefPixels;
      if (availablePixels < 0) {
        availablePixels = pixelSize - fixedPixels;
        resizePreferred = true;
        totalWeight += totalPrefWeight;
      }
      // assign actual pixel sizes
      var totalSizeGiven = 0;
      var variableSize = 0;
      var _iterator2 = _createForOfIteratorHelper(drawChildren),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _child4 = _step2.value;
          var _prefSize2 = _child4._getPrefSize(this.getOrientation());
          if (_child4._isFixed()) {
            if (_prefSize2 !== undefined) {
              _child4._setTempSize(_prefSize2);
            }
          } else {
            if (_prefSize2 == null || resizePreferred) {
              if (totalWeight === 0) {
                _child4._setTempSize(0);
              } else {
                var _minSize = _child4.getMinSize(this.getOrientation());
                var _size2 = Math.floor(availablePixels * (_child4.getWeight() / totalWeight));
                _child4._setTempSize(Math.max(_minSize, _size2));
              }
              variableSize += _child4._getTempSize();
            } else {
              _child4._setTempSize(_prefSize2);
            }
          }
          totalSizeGiven += _child4._getTempSize();
        }

        // adjust sizes to exactly fit
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      if (variableSize > 0) {
        while (totalSizeGiven < pixelSize) {
          var _iterator3 = _createForOfIteratorHelper(drawChildren),
            _step3;
          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var child = _step3.value;
              if (!(child instanceof _SplitterNode["default"])) {
                var prefSize = child._getPrefSize(this.getOrientation());
                if (!child._isFixed() && (prefSize === undefined || resizePreferred) && totalSizeGiven < pixelSize) {
                  child._setTempSize(child._getTempSize() + 1);
                  totalSizeGiven++;
                }
              }
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
        }

        // decrease size using nodes not at there minimum
        while (totalSizeGiven > pixelSize) {
          var changed = false;
          var _iterator4 = _createForOfIteratorHelper(drawChildren),
            _step4;
          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var _child = _step4.value;
              if (!(_child instanceof _SplitterNode["default"])) {
                var minSize = _child.getMinSize(this.getOrientation());
                var size = _child._getTempSize();
                if (size > minSize && totalSizeGiven > pixelSize) {
                  _child._setTempSize(_child._getTempSize() - 1);
                  totalSizeGiven--;
                  changed = true;
                }
              }
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }
          if (!changed) {
            // all children are at min values
            break;
          }
        }

        // if still too big then simply reduce all nodes until fits
        while (totalSizeGiven > pixelSize) {
          var _changed = false;
          var _iterator5 = _createForOfIteratorHelper(drawChildren),
            _step5;
          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var _child2 = _step5.value;
              if (!(_child2 instanceof _SplitterNode["default"])) {
                var _size = _child2._getTempSize();
                if (_size > 0 && totalSizeGiven > pixelSize) {
                  _child2._setTempSize(_child2._getTempSize() - 1);
                  totalSizeGiven--;
                  _changed = true;
                }
              }
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }
          if (!_changed) {
            // all children are at 0 values
            break;
          }
        }
      }

      // layout children
      var p = 0;
      var _iterator6 = _createForOfIteratorHelper(drawChildren),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var _child5 = _step6.value;
          if (this.getOrientation() === _Orientation["default"].HORZ) {
            _child5._layout(new _Rect["default"](this._rect.x + p, this._rect.y, _child5._getTempSize(), this._rect.height), metrics);
          } else {
            _child5._layout(new _Rect["default"](this._rect.x, this._rect.y + p, this._rect.width, _child5._getTempSize()), metrics);
          }
          p += _child5._getTempSize();
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
      return true;
    }

    /** @hidden @internal */
  }, {
    key: "_getSplitterBounds",
    value: function _getSplitterBounds(splitterNode) {
      var useMinSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var pBounds = [0, 0];
      var drawChildren = this._getDrawChildren();
      var p = drawChildren.indexOf(splitterNode);
      var node1 = drawChildren[p - 1];
      var node2 = drawChildren[p + 1];
      if (this.getOrientation() === _Orientation["default"].HORZ) {
        var minSize1 = useMinSize ? node1.getMinWidth() : 0;
        var minSize2 = useMinSize ? node2.getMinWidth() : 0;
        pBounds[0] = node1.getRect().x + minSize1;
        pBounds[1] = node2.getRect().getRight() - splitterNode.getWidth() - minSize2;
      } else {
        var _minSize2 = useMinSize ? node1.getMinHeight() : 0;
        var _minSize3 = useMinSize ? node2.getMinHeight() : 0;
        pBounds[0] = node1.getRect().y + _minSize2;
        pBounds[1] = node2.getRect().getBottom() - splitterNode.getHeight() - _minSize3;
      }
      return pBounds;
    }

    /** @hidden @internal */
  }, {
    key: "_calculateSplit",
    value: function _calculateSplit(splitter, splitterPos) {
      var rtn;
      var drawChildren = this._getDrawChildren();
      var p = drawChildren.indexOf(splitter);
      var pBounds = this._getSplitterBounds(splitter);
      var weightedLength = drawChildren[p - 1].getWeight() + drawChildren[p + 1].getWeight();
      var pixelWidth1 = Math.max(0, splitterPos - pBounds[0]);
      var pixelWidth2 = Math.max(0, pBounds[1] - splitterPos);
      if (pixelWidth1 + pixelWidth2 > 0) {
        var weight1 = pixelWidth1 * weightedLength / (pixelWidth1 + pixelWidth2);
        var weight2 = pixelWidth2 * weightedLength / (pixelWidth1 + pixelWidth2);
        rtn = {
          node1Id: drawChildren[p - 1].getId(),
          weight1: weight1,
          pixelWidth1: pixelWidth1,
          node2Id: drawChildren[p + 1].getId(),
          weight2: weight2,
          pixelWidth2: pixelWidth2
        };
      }
      return rtn;
    }

    /** @hidden @internal */
  }, {
    key: "_getDrawChildren",
    value: function _getDrawChildren() {
      if (this._dirty) {
        this._drawChildren = [];
        for (var i = 0; i < this._children.length; i++) {
          var child = this._children[i];
          if (i !== 0) {
            var newSplitter = new _SplitterNode["default"](this._model);
            newSplitter._setParent(this);
            this._drawChildren.push(newSplitter);
          }
          this._drawChildren.push(child);
        }
        this._dirty = false;
      }
      return this._drawChildren;
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
    key: "getMinWidth",
    value: function getMinWidth() {
      return this.minWidth;
    }

    /** @hidden @internal */
  }, {
    key: "getMinHeight",
    value: function getMinHeight() {
      return this.minHeight;
    }

    /** @hidden @internal */
  }, {
    key: "calcMinSize",
    value: function calcMinSize() {
      var _this2 = this;
      this.minHeight = 0;
      this.minWidth = 0;
      var first = true;
      this._children.forEach(function (child) {
        var c = child;
        if (c instanceof RowNode) {
          c.calcMinSize();
        }
        if (_this2.getOrientation() === _Orientation["default"].VERT) {
          _this2.minHeight += c.getMinHeight();
          if (!first) {
            _this2.minHeight += _this2._model.getSplitterSize();
          }
          _this2.minWidth = Math.max(_this2.minWidth, c.getMinWidth());
        } else {
          _this2.minWidth += c.getMinWidth();
          if (!first) {
            _this2.minWidth += _this2._model.getSplitterSize();
          }
          _this2.minHeight = Math.max(_this2.minHeight, c.getMinHeight());
        }
        first = false;
      });
    }

    /** @hidden @internal */
  }, {
    key: "_tidy",
    value: function _tidy() {
      var i = 0;
      while (i < this._children.length) {
        var child = this._children[i];
        if (child instanceof RowNode) {
          child._tidy();
          var childChildren = child.getChildren();
          if (childChildren.length === 0) {
            this._removeChild(child);
          } else if (childChildren.length === 1) {
            // hoist child/children up to this level
            var subchild = childChildren[0];
            this._removeChild(child);
            if (subchild instanceof RowNode) {
              var subChildrenTotal = 0;
              var subChildChildren = subchild.getChildren();
              var _iterator7 = _createForOfIteratorHelper(subChildChildren),
                _step7;
              try {
                for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                  var ssc = _step7.value;
                  var _subsubChild = ssc;
                  subChildrenTotal += _subsubChild.getWeight();
                }
              } catch (err) {
                _iterator7.e(err);
              } finally {
                _iterator7.f();
              }
              for (var j = 0; j < subChildChildren.length; j++) {
                var subsubChild = subChildChildren[j];
                subsubChild._setWeight(child.getWeight() * subsubChild.getWeight() / subChildrenTotal);
                this._addChild(subsubChild, i + j);
              }
            } else {
              subchild._setWeight(child.getWeight());
              this._addChild(subchild, i);
            }
          } else {
            i++;
          }
        } else if (child instanceof _TabSetNode["default"] && child.getChildren().length === 0) {
          if (child.isEnableDeleteWhenEmpty()) {
            this._removeChild(child);
            if (child === this._model.getMaximizedTabset()) {
              this._model._setMaximizedTabset(undefined);
            }
          } else {
            i++;
          }
        } else {
          i++;
        }
      }

      // add tabset into empty root
      if (this === this._model.getRoot() && this._children.length === 0) {
        var callback = this._model._getOnCreateTabSet();
        var _child6 = new _TabSetNode["default"](this._model, callback ? callback() : {});
        this._model._setActiveTabset(_child6);
        this._addChild(_child6);
      }
    }

    /** @hidden @internal */
  }, {
    key: "canDrop",
    value: function canDrop(dragNode, x, y) {
      var yy = y - this._rect.y;
      var xx = x - this._rect.x;
      var w = this._rect.width;
      var h = this._rect.height;
      var margin = 10; // height of edge rect
      var half = 50; // half width of edge rect
      var dropInfo;
      if (this._model.isEnableEdgeDock() && this._parent === undefined) {
        // _root row
        if (x < this._rect.x + margin && yy > h / 2 - half && yy < h / 2 + half) {
          var dockLocation = _DockLocation["default"].LEFT;
          var outlineRect = dockLocation.getDockRect(this._rect);
          outlineRect.width = outlineRect.width / 2;
          dropInfo = new _DropInfo["default"](this, outlineRect, dockLocation, -1, "flexlayout__outline_rect_edge");
        } else if (x > this._rect.getRight() - margin && yy > h / 2 - half && yy < h / 2 + half) {
          var _dockLocation = _DockLocation["default"].RIGHT;
          var _outlineRect = _dockLocation.getDockRect(this._rect);
          _outlineRect.width = _outlineRect.width / 2;
          _outlineRect.x += _outlineRect.width;
          dropInfo = new _DropInfo["default"](this, _outlineRect, _dockLocation, -1, "flexlayout__outline_rect_edge");
        } else if (y < this._rect.y + margin && xx > w / 2 - half && xx < w / 2 + half) {
          var _dockLocation2 = _DockLocation["default"].TOP;
          var _outlineRect2 = _dockLocation2.getDockRect(this._rect);
          _outlineRect2.height = _outlineRect2.height / 2;
          dropInfo = new _DropInfo["default"](this, _outlineRect2, _dockLocation2, -1, "flexlayout__outline_rect_edge");
        } else if (y > this._rect.getBottom() - margin && xx > w / 2 - half && xx < w / 2 + half) {
          var _dockLocation3 = _DockLocation["default"].BOTTOM;
          var _outlineRect3 = _dockLocation3.getDockRect(this._rect);
          _outlineRect3.height = _outlineRect3.height / 2;
          _outlineRect3.y += _outlineRect3.height;
          dropInfo = new _DropInfo["default"](this, _outlineRect3, _dockLocation3, -1, "flexlayout__outline_rect_edge");
        }
        if (dropInfo !== undefined) {
          if (!dragNode._canDockInto(dragNode, dropInfo)) {
            return undefined;
          }
        }
      }
      return dropInfo;
    }

    /** @hidden @internal */
  }, {
    key: "drop",
    value: function drop(dragNode, location, index) {
      var dockLocation = location;
      var parent = dragNode.getParent();
      if (parent) {
        parent._removeChild(dragNode);
      }
      if (parent !== undefined && parent.getType() === _TabSetNode["default"].TYPE) {
        parent._setSelected(0);
      }
      if (parent !== undefined && parent.getType() === _BorderNode["default"].TYPE) {
        parent._setSelected(-1);
      }
      var tabSet;
      if (dragNode instanceof _TabSetNode["default"]) {
        tabSet = dragNode;
      } else {
        var callback = this._model._getOnCreateTabSet();
        tabSet = new _TabSetNode["default"](this._model, callback ? callback(dragNode) : {});
        tabSet._addChild(dragNode);
      }
      var size = this._children.reduce(function (sum, child) {
        return sum + child.getWeight();
      }, 0);
      if (size === 0) {
        size = 100;
      }
      tabSet._setWeight(size / 3);
      var horz = !this._model.isRootOrientationVertical();
      if (horz && dockLocation === _DockLocation["default"].LEFT || !horz && dockLocation === _DockLocation["default"].TOP) {
        this._addChild(tabSet, 0);
      } else if (horz && dockLocation === _DockLocation["default"].RIGHT || !horz && dockLocation === _DockLocation["default"].BOTTOM) {
        this._addChild(tabSet);
      } else if (horz && dockLocation === _DockLocation["default"].TOP || !horz && dockLocation === _DockLocation["default"].LEFT) {
        var vrow = new RowNode(this._model, {});
        var hrow = new RowNode(this._model, {});
        hrow._setWeight(75);
        tabSet._setWeight(25);
        this._children.forEach(function (child) {
          hrow._addChild(child);
        });
        this._removeAll();
        vrow._addChild(tabSet);
        vrow._addChild(hrow);
        this._addChild(vrow);
      } else if (horz && dockLocation === _DockLocation["default"].BOTTOM || !horz && dockLocation === _DockLocation["default"].RIGHT) {
        var _vrow = new RowNode(this._model, {});
        var _hrow = new RowNode(this._model, {});
        _hrow._setWeight(75);
        tabSet._setWeight(25);
        this._children.forEach(function (child) {
          _hrow._addChild(child);
        });
        this._removeAll();
        _vrow._addChild(_hrow);
        _vrow._addChild(tabSet);
        this._addChild(_vrow);
      }
      this._model._setActiveTabset(tabSet);
      this._model._tidy();
    }

    /** @hidden @internal */
  }, {
    key: "_toJson",
    value: function _toJson() {
      var json = {};
      RowNode._attributeDefinitions.toJson(json, this._attributes);
      json.children = [];
      this._children.forEach(function (child) {
        json.children.push(child._toJson());
      });
      return json;
    }
  }, {
    key: "isEnableDrop",
    value: function isEnableDrop() {
      return true;
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
  }, {
    key: "_getAttributeDefinitions",
    value: function _getAttributeDefinitions() {
      return RowNode._attributeDefinitions;
    }

    /** @hidden @internal */
  }, {
    key: "_updateAttrs",
    value: function _updateAttrs(json) {
      RowNode._attributeDefinitions.update(json, this._attributes);
    }

    /** @hidden @internal */
  }], [{
    key: "_fromJson",
    value: /** @hidden @internal */
    function _fromJson(json, model) {
      var newLayoutNode = new RowNode(model, json);
      if (json.children != null) {
        var _iterator8 = _createForOfIteratorHelper(json.children),
          _step8;
        try {
          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var jsonChild = _step8.value;
            if (jsonChild.type === _TabSetNode["default"].TYPE) {
              var child = _TabSetNode["default"]._fromJson(jsonChild, model);
              newLayoutNode._addChild(child);
            } else {
              var _child7 = RowNode._fromJson(jsonChild, model);
              newLayoutNode._addChild(_child7);
            }
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }
      }
      return newLayoutNode;
    }
    /** @hidden @internal */
  }, {
    key: "_createAttributeDefinitions",
    value: /** @hidden @internal */
    function _createAttributeDefinitions() {
      var attributeDefinitions = new _AttributeDefinitions["default"]();
      attributeDefinitions.add("type", RowNode.TYPE, true).setType(_Attribute["default"].STRING).setFixed();
      attributeDefinitions.add("id", undefined).setType(_Attribute["default"].STRING);
      attributeDefinitions.add("weight", 100).setType(_Attribute["default"].NUMBER);
      attributeDefinitions.add("width", undefined).setType(_Attribute["default"].NUMBER);
      attributeDefinitions.add("height", undefined).setType(_Attribute["default"].NUMBER);
      return attributeDefinitions;
    }
  }, {
    key: "getAttributeDefinitions",
    value: function getAttributeDefinitions() {
      return RowNode._attributeDefinitions;
    }
  }]);
}(_Node2["default"]);
_RowNode = RowNode;
_defineProperty(RowNode, "TYPE", "row");
_defineProperty(RowNode, "_attributeDefinitions", _RowNode._createAttributeDefinitions());
var _default = exports["default"] = RowNode;
//# sourceMappingURL=RowNode.js.map