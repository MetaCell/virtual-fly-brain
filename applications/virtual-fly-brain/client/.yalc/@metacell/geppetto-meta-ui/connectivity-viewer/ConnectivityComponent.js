"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@material-ui/core");
var _ConnectivityToolbar = _interopRequireDefault(require("./subcomponents/ConnectivityToolbar"));
var _ConnectivityPlot = _interopRequireDefault(require("./subcomponents/ConnectivityPlot"));
var _Matrix = require("./layouts/Matrix");
var _Hive = require("./layouts/Hive");
var _Force = require("./layouts/Force");
var _Chord = require("./layouts/Chord");
var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _CustomToolbar = _interopRequireDefault(require("../common/CustomToolbar"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var styles = function styles(theme) {
  return {
    container: {
      display: 'flex',
      alignItems: 'stretch',
      flex: 1
    }
  };
};
var ConnectivityComponent = /*#__PURE__*/function (_Component) {
  function ConnectivityComponent(props) {
    var _this;
    _classCallCheck(this, ConnectivityComponent);
    _this = _callSuper(this, ConnectivityComponent, [props]);
    _this.state = {
      layout: _this.props.layout !== null ? _this.props.layout : new _Matrix.Matrix(),
      toolbarVisibility: true,
      legendsVisibility: true,
      dimensions: null
    };
    _this.legendHandler = _this.legendHandler.bind(_this);
    _this.deckHandler = _this.deckHandler.bind(_this);
    _this.sortOptionsHandler = _this.sortOptionsHandler.bind(_this);
    _this.plotRef = /*#__PURE__*/_react["default"].createRef();
    _this.containerRef = /*#__PURE__*/_react["default"].createRef();
    return _this;
  }

  /**
   *
   * Handles legend toggle button
   *
   * @command legendHandler ()
   *
   */
  _inherits(ConnectivityComponent, _Component);
  return _createClass(ConnectivityComponent, [{
    key: "legendHandler",
    value: function legendHandler() {
      var _this2 = this;
      this.setState(function () {
        return {
          legendsVisibility: !_this2.state.legendsVisibility
        };
      });
    }

    /**
     *
     * Handles toolbar visibility
     *
     * @command toolbarHandler (visibility)
     *
     */
  }, {
    key: "toolbarHandler",
    value: function toolbarHandler(visibility) {
      this.setState(function () {
        return {
          toolbarVisibility: visibility
        };
      });
    }

    /**
     *
     * Handle layout selection
     *
     * @command deckHandler (layout)
     *
     * @param layout
     */
  }, {
    key: "deckHandler",
    value: function deckHandler(layout) {
      this.setState(function () {
        return {
          layout: layout
        };
      });
    }

    /**
     *
     * Updates the sorting order
     *
     * @command sortOptionsHandler (option)
     *
     */
  }, {
    key: "sortOptionsHandler",
    value: function sortOptionsHandler(option) {
      this.state.layout.setOrder(this.plotRef.current, option);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var toolbarHeight = 140;
      this.setState({
        dimensions: {
          width: this.containerRef.current.clientWidth,
          height: this.containerRef.current.clientHeight - toolbarHeight
        }
      });
    }
  }, {
    key: "renderContent",
    value: function renderContent() {
      var _this$props = this.props,
        classes = _this$props.classes,
        id = _this$props.id,
        data = _this$props.data,
        colorMap = _this$props.colorMap,
        colors = _this$props.colors,
        names = _this$props.names,
        modelFactory = _this$props.modelFactory,
        resources = _this$props.resources,
        matrixOnClickHandler = _this$props.matrixOnClickHandler,
        nodeType = _this$props.nodeType,
        linkWeight = _this$props.linkWeight,
        linkType = _this$props.linkType,
        library = _this$props.library,
        toolbarOptions = _this$props.toolbarOptions;
      var _this$state = this.state,
        layout = _this$state.layout,
        toolbarVisibility = _this$state.toolbarVisibility,
        legendsVisibility = _this$state.legendsVisibility,
        dimensions = _this$state.dimensions;
      return /*#__PURE__*/_react["default"].createElement(_Grid["default"], {
        className: classes.container,
        container: true,
        spacing: 2
      }, /*#__PURE__*/_react["default"].createElement(_Grid["default"], {
        item: true,
        sm: 12,
        xs: 12
      }, /*#__PURE__*/_react["default"].createElement(_ConnectivityToolbar["default"], {
        id: id,
        layout: layout,
        toolbarVisibility: toolbarVisibility,
        legendsVisibility: legendsVisibility,
        legendHandler: this.legendHandler,
        deckHandler: this.deckHandler,
        sortOptionsHandler: this.sortOptionsHandler,
        options: toolbarOptions
      })), /*#__PURE__*/_react["default"].createElement(_Grid["default"], {
        item: true,
        sm: 12,
        xs: true
      }, /*#__PURE__*/_react["default"].createElement(_ConnectivityPlot["default"], {
        ref: this.plotRef,
        id: id,
        size: dimensions,
        data: data,
        colorMap: colorMap,
        colors: colors,
        names: names,
        layout: layout,
        legendsVisibility: legendsVisibility,
        toolbarVisibility: toolbarVisibility,
        modelFactory: modelFactory,
        resources: resources,
        matrixOnClickHandler: matrixOnClickHandler,
        nodeType: nodeType,
        linkWeight: linkWeight,
        linkType: linkType,
        library: library
      })));
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;
      var classes = this.props.classes;
      var dimensions = this.state.dimensions;
      var content = dimensions != null ? this.renderContent() : '';
      return /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.containerRef,
        className: classes.container,
        onMouseEnter: function onMouseEnter() {
          return _this3.toolbarHandler(true);
        },
        onMouseLeave: function onMouseLeave() {
          return _this3.toolbarHandler(false);
        }
      }, content);
    }
  }]);
}(_react.Component);
ConnectivityComponent.defaultProps = {
  names: [],
  colorMap: function colorMap() {},
  linkType: function linkType() {},
  layout: new _Matrix.Matrix(),
  linkWeight: function linkWeight() {},
  nodeType: function nodeType() {},
  library: function library() {},
  toolbarOptions: {}
};
ConnectivityComponent.propTypes = {
  /**
   * Component identifier
   */
  id: _propTypes["default"].string.isRequired,
  /**
   * Array of colors to provide for each subtitle
   */
  colors: _propTypes["default"].array.isRequired,
  /**
   * Model entities to be visualized
   */
  data: _propTypes["default"].object.isRequired,
  /**
   * Geppetto Model Factory
   */
  modelFactory: _propTypes["default"].object.isRequired,
  /**
   * Geppetto Resources
   */
  resources: _propTypes["default"].object.isRequired,
  /**
   * Function to handle click events on Matrix layout
   */
  matrixOnClickHandler: _propTypes["default"].func.isRequired,
  /**
   * Array of names supplied to the connectivity plot. Defaults to an empty array
   */
  names: _propTypes["default"].arrayOf(_propTypes["default"].string),
  /**
   * Function returning a d3 scaleOrdinal
   */
  colorMap: _propTypes["default"].func,
  /**
   * One of Matrix, Hive, Force or Chord objects. Defaults to Matrix
   */
  layout: _propTypes["default"].oneOfType([_propTypes["default"].instanceOf(_Matrix.Matrix), _propTypes["default"].instanceOf(_Hive.Hive), _propTypes["default"].instanceOf(_Force.Force), _propTypes["default"].instanceOf(_Chord.Chord)]),
  /**
   * Function to colour links (synapses) by neurotransmitter
   */
  linkType: _propTypes["default"].func,
  /**
   * Function to scale line widths based on the synaptic base conductance leve
   */
  linkWeight: _propTypes["default"].func,
  /**
   * Function that maps the connection source node (object of class EntityNode ) onto any type of value (coercible to string) which qualitatively identifies the node category
   */
  nodeType: _propTypes["default"].func,
  /**
   * Geppetto library that supplies a network type
   */
  library: _propTypes["default"].func,
  /**
   * Options to customize the toolbar
   */
  toolbarOptions: _propTypes["default"].shape({
    /**
     * Reference to toolbar component
     */
    instance: _propTypes["default"].elementType,
    /**
     * Custom toolbar props
     */
    props: _propTypes["default"].shape({}),
    /**
     * Styles to be applied to the toolbar container
     */
    containerStyles: _propTypes["default"].shape({}),
    /**
     * Styles to be applied to the toolbar
     */
    toolBarClassName: _propTypes["default"].shape({}),
    /**
     * Styles to be applied to the inner div
     */
    innerDivStyles: _propTypes["default"].shape({}),
    /**
     * Styles to be applied to the buttons
     */
    buttonStyles: _propTypes["default"].shape({}),
    /**
     * Styles to be applied to the menu button
     */
    menuButtonStyles: _propTypes["default"].shape({}),
    /**
     * Styles to be applied to the deck
     */
    deckStyles: _propTypes["default"].shape({})
  })
};
var _default = exports["default"] = (0, _core.withStyles)(styles)(ConnectivityComponent);
//# sourceMappingURL=ConnectivityComponent.js.map