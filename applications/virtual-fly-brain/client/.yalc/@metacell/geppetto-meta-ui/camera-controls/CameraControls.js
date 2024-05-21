"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.cameraControlsActions = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _IconButtonWithTooltip = _interopRequireDefault(require("../common/IconButtonWithTooltip"));
var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");
require("./CameraControls.less");
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
var cameraControlsActions = exports.cameraControlsActions = {
  PAN_LEFT: 'panLeft',
  PAN_UP: 'panUp',
  PAN_RIGHT: 'panRight',
  PAN_DOWN: 'panDown',
  PAN_HOME: 'cameraHome',
  ROTATE_LEFT: 'rotateLeft',
  ROTATE_UP: 'rotateUp',
  ROTATE_RIGHT: 'rotateRight',
  ROTATE_DOWN: 'rotateDown',
  ROTATE_Z: 'rotateZ',
  ROTATE_MZ: 'rotateMZ',
  ROTATE: 'rotate',
  ZOOM_IN: 'zoomIn',
  ZOOM_OUT: 'zoomOut',
  WIREFRAME: 'wireframe'
};
var CameraControls = /*#__PURE__*/function (_Component) {
  function CameraControls(props) {
    _classCallCheck(this, CameraControls);
    return _callSuper(this, CameraControls, [props]);
  }
  _inherits(CameraControls, _Component);
  return _createClass(CameraControls, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
        cameraControlsHandler = _this$props.cameraControlsHandler,
        wireframeButtonEnabled = _this$props.wireframeButtonEnabled,
        buttonStyles = _this$props.buttonStyles;
      var buttons = [{
        action: cameraControlsActions.PAN_LEFT,
        className: 'pan-left',
        tooltip: 'Pan left',
        icon: _freeSolidSvgIcons.faChevronLeft
      }, {
        action: cameraControlsActions.PAN_RIGHT,
        className: 'pan-right',
        tooltip: 'Pan right',
        icon: _freeSolidSvgIcons.faChevronRight
      }, {
        action: cameraControlsActions.PAN_UP,
        className: 'pan-top',
        tooltip: 'Pan up',
        icon: _freeSolidSvgIcons.faChevronUp
      }, {
        action: cameraControlsActions.PAN_DOWN,
        className: 'pan-bottom',
        tooltip: 'Pan down',
        icon: _freeSolidSvgIcons.faChevronDown
      }, {
        action: cameraControlsActions.PAN_HOME,
        className: 'pan-home',
        tooltip: 'Pan home',
        icon: _freeSolidSvgIcons.faHome
      }, {
        action: cameraControlsActions.ROTATE_LEFT,
        className: 'rotate-left',
        tooltip: 'Rotate left',
        icon: _freeSolidSvgIcons.faUndo
      }, {
        action: cameraControlsActions.ROTATE_RIGHT,
        className: 'rotate-right',
        tooltip: 'Rotate right',
        icon: _freeSolidSvgIcons.faRedo
      }, {
        action: cameraControlsActions.ROTATE_UP,
        className: 'rotate-top rotate90',
        tooltip: 'Rotate up',
        icon: _freeSolidSvgIcons.faUndo
      }, {
        action: cameraControlsActions.ROTATE_DOWN,
        className: 'rotate-bottom rotate90',
        tooltip: 'Rotate down',
        icon: _freeSolidSvgIcons.faRedo
      }, {
        action: cameraControlsActions.ROTATE,
        className: 'auto-rotate',
        tooltip: 'Auto-Rotate',
        icon: _freeSolidSvgIcons.faVideo
      }, {
        action: cameraControlsActions.ROTATE_MZ,
        className: 'rotate-mz',
        tooltip: 'Rotate mz',
        icon: _freeSolidSvgIcons.faRedo
      }, {
        action: cameraControlsActions.ROTATE_Z,
        className: 'rotate-z',
        tooltip: 'Rotate z',
        icon: _freeSolidSvgIcons.faUndo
      }, {
        action: cameraControlsActions.ZOOM_IN,
        className: 'zoom-in',
        tooltip: 'Zoom in',
        icon: _freeSolidSvgIcons.faSearchPlus
      }, {
        action: cameraControlsActions.ZOOM_OUT,
        className: 'zoom-out',
        tooltip: 'Zoom out',
        icon: _freeSolidSvgIcons.faSearchMinus
      }];
      if (wireframeButtonEnabled) {
        buttons.push({
          action: cameraControlsActions.WIREFRAME,
          className: 'gpt-sphere_wireframe-jpg wireframe',
          tooltip: 'Toggle wireframe',
          icon: null
        });
      }
      var defaultButtonStyles = {
        color: '#fc6320'
      };
      var iconButtonStyles = buttonStyles ? buttonStyles : defaultButtonStyles;
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "position-toolbar"
      }, buttons.map(function (value, index) {
        return /*#__PURE__*/_react["default"].createElement(_IconButtonWithTooltip["default"], {
          key: index,
          disabled: false,
          onClick: function onClick() {
            return cameraControlsHandler(value.action);
          },
          className: "".concat(value.className, " squareB"),
          style: iconButtonStyles,
          tooltip: value.tooltip,
          icon: value.icon
        });
      }));
    }
  }]);
}(_react.Component);
CameraControls.defaultProps = {
  wireframeButtonEnabled: false
};
CameraControls.propTypes = {
  /**
   * Function to callback on camera controls changes
   */
  cameraControlsHandler: _propTypes["default"].func.isRequired,
  /**
   * Boolean to enable/disable wireframe button
   */
  wireframeButtonEnabled: _propTypes["default"].bool,
  /**
   * Styles to apply on the icon button elements
   */
  buttonStyles: _propTypes["default"].any
};
var _default = exports["default"] = CameraControls;
//# sourceMappingURL=CameraControls.js.map