"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@material-ui/core");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Backdrop = _interopRequireDefault(require("@material-ui/core/Backdrop"));
var _CircularProgress = _interopRequireDefault(require("@material-ui/core/CircularProgress"));
var _LinearProgress = _interopRequireDefault(require("@material-ui/core/LinearProgress"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));
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
    backdrop: {
      zIndex: theme.zIndex.drawer + 1
    },
    root: {
      position: 'absolute',
      flex: '0 0 100%',
      alignSelf: 'stretch'
    }
  };
};
var Loader = /*#__PURE__*/function (_Component) {
  function Loader(props) {
    var _this;
    _classCallCheck(this, Loader);
    _this = _callSuper(this, Loader, [props]);
    _this.state = {
      messageIndex: 0
    };
    return _this;
  }
  _inherits(Loader, _Component);
  return _createClass(Loader, [{
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$props = this.props,
        classes = _this$props.classes,
        active = _this$props.active,
        fullscreen = _this$props.fullscreen,
        handleClose = _this$props.handleClose,
        messages = _this$props.messages,
        elapsed = _this$props.elapsed,
        backgroundStyle = _this$props.backgroundStyle,
        children = _this$props.children,
        className = _this$props.className,
        messagesInterval = _this$props.messagesInterval;
      if (messagesInterval && messages.length) {
        setTimeout(function () {
          var messageIndex = _this2.state.messageIndex;
          var _this2$props = _this2.props,
            messages = _this2$props.messages,
            active = _this2$props.active;
          if (messages.length && active) {
            _this2.setState({
              messageIndex: (messageIndex + 1) % messages.length
            });
          }
        }, messagesInterval);
      }
      var message = messages.length > 0 ? messages[this.state.messageIndex % messages.length] : '';
      var progress = elapsed ? /*#__PURE__*/_react["default"].createElement(_LinearProgress["default"], {
        variant: "determinate",
        value: elapsed * 100,
        style: {
          width: '200px'
        }
      }) : /*#__PURE__*/_react["default"].createElement(_CircularProgress["default"], {
        color: "inherit"
      });
      var content = children ? children : /*#__PURE__*/_react["default"].createElement(_Grid["default"], {
        container: true,
        spacing: 1
      }, /*#__PURE__*/_react["default"].createElement(_Grid["default"], {
        container: true,
        item: true,
        spacing: 3,
        justify: "center"
      }, /*#__PURE__*/_react["default"].createElement(_Grid["default"], {
        item: true
      }, progress)), /*#__PURE__*/_react["default"].createElement(_Grid["default"], {
        container: true,
        item: true,
        spacing: 3,
        justify: "center"
      }, /*#__PURE__*/_react["default"].createElement(_Grid["default"], {
        item: true
      }, /*#__PURE__*/_react["default"].createElement(_Typography["default"], {
        className: className,
        display: "block",
        variant: "subtitle1",
        gutterBottom: true
      }, message))));
      var backdrop = fullscreen ? /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_Backdrop["default"], {
        className: classes.backdrop,
        open: active,
        onClick: handleClose,
        style: backgroundStyle
      }, content)) : /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_Backdrop["default"], {
        open: active,
        onClick: handleClose,
        style: backgroundStyle,
        className: classes.backdrop,
        classes: {
          root: classes.root
        } // class name, e.g. `classes-nesting-root-x` 
      }, content));
      return backdrop;
    }
  }]);
}(_react.Component);
Loader.defaultProps = {
  active: true,
  fullscreen: true,
  messages: [],
  messagesInterval: 10000,
  elapsed: null,
  backgroundStyle: {
    backgroundColor: 'rgba(255,142,0,0.1)'
  },
  handleClose: function handleClose() {}
};
Loader.propTypes = {
  /**
   * Flag to show/hide the Loader
   */
  active: _propTypes["default"].bool,
  /**
   * Flag to show/hide the Loader in fullscreen
   */
  fullscreen: _propTypes["default"].bool,
  /**
   * Function to handle the close of the Loader
   */
  handleClose: _propTypes["default"].func,
  /**
   * Array of Custom messages to display
   */
  messages: _propTypes["default"].array,
  /**
   * Number of milliseconds between custom messages
   */
  messagesInterval: _propTypes["default"].number,
  /**
   * Number of the progress value to show in linear determinate (in percentage)
   */
  elapsed: _propTypes["default"].number,
  /**
   * Style to be applied to the Loader background
   */
  backgroundStyle: _propTypes["default"].shape({
    /**
     * Loader's background color. Defaults to rgba(255,142,0,0.1)
     */
    backgroundColor: _propTypes["default"].string
  })
};
var _default = exports["default"] = (0, _core.withStyles)(styles)(Loader);
//# sourceMappingURL=Loader.js.map