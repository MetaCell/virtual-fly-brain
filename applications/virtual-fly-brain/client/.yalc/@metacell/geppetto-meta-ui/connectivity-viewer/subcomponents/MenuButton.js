"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _styles = require("@material-ui/core/styles");
var _Menu = _interopRequireDefault(require("@material-ui/core/Menu"));
var _MenuItem = _interopRequireDefault(require("@material-ui/core/MenuItem"));
var _IconButtonWithTooltip = _interopRequireDefault(require("../../common/IconButtonWithTooltip"));
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
  return {};
};
var MenuButton = /*#__PURE__*/function (_Component) {
  function MenuButton(props) {
    var _this;
    _classCallCheck(this, MenuButton);
    _this = _callSuper(this, MenuButton, [props]);
    _this.state = {
      anchorEl: null
    };
    _this.handleClose = _this.handleClose.bind(_this);
    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }
  _inherits(MenuButton, _Component);
  return _createClass(MenuButton, [{
    key: "handleClose",
    value: function handleClose(option) {
      var _this2 = this;
      if (option === "") {
        this.setState(function () {
          return {
            anchorEl: null
          };
        });
      } else {
        this.setState(function () {
          return {
            anchorEl: null
          };
        }, function () {
          return _this2.props.handler(option);
        });
      }
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      this.setState({
        anchorEl: event.currentTarget
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;
      var _this$props = this.props,
        id = _this$props.id,
        options = _this$props.options,
        theme = _this$props.theme,
        defaultOption = _this$props.defaultOption,
        tooltip = _this$props.tooltip,
        icon = _this$props.icon,
        buttonStyles = _this$props.buttonStyles;
      var anchorEl = this.state.anchorEl;
      var ITEM_HEIGHT = 48;
      var defaultButtonStyles = {
        color: '#fc6320',
        padding: theme.spacing(1),
        top: theme.spacing(0)
      };
      var iconButtonStyles = buttonStyles ? buttonStyles : defaultButtonStyles;
      return /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_IconButtonWithTooltip["default"], {
        disabled: false,
        onClick: this.handleClick,
        style: iconButtonStyles,
        tooltip: tooltip,
        icon: icon
      }), /*#__PURE__*/_react["default"].createElement(_Menu["default"], {
        id: id,
        anchorEl: anchorEl,
        keepMounted: true,
        open: Boolean(anchorEl),
        onClose: function onClose() {
          return _this3.handleClose("");
        },
        PaperProps: {
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: 200
          }
        }
      }, Object.keys(options).map(function (option) {
        return /*#__PURE__*/_react["default"].createElement(_MenuItem["default"], {
          key: option,
          selected: option === defaultOption,
          onClick: function onClick() {
            return _this3.handleClose(option);
          }
        }, options[option]);
      })));
    }
  }]);
}(_react.Component);
var _default = exports["default"] = (0, _styles.withStyles)(styles, {
  withTheme: true
})(MenuButton);
//# sourceMappingURL=MenuButton.js.map