"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _MenuSingleItem = _interopRequireDefault(require("./MenuSingleItem"));
var _Fade = _interopRequireDefault(require("@material-ui/core/Fade"));
var _Paper = _interopRequireDefault(require("@material-ui/core/Paper"));
var _Popper = _interopRequireDefault(require("@material-ui/core/Popper"));
var _MenuList = _interopRequireDefault(require("@material-ui/core/MenuList"));
var _ClickAwayListener = _interopRequireDefault(require("@material-ui/core/ClickAwayListener"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
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
var MenuPopper = /*#__PURE__*/function (_React$Component) {
  function MenuPopper(props) {
    _classCallCheck(this, MenuPopper);
    return _callSuper(this, MenuPopper, [props]);
  }
  _inherits(MenuPopper, _React$Component);
  return _createClass(MenuPopper, [{
    key: "render",
    value: function render() {
      var _this = this;
      var anchorEl = this.props.parentRef;
      var open = Boolean(anchorEl);
      var id = open ? 'simple-popper' : null;
      if (anchorEl !== undefined || anchorEl !== null) {
        return /*#__PURE__*/_react["default"].createElement(_Popper["default"], {
          id: id,
          open: open,
          anchorEl: anchorEl,
          placement: String(this.props.position !== undefined ? this.props.position : "right-start"),
          transition: true
        }, function (_ref) {
          var TransitionProps = _ref.TransitionProps;
          return /*#__PURE__*/_react["default"].createElement(_Fade["default"], _extends({}, TransitionProps, {
            timeout: 50
          }), /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_ClickAwayListener["default"], {
            onClickAway: _this.props.awayClickHandler
          }, /*#__PURE__*/_react["default"].createElement(_Paper["default"], {
            style: _this.props.drawersStyle.standard,
            square: false
          }, /*#__PURE__*/_react["default"].createElement(_MenuList["default"], null, /*#__PURE__*/_react["default"].createElement(_MenuSingleItem["default"], _extends({
            position: _this.props.position,
            parentRef: anchorEl,
            menuList: _this.props.menuList,
            menuHandler: _this.props.menuHandler,
            menuHandlerDirect: _this.props.menuHandlerDirect,
            awayClickHandler: _this.props.awayClickHandler,
            drawersStyle: _this.props.drawersStyle,
            labelsStyle: _this.props.labelsStyle,
            iconStyle: _this.props.iconStyle
          }, _this.props.itemOptions)))))));
        });
      } else {
        return /*#__PURE__*/_react["default"].createElement("span", null);
      }
    }
  }]);
}(_react["default"].Component);
var _default = exports["default"] = MenuPopper;
//# sourceMappingURL=MenuPopper.js.map