"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Layout = void 0;
var React = _interopRequireWildcard(require("react"));
var _DockLocation = _interopRequireDefault(require("../DockLocation"));
var _DragDrop = _interopRequireDefault(require("../DragDrop"));
var _Actions = _interopRequireDefault(require("../model/Actions"));
var _SplitterNode = _interopRequireDefault(require("../model/SplitterNode"));
var _TabNode = _interopRequireDefault(require("../model/TabNode"));
var _TabSetNode = _interopRequireDefault(require("../model/TabSetNode"));
var _Rect = _interopRequireDefault(require("../Rect"));
var _Types = require("../Types");
var _BorderTabSet = require("./BorderTabSet");
var _Splitter = require("./Splitter");
var _Tab = require("./Tab");
var _TabSet = require("./TabSet");
var _FloatingWindow = require("./FloatingWindow");
var _FloatingWindowTab = require("./FloatingWindowTab");
var _TabFloating = require("./TabFloating");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
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
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/** @hidden @internal */

// Popout windows work in latest browsers based on webkit (Chrome, Opera, Safari, latest Edge) and Firefox. They do
// not work on any version if IE or the original Edge browser
// Assume any recent desktop browser not IE or original Edge will work
/** @hidden @internal */
// @ts-ignore
var isIEorEdge = typeof window !== "undefined" && (window.document.documentMode || /Edge\//.test(window.navigator.userAgent));
/** @hidden @internal */
var isDesktop = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
/** @hidden @internal */
var defaultSupportsPopout = isDesktop && !isIEorEdge;

/**
 * A React component that hosts a multi-tabbed layout
 */
var Layout = exports.Layout = /*#__PURE__*/function (_React$Component) {
  function Layout(props) {
    var _this;
    _classCallCheck(this, Layout);
    _this = _callSuper(this, Layout, [props]);
    /** @hidden @internal */
    _defineProperty(_this, "selfRef", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "findHeaderBarSizeRef", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "findTabBarSizeRef", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "findBorderBarSizeRef", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "previousModel", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "centerRect", void 0);
    /** @hidden @internal */
    // private start: number = 0;
    /** @hidden @internal */
    // private layoutTime: number = 0;
    /** @hidden @internal */
    _defineProperty(_this, "tabIds", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "newTabJson", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "firstMove", false);
    /** @hidden @internal */
    _defineProperty(_this, "dragNode", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "dragDiv", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "dragDivText", "");
    /** @hidden @internal */
    _defineProperty(_this, "dropInfo", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "outlineDiv", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "edgeRightDiv", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "edgeBottomDiv", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "edgeLeftDiv", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "edgeTopDiv", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "fnNewNodeDropped", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "currentDocument", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "currentWindow", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "supportsPopout", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "popoutURL", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "icons", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "firstRender", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "resizeObserver", void 0);
    /** @hidden @internal */
    _defineProperty(_this, "onModelChange", function () {
      _this.forceUpdate();
      if (_this.props.onModelChange) {
        _this.props.onModelChange(_this.props.model);
      }
    });
    /** @hidden @internal */
    _defineProperty(_this, "updateRect", function () {
      var domRect = _this.getDomRect();
      var rect = new _Rect["default"](0, 0, domRect.width, domRect.height);
      if (!rect.equals(_this.state.rect) && rect.width !== 0 && rect.height !== 0) {
        _this.setState({
          rect: rect
        });
      }
    });
    /** @hidden @internal */
    _defineProperty(_this, "updateLayoutMetrics", function () {
      if (_this.findHeaderBarSizeRef.current) {
        var headerBarSize = _this.findHeaderBarSizeRef.current.getBoundingClientRect().height;
        if (headerBarSize !== _this.state.calculatedHeaderBarSize) {
          _this.setState({
            calculatedHeaderBarSize: headerBarSize
          });
        }
      }
      if (_this.findTabBarSizeRef.current) {
        var tabBarSize = _this.findTabBarSizeRef.current.getBoundingClientRect().height;
        if (tabBarSize !== _this.state.calculatedTabBarSize) {
          _this.setState({
            calculatedTabBarSize: tabBarSize
          });
        }
      }
      if (_this.findBorderBarSizeRef.current) {
        var borderBarSize = _this.findBorderBarSizeRef.current.getBoundingClientRect().height;
        if (borderBarSize !== _this.state.calculatedBorderBarSize) {
          _this.setState({
            calculatedBorderBarSize: borderBarSize
          });
        }
      }
    });
    /** @hidden @internal */
    _defineProperty(_this, "getClassName", function (defaultClassName) {
      if (_this.props.classNameMapper === undefined) {
        return defaultClassName;
      } else {
        return _this.props.classNameMapper(defaultClassName);
      }
    });
    /** @hidden @internal */
    _defineProperty(_this, "onCloseWindow", function (id) {
      _this.doAction(_Actions["default"].unFloatTab(id));
      try {
        _this.props.model.getNodeById(id)._setWindow(undefined);
      } catch (e) {
        // catch incase it was a model change
      }
    });
    /** @hidden @internal */
    _defineProperty(_this, "onSetWindow", function (id, window) {
      _this.props.model.getNodeById(id)._setWindow(window);
    });
    /** @hidden @internal */
    _defineProperty(_this, "onCancelAdd", function () {
      var rootdiv = _this.selfRef.current;
      rootdiv.removeChild(_this.dragDiv);
      _this.dragDiv = undefined;
      if (_this.fnNewNodeDropped != null) {
        _this.fnNewNodeDropped();
        _this.fnNewNodeDropped = undefined;
      }
      _DragDrop["default"].instance.hideGlass();
      _this.newTabJson = undefined;
    });
    /** @hidden @internal */
    _defineProperty(_this, "onCancelDrag", function (wasDragging) {
      if (wasDragging) {
        var rootdiv = _this.selfRef.current;
        try {
          rootdiv.removeChild(_this.outlineDiv);
        } catch (e) {}
        try {
          rootdiv.removeChild(_this.dragDiv);
        } catch (e) {}
        _this.dragDiv = undefined;
        _this.hideEdges(rootdiv);
        if (_this.fnNewNodeDropped != null) {
          _this.fnNewNodeDropped();
          _this.fnNewNodeDropped = undefined;
        }
        _DragDrop["default"].instance.hideGlass();
        _this.newTabJson = undefined;
      }
    });
    /** @hidden @internal */
    _defineProperty(_this, "onDragDivMouseDown", function (event) {
      event.preventDefault();
      _this.dragStart(event, _this.dragDivText, _TabNode["default"]._fromJson(_this.newTabJson, _this.props.model, false), true, undefined, undefined);
    });
    /** @hidden @internal */
    _defineProperty(_this, "dragStart", function (event, dragDivText, node, allowDrag, onClick, onDoubleClick) {
      if (_this.props.model.getMaximizedTabset() !== undefined || !allowDrag) {
        _DragDrop["default"].instance.startDrag(event, undefined, undefined, undefined, undefined, onClick, onDoubleClick, _this.currentDocument, _this.selfRef.current);
      } else {
        _this.dragNode = node;
        _this.dragDivText = dragDivText;
        _DragDrop["default"].instance.startDrag(event, _this.onDragStart, _this.onDragMove, _this.onDragEnd, _this.onCancelDrag, onClick, onDoubleClick, _this.currentDocument, _this.selfRef.current);
      }
    });
    /** @hidden @internal */
    _defineProperty(_this, "onDragStart", function () {
      _this.dropInfo = undefined;
      var rootdiv = _this.selfRef.current;
      _this.outlineDiv = _this.currentDocument.createElement("div");
      _this.outlineDiv.className = _this.getClassName(_Types.CLASSES.FLEXLAYOUT__OUTLINE_RECT);
      _this.outlineDiv.style.visibility = "hidden";
      rootdiv.appendChild(_this.outlineDiv);
      if (_this.dragDiv == null) {
        _this.dragDiv = _this.currentDocument.createElement("div");
        _this.dragDiv.className = _this.getClassName(_Types.CLASSES.FLEXLAYOUT__DRAG_RECT);
        _this.dragDiv.innerHTML = _this.dragDivText;
        rootdiv.appendChild(_this.dragDiv);
      }
      // add edge indicators
      _this.showEdges(rootdiv);
      if (_this.dragNode !== undefined && _this.dragNode instanceof _TabNode["default"] && _this.dragNode.getTabRect() !== undefined) {
        _this.dragNode.getTabRect().positionElement(_this.outlineDiv);
      }
      _this.firstMove = true;
      return true;
    });
    /** @hidden @internal */
    _defineProperty(_this, "onDragMove", function (event) {
      if (_this.firstMove === false) {
        var speed = _this.props.model._getAttribute("tabDragSpeed");
        _this.outlineDiv.style.transition = "top ".concat(speed, "s, left ").concat(speed, "s, width ").concat(speed, "s, height ").concat(speed, "s");
      }
      _this.firstMove = false;
      var clientRect = _this.selfRef.current.getBoundingClientRect();
      var pos = {
        x: event.clientX - clientRect.left,
        y: event.clientY - clientRect.top
      };
      _this.dragDiv.style.left = pos.x - _this.dragDiv.getBoundingClientRect().width / 2 + "px";
      _this.dragDiv.style.top = pos.y + 5 + "px";
      var dropInfo = _this.props.model._findDropTargetNode(_this.dragNode, pos.x, pos.y);
      if (dropInfo) {
        _this.dropInfo = dropInfo;
        _this.outlineDiv.className = _this.getClassName(dropInfo.className);
        dropInfo.rect.positionElement(_this.outlineDiv);
        _this.outlineDiv.style.visibility = "visible";
      }
    });
    /** @hidden @internal */
    _defineProperty(_this, "onDragEnd", function (event) {
      var rootdiv = _this.selfRef.current;
      rootdiv.removeChild(_this.outlineDiv);
      rootdiv.removeChild(_this.dragDiv);
      _this.dragDiv = undefined;
      _this.hideEdges(rootdiv);
      _DragDrop["default"].instance.hideGlass();
      if (_this.dropInfo) {
        if (_this.newTabJson !== undefined) {
          var newNode = _this.doAction(_Actions["default"].addNode(_this.newTabJson, _this.dropInfo.node.getId(), _this.dropInfo.location, _this.dropInfo.index));
          if (_this.fnNewNodeDropped != null) {
            _this.fnNewNodeDropped(newNode, event);
            _this.fnNewNodeDropped = undefined;
          }
          _this.newTabJson = undefined;
        } else if (_this.dragNode !== undefined) {
          _this.doAction(_Actions["default"].moveNode(_this.dragNode.getId(), _this.dropInfo.node.getId(), _this.dropInfo.location, _this.dropInfo.index));
        }
      }
    });
    _this.props.model._setChangeListener(_this.onModelChange);
    _this.tabIds = [];
    _this.selfRef = /*#__PURE__*/React.createRef();
    _this.findHeaderBarSizeRef = /*#__PURE__*/React.createRef();
    _this.findTabBarSizeRef = /*#__PURE__*/React.createRef();
    _this.findBorderBarSizeRef = /*#__PURE__*/React.createRef();
    _this.supportsPopout = props.supportsPopout !== undefined ? props.supportsPopout : defaultSupportsPopout;
    _this.popoutURL = props.popoutURL ? props.popoutURL : "popout.html";
    // For backwards compatibility, prop closeIcon sets prop icons.close:
    _this.icons = props.closeIcon ? Object.assign({
      close: props.closeIcon
    }, props.icons) : props.icons;
    _this.firstRender = true;
    _this.state = {
      rect: new _Rect["default"](0, 0, 0, 0),
      calculatedHeaderBarSize: 25,
      calculatedTabBarSize: 26,
      calculatedBorderBarSize: 30,
      editingTab: undefined
    };
    _this.onDragEnter = _this.onDragEnter.bind(_this);
    return _this;
  }

  /** @hidden @internal */
  _inherits(Layout, _React$Component);
  return _createClass(Layout, [{
    key: "styleFont",
    value: function styleFont(style) {
      if (this.props.font) {
        if (this.props.font.size) {
          style.fontSize = this.props.font.size;
        }
        if (this.props.font.family) {
          style.fontFamily = this.props.font.family;
        }
        if (this.props.font.style) {
          style.fontStyle = this.props.font.style;
        }
        if (this.props.font.weight) {
          style.fontWeight = this.props.font.weight;
        }
      }
      return style;
    }
  }, {
    key: "doAction",
    value: /** @hidden @internal */
    function doAction(action) {
      if (this.props.onAction !== undefined) {
        var outcome = this.props.onAction(action);
        if (outcome !== undefined) {
          return this.props.model.doAction(outcome);
        }
        return undefined;
      } else {
        return this.props.model.doAction(action);
      }
    }

    /** @hidden @internal */
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;
      this.updateRect();
      this.updateLayoutMetrics();

      // need to re-render if size changes
      this.currentDocument = this.selfRef.current.ownerDocument;
      this.currentWindow = this.currentDocument.defaultView;
      this.resizeObserver = new ResizeObserver(function (entries) {
        _this2.updateRect();
      });
      this.resizeObserver.observe(this.selfRef.current);
    }

    /** @hidden @internal */
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.updateLayoutMetrics();
      if (this.props.model !== this.previousModel) {
        if (this.previousModel !== undefined) {
          this.previousModel._setChangeListener(undefined); // stop listening to old model
        }
        this.props.model._setChangeListener(this.onModelChange);
        this.previousModel = this.props.model;
      }
      // console.log("Layout time: " + this.layoutTime + "ms Render time: " + (Date.now() - this.start) + "ms");
    }
  }, {
    key: "getCurrentDocument",
    value: /** @hidden @internal */
    function getCurrentDocument() {
      return this.currentDocument;
    }

    /** @hidden @internal */
  }, {
    key: "getDomRect",
    value: function getDomRect() {
      return this.selfRef.current.getBoundingClientRect();
    }

    /** @hidden @internal */
  }, {
    key: "getRootDiv",
    value: function getRootDiv() {
      return this.selfRef.current;
    }

    /** @hidden @internal */
  }, {
    key: "isSupportsPopout",
    value: function isSupportsPopout() {
      return this.supportsPopout;
    }

    /** @hidden @internal */
  }, {
    key: "getPopoutURL",
    value: function getPopoutURL() {
      return this.popoutURL;
    }

    /** @hidden @internal */
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this$resizeObserver;
      (_this$resizeObserver = this.resizeObserver) === null || _this$resizeObserver === void 0 || _this$resizeObserver.unobserve(this.selfRef.current);
    }

    /** @hidden @internal */
  }, {
    key: "setEditingTab",
    value: function setEditingTab(tabNode) {
      this.setState({
        editingTab: tabNode
      });
    }

    /** @hidden @internal */
  }, {
    key: "getEditingTab",
    value: function getEditingTab() {
      return this.state.editingTab;
    }

    /** @hidden @internal */
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;
      // first render will be used to find the size (via selfRef)
      if (this.firstRender) {
        this.firstRender = false;
        return /*#__PURE__*/React.createElement("div", {
          ref: this.selfRef,
          className: this.getClassName(_Types.CLASSES.FLEXLAYOUT__LAYOUT)
        }, this.metricsElements());
      }
      this.props.model._setPointerFine(window && window.matchMedia && window.matchMedia("(pointer: fine)").matches);
      // this.start = Date.now();
      var borderComponents = [];
      var tabSetComponents = [];
      var floatingWindows = [];
      var tabComponents = {};
      var splitterComponents = [];
      var metrics = {
        headerBarSize: this.state.calculatedHeaderBarSize,
        tabBarSize: this.state.calculatedTabBarSize,
        borderBarSize: this.state.calculatedBorderBarSize
      };
      this.centerRect = this.props.model._layout(this.state.rect, metrics);
      this.renderBorder(this.props.model.getBorderSet(), borderComponents, tabComponents, floatingWindows, splitterComponents);
      this.renderChildren(this.props.model.getRoot(), tabSetComponents, tabComponents, floatingWindows, splitterComponents);
      var nextTopIds = [];
      var nextTopIdsMap = {};

      // Keep any previous tabs in the same DOM order as before, removing any that have been deleted
      this.tabIds.forEach(function (t) {
        if (tabComponents[t]) {
          nextTopIds.push(t);
          nextTopIdsMap[t] = t;
        }
      });
      this.tabIds = nextTopIds;

      // Add tabs that have been added to the DOM
      Object.keys(tabComponents).forEach(function (t) {
        if (!nextTopIdsMap[t]) {
          _this3.tabIds.push(t);
        }
      });

      // this.layoutTime = (Date.now() - this.start);
      var layoutStyle = {
        borderLeft: '0px solid transparent',
        borderRight: '0px solid transparent'
      };
      var layoutSideBorders = 0;
      layoutSideBorders = this.props.model._getAttribute('sideBorders');
      if (layoutSideBorders > 0) {
        layoutStyle = {
          borderLeft: layoutSideBorders + 'px solid transparent',
          borderRight: layoutSideBorders + 'px solid transparent'
        };
      }
      return /*#__PURE__*/React.createElement("div", {
        style: layoutStyle,
        ref: this.selfRef,
        className: this.getClassName(_Types.CLASSES.FLEXLAYOUT__LAYOUT),
        onDragEnter: this.props.onExternalDrag ? this.onDragEnter : undefined
      }, tabSetComponents, this.tabIds.map(function (t) {
        return tabComponents[t];
      }), borderComponents, splitterComponents, floatingWindows, this.metricsElements());
    }

    /** @hidden @internal */
  }, {
    key: "metricsElements",
    value: function metricsElements() {
      // used to measure the tab and border tab sizes
      var fontStyle = this.styleFont({
        visibility: "hidden"
      });
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        key: "findHeaderBarSize",
        ref: this.findHeaderBarSizeRef,
        style: fontStyle,
        className: this.getClassName(_Types.CLASSES.FLEXLAYOUT__TABSET_HEADER_SIZER)
      }, "FindHeaderBarSize"), /*#__PURE__*/React.createElement("div", {
        key: "findTabBarSize",
        ref: this.findTabBarSizeRef,
        style: fontStyle,
        className: this.getClassName(_Types.CLASSES.FLEXLAYOUT__TABSET_SIZER)
      }, "FindTabBarSize"), /*#__PURE__*/React.createElement("div", {
        key: "findBorderBarSize",
        ref: this.findBorderBarSizeRef,
        style: fontStyle,
        className: this.getClassName(_Types.CLASSES.FLEXLAYOUT__BORDER_SIZER)
      }, "FindBorderBarSize"));
    }
  }, {
    key: "renderBorder",
    value: /** @hidden @internal */
    function renderBorder(borderSet, borderComponents, tabComponents, floatingWindows, splitterComponents) {
      var _iterator = _createForOfIteratorHelper(borderSet.getBorders()),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var border = _step.value;
          if (border.isShowing()) {
            borderComponents.push( /*#__PURE__*/React.createElement(_BorderTabSet.BorderTabSet, {
              key: "border_" + border.getLocation().getName(),
              border: border,
              layout: this,
              iconFactory: this.props.iconFactory,
              titleFactory: this.props.titleFactory,
              icons: this.icons
            }));
            var drawChildren = border._getDrawChildren();
            var i = 0;
            var _iterator2 = _createForOfIteratorHelper(drawChildren),
              _step2;
            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var child = _step2.value;
                if (child instanceof _SplitterNode["default"]) {
                  splitterComponents.push( /*#__PURE__*/React.createElement(_Splitter.Splitter, {
                    key: child.getId(),
                    layout: this,
                    node: child
                  }));
                } else if (child instanceof _TabNode["default"]) {
                  if (this.supportsPopout && child.isFloating()) {
                    var rect = this._getScreenRect(child);
                    floatingWindows.push( /*#__PURE__*/React.createElement(_FloatingWindow.FloatingWindow, {
                      key: child.getId(),
                      url: this.popoutURL,
                      rect: rect,
                      title: child.getName(),
                      id: child.getId(),
                      onSetWindow: this.onSetWindow,
                      onCloseWindow: this.onCloseWindow
                    }, /*#__PURE__*/React.createElement(_FloatingWindowTab.FloatingWindowTab, {
                      layout: this,
                      node: child,
                      factory: this.props.factory
                    })));
                    tabComponents[child.getId()] = /*#__PURE__*/React.createElement(_TabFloating.TabFloating, {
                      key: child.getId(),
                      layout: this,
                      node: child,
                      selected: i === border.getSelected()
                    });
                  } else {
                    tabComponents[child.getId()] = /*#__PURE__*/React.createElement(_Tab.Tab, {
                      key: child.getId(),
                      layout: this,
                      node: child,
                      selected: i === border.getSelected(),
                      factory: this.props.factory
                    });
                  }
                }
                i++;
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    /** @hidden @internal */
  }, {
    key: "renderChildren",
    value: function renderChildren(node, tabSetComponents, tabComponents, floatingWindows, splitterComponents) {
      var drawChildren = node._getDrawChildren();
      var _iterator3 = _createForOfIteratorHelper(drawChildren),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var child = _step3.value;
          if (child instanceof _SplitterNode["default"]) {
            splitterComponents.push( /*#__PURE__*/React.createElement(_Splitter.Splitter, {
              key: child.getId(),
              layout: this,
              node: child
            }));
          } else if (child instanceof _TabSetNode["default"]) {
            tabSetComponents.push( /*#__PURE__*/React.createElement(_TabSet.TabSet, {
              key: child.getId(),
              layout: this,
              node: child,
              iconFactory: this.props.iconFactory,
              titleFactory: this.props.titleFactory,
              icons: this.icons
            }));
            this.renderChildren(child, tabSetComponents, tabComponents, floatingWindows, splitterComponents);
          } else if (child instanceof _TabNode["default"]) {
            var selectedTab = child.getParent().getChildren()[child.getParent().getSelected()];
            if (selectedTab === undefined) {
              // this should not happen!
              console.warn("undefined selectedTab should not happen");
            }
            if (this.supportsPopout && child.isFloating()) {
              var rect = this._getScreenRect(child);
              floatingWindows.push( /*#__PURE__*/React.createElement(_FloatingWindow.FloatingWindow, {
                key: child.getId(),
                url: this.popoutURL,
                rect: rect,
                title: child.getName(),
                id: child.getId(),
                onSetWindow: this.onSetWindow,
                onCloseWindow: this.onCloseWindow
              }, /*#__PURE__*/React.createElement(_FloatingWindowTab.FloatingWindowTab, {
                layout: this,
                node: child,
                factory: this.props.factory
              })));
              tabComponents[child.getId()] = /*#__PURE__*/React.createElement(_TabFloating.TabFloating, {
                key: child.getId(),
                layout: this,
                node: child,
                selected: child === selectedTab
              });
            } else {
              tabComponents[child.getId()] = /*#__PURE__*/React.createElement(_Tab.Tab, {
                key: child.getId(),
                layout: this,
                node: child,
                selected: child === selectedTab,
                factory: this.props.factory
              });
            }
          } else {
            // is row
            this.renderChildren(child, tabSetComponents, tabComponents, floatingWindows, splitterComponents);
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }

    /** @hidden @internal */
  }, {
    key: "_getScreenRect",
    value: function _getScreenRect(node) {
      var rect = node.getRect().clone();
      var bodyRect = this.selfRef.current.getBoundingClientRect();
      var navHeight = Math.min(80, this.currentWindow.outerHeight - this.currentWindow.innerHeight);
      var navWidth = Math.min(80, this.currentWindow.outerWidth - this.currentWindow.innerWidth);
      rect.x = rect.x + bodyRect.x + this.currentWindow.screenX + navWidth;
      rect.y = rect.y + bodyRect.y + this.currentWindow.screenY + navHeight;
      return rect;
    }

    /**
     * Adds a new tab to the given tabset
     * @param tabsetId the id of the tabset where the new tab will be added
     * @param json the json for the new tab node
     */
  }, {
    key: "addTabToTabSet",
    value: function addTabToTabSet(tabsetId, json) {
      var tabsetNode = this.props.model.getNodeById(tabsetId);
      if (tabsetNode !== undefined) {
        this.doAction(_Actions["default"].addNode(json, tabsetId, _DockLocation["default"].CENTER, -1));
      }
    }

    /**
     * Adds a new tab to the active tabset (if there is one)
     * @param json the json for the new tab node
     */
  }, {
    key: "addTabToActiveTabSet",
    value: function addTabToActiveTabSet(json) {
      var tabsetNode = this.props.model.getActiveTabset();
      if (tabsetNode !== undefined) {
        this.doAction(_Actions["default"].addNode(json, tabsetNode.getId(), _DockLocation["default"].CENTER, -1));
      }
    }

    /**
     * Adds a new tab by dragging a labeled panel to the drop location, dragging starts immediatelly
     * @param dragText the text to show on the drag panel
     * @param json the json for the new tab node
     * @param onDrop a callback to call when the drag is complete
     */
  }, {
    key: "addTabWithDragAndDrop",
    value: function addTabWithDragAndDrop(dragText, json, onDrop) {
      this.fnNewNodeDropped = onDrop;
      this.newTabJson = json;
      this.dragStart(undefined, dragText, _TabNode["default"]._fromJson(json, this.props.model, false), true, undefined, undefined);
    }

    /**
     * Adds a new tab by dragging a labeled panel to the drop location, dragging starts when you
     * mouse down on the panel
     *
     * @param dragText the text to show on the drag panel
     * @param json the json for the new tab node
     * @param onDrop a callback to call when the drag is complete
     */
  }, {
    key: "addTabWithDragAndDropIndirect",
    value: function addTabWithDragAndDropIndirect(dragText, json, onDrop) {
      this.fnNewNodeDropped = onDrop;
      this.newTabJson = json;
      _DragDrop["default"].instance.addGlass(this.onCancelAdd);
      this.dragDivText = dragText;
      this.dragDiv = this.currentDocument.createElement("div");
      this.dragDiv.className = this.getClassName("flexlayout__drag_rect");
      this.dragDiv.innerHTML = this.dragDivText;
      this.dragDiv.addEventListener("mousedown", this.onDragDivMouseDown);
      this.dragDiv.addEventListener("touchstart", this.onDragDivMouseDown);
      var r = new _Rect["default"](10, 10, 150, 50);
      r.centerInRect(this.state.rect);
      this.dragDiv.style.left = r.x + "px";
      this.dragDiv.style.top = r.y + "px";
      var rootdiv = this.selfRef.current;
      rootdiv.appendChild(this.dragDiv);
    }
  }, {
    key: "onDragEnter",
    value: /** @hidden @internal */
    function onDragEnter(event) {
      // DragDrop keeps track of number of dragenters minus the number of
      // dragleaves. Only start a new drag if there isn't one already.
      if (_DragDrop["default"].instance.isDragging()) return;
      var drag = this.props.onExternalDrag(event);
      if (drag) {
        // Mimic addTabWithDragAndDrop, but pass in DragEvent
        this.fnNewNodeDropped = drag.onDrop;
        this.newTabJson = drag.json;
        this.dragStart(event, drag.dragText, _TabNode["default"]._fromJson(drag.json, this.props.model, false), true, undefined, undefined);
      }
    }

    /** @hidden @internal */
  }, {
    key: "showEdges",
    value: function showEdges(rootdiv) {
      if (this.props.model.isEnableEdgeDock()) {
        var domRect = rootdiv.getBoundingClientRect();
        var r = this.centerRect;
        var size = 100;
        var length = size + "px";
        var radius = "50px";
        var width = "10px";
        this.edgeTopDiv = this.currentDocument.createElement("div");
        this.edgeTopDiv.className = this.getClassName(_Types.CLASSES.FLEXLAYOUT__EDGE_RECT);
        this.edgeTopDiv.style.top = r.y + "px";
        this.edgeTopDiv.style.left = r.x + (r.width - size) / 2 + "px";
        this.edgeTopDiv.style.width = length;
        this.edgeTopDiv.style.height = width;
        this.edgeTopDiv.style.borderBottomLeftRadius = radius;
        this.edgeTopDiv.style.borderBottomRightRadius = radius;
        this.edgeLeftDiv = this.currentDocument.createElement("div");
        this.edgeLeftDiv.className = this.getClassName(_Types.CLASSES.FLEXLAYOUT__EDGE_RECT);
        this.edgeLeftDiv.style.top = r.y + (r.height - size) / 2 + "px";
        this.edgeLeftDiv.style.left = r.x + "px";
        this.edgeLeftDiv.style.width = width;
        this.edgeLeftDiv.style.height = length;
        this.edgeLeftDiv.style.borderTopRightRadius = radius;
        this.edgeLeftDiv.style.borderBottomRightRadius = radius;
        this.edgeBottomDiv = this.currentDocument.createElement("div");
        this.edgeBottomDiv.className = this.getClassName(_Types.CLASSES.FLEXLAYOUT__EDGE_RECT);
        this.edgeBottomDiv.style.bottom = domRect.height - r.getBottom() + "px";
        this.edgeBottomDiv.style.left = r.x + (r.width - size) / 2 + "px";
        this.edgeBottomDiv.style.width = length;
        this.edgeBottomDiv.style.height = width;
        this.edgeBottomDiv.style.borderTopLeftRadius = radius;
        this.edgeBottomDiv.style.borderTopRightRadius = radius;
        this.edgeRightDiv = this.currentDocument.createElement("div");
        this.edgeRightDiv.className = this.getClassName(_Types.CLASSES.FLEXLAYOUT__EDGE_RECT);
        this.edgeRightDiv.style.top = r.y + (r.height - size) / 2 + "px";
        this.edgeRightDiv.style.right = domRect.width - r.getRight() + "px";
        this.edgeRightDiv.style.width = width;
        this.edgeRightDiv.style.height = length;
        this.edgeRightDiv.style.borderTopLeftRadius = radius;
        this.edgeRightDiv.style.borderBottomLeftRadius = radius;
        rootdiv.appendChild(this.edgeTopDiv);
        rootdiv.appendChild(this.edgeLeftDiv);
        rootdiv.appendChild(this.edgeBottomDiv);
        rootdiv.appendChild(this.edgeRightDiv);
      }
    }

    /** @hidden @internal */
  }, {
    key: "hideEdges",
    value: function hideEdges(rootdiv) {
      if (this.props.model.isEnableEdgeDock()) {
        try {
          rootdiv.removeChild(this.edgeTopDiv);
          rootdiv.removeChild(this.edgeLeftDiv);
          rootdiv.removeChild(this.edgeBottomDiv);
          rootdiv.removeChild(this.edgeRightDiv);
        } catch (e) {}
      }
    }

    /** @hidden @internal */
  }, {
    key: "maximize",
    value: function maximize(tabsetNode) {
      this.doAction(_Actions["default"].maximizeToggle(tabsetNode.getId()));
    }

    /** @hidden @internal */
  }, {
    key: "customizeTab",
    value: function customizeTab(tabNode, renderValues) {
      if (this.props.onRenderTab) {
        this.props.onRenderTab(tabNode, renderValues);
      }
    }

    /** @hidden @internal */
  }, {
    key: "customizeTabSet",
    value: function customizeTabSet(tabSetNode, renderValues) {
      if (this.props.onRenderTabSet) {
        this.props.onRenderTabSet(tabSetNode, renderValues);
      }
    }

    /** @hidden @internal */
  }, {
    key: "i18nName",
    value: function i18nName(id, param) {
      var message;
      if (this.props.i18nMapper) {
        message = this.props.i18nMapper(id, param);
      }
      if (message === undefined) {
        message = id + (param === undefined ? "" : param);
      }
      return message;
    }

    /** @hidden @internal */
  }, {
    key: "customizeBottomBar",
    value: function customizeBottomBar(tabNode) {
      if (this.props.clickOnBordersAction) {
        this.props.clickOnBordersAction(tabNode);
      } else {
        this.doAction(_Actions["default"].selectTab(tabNode.getId()));
      }
    }
  }]);
}(React.Component);
var _default = exports["default"] = Layout;
//# sourceMappingURL=Layout.js.map