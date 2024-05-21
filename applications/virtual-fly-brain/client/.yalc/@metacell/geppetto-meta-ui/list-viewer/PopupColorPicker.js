"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _Popover = _interopRequireDefault(require("@material-ui/core/Popover"));
var _reactColor = require("react-color");
var _BaseIconComponent = _interopRequireDefault(require("./BaseIconComponent"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
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
var styles = {
  container: {
    position: 'relative'
  },
  popover: {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'center'
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'center'
    }
  }
};
var PopupColorPicker = exports["default"] = /*#__PURE__*/function (_React$Component) {
  function PopupColorPicker(props) {
    var _this;
    _classCallCheck(this, PopupColorPicker);
    _this = _callSuper(this, PopupColorPicker, [props]);
    _this.state = {
      anchorEl: null,
      color: props.color ? props.color : '#FFFFFF'
    };
    _this.Picker = _this.props.picker ? _this.props.picker : _reactColor.CompactPicker;
    return _this;
  }
  _inherits(PopupColorPicker, _React$Component);
  return _createClass(PopupColorPicker, [{
    key: "handleClick",
    value: function handleClick(currentTarget) {
      this.setState({
        anchorEl: currentTarget
      });
    }
  }, {
    key: "handleClose",
    value: function handleClose() {
      this.setState({
        anchorEl: null
      });
    }
  }, {
    key: "handleChange",
    value: function handleChange(color) {
      this.setState({
        color: color.hex,
        anchorEl: null
      });
      this.props.action(color.hex);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$state = this.state,
        color = _this$state.color,
        anchorEl = _this$state.anchorEl;
      var open = Boolean(anchorEl);
      var container;
      if (open) {
        var colorPicker = /*#__PURE__*/_react["default"].createElement(this.Picker, {
          color: color,
          onChange: function onChange(color) {
            return _this2.handleChange(color);
          }
        });
        container = /*#__PURE__*/_react["default"].createElement(_Popover["default"], {
          open: open,
          anchorEl: anchorEl,
          onClose: function onClose() {
            return _this2.handleClose();
          },
          anchorOrigin: styles.popover.anchorOrigin,
          transformOrigin: styles.popover.transformOrigin
        }, colorPicker);
      } else {
        container = null;
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        style: styles.container
      }, /*#__PURE__*/_react["default"].createElement(_BaseIconComponent["default"], {
        action: function action(e) {
          return _this2.handleClick(e.currentTarget);
        },
        color: color,
        icon: this.props.icon ? this.props.icon : "tint"
      }), container);
    }
  }]);
}(_react["default"].Component);
//# sourceMappingURL=PopupColorPicker.js.map