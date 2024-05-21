"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.captureControlsActionsStop = exports.captureControlsActionsStart = exports.captureControlsActionsDownloadVideo = exports.captureControlsActionsDownloadScreenshot = exports.captureControlsActions = void 0;
var _react = _interopRequireWildcard(require("react"));
var _IconButtonWithTooltip = _interopRequireDefault(require("../common/IconButtonWithTooltip"));
var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");
require("./CaptureControls.less");
var _propTypes = _interopRequireDefault(require("prop-types"));
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
var captureControlsActions = exports.captureControlsActions = {
  START: 'START',
  STOP: 'STOP',
  DOWNLOAD_VIDEO: 'DOWNLOAD_VIDEO',
  DOWNLOAD_SCREENSHOT: 'DOWNLOAD_SCREENSHOT'
};
var captureControlsActionsStart = exports.captureControlsActionsStart = function captureControlsActionsStart() {
  return {
    type: captureControlsActions.START
  };
};
var captureControlsActionsStop = exports.captureControlsActionsStop = function captureControlsActionsStop(options) {
  return {
    type: captureControlsActions.STOP,
    data: {
      options: options
    }
  };
};
var captureControlsActionsDownloadVideo = exports.captureControlsActionsDownloadVideo = function captureControlsActionsDownloadVideo(filename, options) {
  return {
    type: captureControlsActions.DOWNLOAD_VIDEO,
    data: {
      filename: filename,
      options: options
    }
  };
};
var captureControlsActionsDownloadScreenshot = exports.captureControlsActionsDownloadScreenshot = function captureControlsActionsDownloadScreenshot(filename) {
  return {
    type: captureControlsActions.DOWNLOAD_SCREENSHOT,
    data: {
      filename: filename
    }
  };
};
var CaptureControls = /*#__PURE__*/function (_Component) {
  function CaptureControls(props) {
    var _this;
    _classCallCheck(this, CaptureControls);
    _this = _callSuper(this, CaptureControls, [props]);
    _this.state = {
      isRecording: false,
      hasRecorded: false
    };
    _this.handleClickRecord = _this.handleClickRecord.bind(_this);
    return _this;
  }
  _inherits(CaptureControls, _Component);
  return _createClass(CaptureControls, [{
    key: "handleClickRecord",
    value: function handleClickRecord() {
      var isRecording = this.state.isRecording;
      if (isRecording) {
        this.props.captureControlsHandler(captureControlsActionsStop());
      } else {
        this.props.captureControlsHandler(captureControlsActionsStart());
      }
      this.setState({
        isRecording: !isRecording,
        hasRecorded: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        buttonStyles = _this$props.buttonStyles,
        captureControlsHandler = _this$props.captureControlsHandler;
      var _this$state = this.state,
        isRecording = _this$state.isRecording,
        hasRecorded = _this$state.hasRecorded;
      var defaultButtonStyles = {
        color: '#fc6320'
      };
      var iconButtonStyles = buttonStyles ? buttonStyles : defaultButtonStyles;
      var recordButton = !isRecording ? /*#__PURE__*/_react["default"].createElement(_IconButtonWithTooltip["default"], {
        disabled: false,
        onClick: this.handleClickRecord,
        className: "start squareB",
        style: iconButtonStyles,
        tooltip: "Start Recording",
        icon: _freeSolidSvgIcons.faDotCircle
      }) : /*#__PURE__*/_react["default"].createElement(_IconButtonWithTooltip["default"], {
        disabled: false,
        onClick: this.handleClickRecord,
        className: "stop squareB",
        style: iconButtonStyles,
        tooltip: "Stop recording",
        icon: _freeSolidSvgIcons.faStop
      });
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "position-toolbar"
      }, recordButton, hasRecorded && !isRecording && /*#__PURE__*/_react["default"].createElement(_IconButtonWithTooltip["default"], {
        disabled: false,
        onClick: function onClick() {
          return captureControlsHandler(captureControlsActionsDownloadVideo());
        },
        className: "download squareB",
        style: iconButtonStyles,
        tooltip: "Download",
        icon: _freeSolidSvgIcons.faDownload
      }), /*#__PURE__*/_react["default"].createElement(_IconButtonWithTooltip["default"], {
        disabled: false,
        onClick: function onClick() {
          return captureControlsHandler(captureControlsActionsDownloadScreenshot());
        },
        className: "screenshot squareB",
        style: iconButtonStyles,
        tooltip: "Screenshot",
        icon: _freeSolidSvgIcons.faCamera
      }));
    }
  }]);
}(_react.Component);
CaptureControls.defaultProps = {};
CaptureControls.propTypes = {
  /**
   * Function to callback on capture controls changes
   */
  captureControlsHandler: _propTypes["default"].func.isRequired,
  /**
   * Styles to apply on the icon button elements
   */
  buttonStyles: _propTypes["default"].any
};
var _default = exports["default"] = CaptureControls;
//# sourceMappingURL=CaptureControls.js.map