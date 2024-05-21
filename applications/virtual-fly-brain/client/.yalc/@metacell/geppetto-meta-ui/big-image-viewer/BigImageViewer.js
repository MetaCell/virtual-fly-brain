"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@material-ui/core");
var _openseadragon = _interopRequireDefault(require("openseadragon"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var util = _interopRequireWildcard(require("../utilities"));
var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");
var _CustomToolbar = _interopRequireDefault(require("../common/CustomToolbar"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
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
    bigImageViewerContainer: {
      display: 'flex',
      padding: theme.spacing(5),
      alignItems: 'stretch',
      flex: 1
    },
    bigImageViewerContent: {
      display: 'flex',
      alignItems: 'stretch',
      paddingLeft: theme.spacing(2),
      flex: 1
    }
  };
};
var ZOOM_OUT_TOOLTIP = 'Zoom Out';
var ZOOM_IN_TOOLTIP = 'Zoom In';
var CENTER_IMAGE_TOOLTIP = 'Center Image';
var BigImageViewer = /*#__PURE__*/function (_Component) {
  function BigImageViewer(props) {
    var _this;
    _classCallCheck(this, BigImageViewer);
    _this = _callSuper(this, BigImageViewer, [props]);
    var settings = {
      id: _this.props.id + '_component',
      zoomInButton: 'zoom-in',
      zoomOutButton: 'zoom-out',
      homeButton: 'home',
      fullPageButton: 'full-page'
    };
    _this.state = {
      settings: util.extend(settings, _this.props.settings),
      file: _this.extractFilePath(_this.props.data)
    };

    // this.download = this.download.bind(this);
    _this.goHome = _this.goHome.bind(_this);
    _this.zoomIn = _this.zoomIn.bind(_this);
    _this.zoomOut = _this.zoomOut.bind(_this);
    _this.fullPage = _this.fullPage.bind(_this);
    return _this;
  }
  _inherits(BigImageViewer, _Component);
  return _createClass(BigImageViewer, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapshot) {
      this.loadViewer();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.loadViewer();
    }
  }, {
    key: "extractFilePath",
    value: function extractFilePath(data) {
      var file;
      if (data !== undefined) {
        if (data.getMetaType === undefined) {
          file = data;
        } else if (data.getMetaType() === 'Instance' && data.getVariable().getInitialValues()[0].value.format === 'DZI') {
          file = data.getVariable().getInitialValues()[0].value.data;
        }
      }
      return file;
    }
  }, {
    key: "loadViewer",
    value: function loadViewer() {
      if (this.state.file !== undefined) {
        if (this.viewer !== undefined) {
          this.viewer.destroy();
        }
        this.state.settings.tileSources = this.state.file;
        this.viewer = (0, _openseadragon["default"])(this.state.settings);
      }
    }

    // These four methods are not exposed by OpenSeaDragon
  }, {
    key: "goHome",
    value: function goHome() {
      this.viewer.viewport.goHome();
    }
  }, {
    key: "zoomIn",
    value: function zoomIn() {
      this.viewer.viewport.zoomBy(this.viewer.zoomPerClick / 1.0);
      this.viewer.viewport.applyConstraints();
    }
  }, {
    key: "zoomOut",
    value: function zoomOut() {
      this.viewer.viewport.zoomBy(1.0 / this.viewer.zoomPerClick);
      this.viewer.viewport.applyConstraints();
    }
  }, {
    key: "fullPage",
    value: function fullPage() {
      this.viewer.setFullScreen(true);
      this.viewer.fullPageButton.element.focus();
      this.viewer.viewport.applyConstraints();
    }
  }, {
    key: "getCustomButtons",
    value: function getCustomButtons() {
      var customButtons = [];
      customButtons.push({
        icon: _freeSolidSvgIcons.faSearchMinus,
        id: 'zoom-out',
        tooltip: ZOOM_OUT_TOOLTIP,
        action: this.zoomOut
      });
      customButtons.push({
        icon: _freeSolidSvgIcons.faSearchPlus,
        id: 'zoom-in',
        tooltip: ZOOM_IN_TOOLTIP,
        action: this.zoomIn
      });
      customButtons.push({
        icon: _freeSolidSvgIcons.faHome,
        id: 'home',
        tooltip: CENTER_IMAGE_TOOLTIP,
        action: this.goHome
      });
      return customButtons;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        classes = _this$props.classes,
        toolbarOptions = _this$props.toolbarOptions;
      var customButtons = this.getCustomButtons();
      var toolbar = toolbarOptions && toolbarOptions.instance ? /*#__PURE__*/_react["default"].createElement(toolbarOptions.instance, _extends({
        buttons: customButtons
      }, toolbarOptions.props)) : /*#__PURE__*/_react["default"].createElement(_CustomToolbar["default"], {
        buttons: customButtons,
        containerStyles: toolbarOptions === null || toolbarOptions === void 0 ? void 0 : toolbarOptions.containerStyles,
        toolBarClassName: toolbarOptions === null || toolbarOptions === void 0 ? void 0 : toolbarOptions.toolBarClassName,
        innerDivStyles: toolbarOptions === null || toolbarOptions === void 0 ? void 0 : toolbarOptions.innerDivStyles,
        buttonStyles: toolbarOptions === null || toolbarOptions === void 0 ? void 0 : toolbarOptions.buttonStyles
      });
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: classes.bigImageViewerContainer
      }, toolbar, /*#__PURE__*/_react["default"].createElement("div", {
        id: this.props.id + '_component',
        className: classes.bigImageViewerContent
      }));
    }
  }]);
}(_react.Component);
BigImageViewer.defaultProps = {
  settings: [],
  toolbarOptions: null
};
BigImageViewer.propTypes = {
  /**
   * Component identifier
   */
  id: _propTypes["default"].string.isRequired,
  /**
   * Path/URL to image file (f.e. "/path/to/my/image.dzi")
   */
  data: _propTypes["default"].string.isRequired,
  /**
   * All required and optional settings for instantiating a new instance of an OpenSeadragon image viewer
   */
  settings: _propTypes["default"].array,
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
    buttonStyles: _propTypes["default"].shape({})
  })
};
var _default = exports["default"] = (0, _core.withStyles)(styles)(BigImageViewer);
//# sourceMappingURL=BigImageViewer.js.map