"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _MenuPopper = _interopRequireDefault(require("./MenuPopper"));
var _Button = _interopRequireDefault(require("@material-ui/core/Button"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
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
var MenuSection = /*#__PURE__*/function (_React$Component) {
  function MenuSection(props) {
    var _this;
    _classCallCheck(this, MenuSection);
    _this = _callSuper(this, MenuSection, [props]);
    _defineProperty(_this, "handleClick", function (event) {
      if (_this.props.list === undefined || _this.props.list.length === 0) {
        if (Object.prototype.hasOwnProperty.call(_this.props.button, 'dynamicListInjector')) {
          _this.tempList = _this.props.menuHandlerDirect(_this.props.button.dynamicListInjector);
          var currentTarget = event.currentTarget;
          if (_this.state.anchorEl !== null) {
            _this.props.menuClickHandler(false, undefined);
          } else {
            _this.props.menuClickHandler(true, _this.props.id);
          }
          _this.setState(function (state) {
            return {
              anchorEl: state.anchorEl ? null : currentTarget,
              customList: _this.tempList
            };
          });
        } else {
          return;
        }
      } else {
        var _currentTarget = event.currentTarget;
        if (_this.state.anchorEl !== null) {
          _this.props.menuClickHandler(false, undefined);
        } else {
          _this.props.menuClickHandler(true, _this.props.id);
        }
        _this.setState(function (state) {
          return {
            anchorEl: state.anchorEl ? null : _currentTarget
          };
        });
      }
    });
    _defineProperty(_this, "handleAwayListener", function (event) {
      var currentTarget = event.currentTarget;
      if (currentTarget.activeElement !== _this.state.anchorEl) {
        _this.props.menuClickHandler(false, undefined);
        _this.setState({
          anchorEl: null
        });
      }
    });
    _defineProperty(_this, "handleOver", function (event) {
      var currentTarget = event.currentTarget;
      _this.setState({
        hover: true
      });
      if (_this.props.menuOpen && _this.props.sectionOpened !== _this.props.id) {
        if (_this.props.list === undefined || _this.props.list.length === 0) {
          if (Object.prototype.hasOwnProperty.call(_this.props.button, 'dynamicListInjector')) {
            _this.tempList = _this.props.menuHandlerDirect(_this.props.button.dynamicListInjector);
          } else {
            return;
          }
        }
        _this.setState({
          anchorEl: currentTarget,
          customList: _this.tempList
        }, function () {
          _this.props.menuClickHandler(true, _this.props.id);
        });
      }
    });
    _defineProperty(_this, "handleOut", function (event) {
      _this.setState({
        hover: false
      });
    });
    _this.state = {
      anchorEl: null,
      customList: undefined,
      hover: false
    };
    _this.handleOut = _this.handleOut.bind(_this);
    _this.handleOver = _this.handleOver.bind(_this);
    _this.handleClick = _this.handleClick.bind(_this);
    _this.handleAwayListener = _this.handleAwayListener.bind(_this);
    _this.tempList = undefined;
    return _this;
  }
  _inherits(MenuSection, _React$Component);
  return _createClass(MenuSection, [{
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.sectionOpened !== this.props.id && this.props.menuOpen === true && this.state.anchorEl !== null) {
        this.setState({
          anchorEl: null
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var anchorEl = this.state.anchorEl;
      var open = Boolean(anchorEl);
      var id = open ? 'simple-popper' : null;
      var customStyle = this.props.itemOptions;
      var buttonClasses;
      if (open || this.state.hover) {
        var _this$props$buttonsSt, _this$props$button, _this$props$buttonsSt2, _this$props$button2;
        buttonClasses = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, (_this$props$buttonsSt = this.props.buttonsStyle) === null || _this$props$buttonsSt === void 0 ? void 0 : _this$props$buttonsSt.standard), (_this$props$button = this.props.button) === null || _this$props$button === void 0 || (_this$props$button = _this$props$button.style) === null || _this$props$button === void 0 ? void 0 : _this$props$button.standard), (_this$props$buttonsSt2 = this.props.buttonsStyle) === null || _this$props$buttonsSt2 === void 0 ? void 0 : _this$props$buttonsSt2.hover), (_this$props$button2 = this.props.button) === null || _this$props$button2 === void 0 || (_this$props$button2 = _this$props$button2.style) === null || _this$props$button2 === void 0 ? void 0 : _this$props$button2.hover);
      } else {
        var _this$props$buttonsSt3, _this$props$button3;
        buttonClasses = _objectSpread(_objectSpread({}, (_this$props$buttonsSt3 = this.props.buttonsStyle) === null || _this$props$buttonsSt3 === void 0 ? void 0 : _this$props$buttonsSt3.standard), (_this$props$button3 = this.props.button) === null || _this$props$button3 === void 0 || (_this$props$button3 = _this$props$button3.style) === null || _this$props$button3 === void 0 ? void 0 : _this$props$button3.standard);
      }
      return /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_Button["default"], {
        style: buttonClasses,
        size: "small",
        id: typeof this.props.button.label === 'string' ? this.props.button.label : 'geppetto-menu-btn',
        variant: "contained",
        "aria-describedby": id,
        onClick: this.handleClick,
        onMouseOver: this.handleOver,
        onMouseOut: this.handleOut
      }, this.props.button.icon !== "" ? this.props.button.caret ? this.props.button.caret.show ? /*#__PURE__*/_react["default"].createElement("span", {
        style: {
          color: this.props.button.activeColor
        }
      }, this.props.button.icon ? this.props.button.icon : null, this.props.menuOpen ? this.props.button.caret.closedIcon : this.props.button.caret.expandedIcon) : /*#__PURE__*/_react["default"].createElement("span", {
        style: {
          display: "inline-block",
          color: this.props.button.activeColor
        }
      }, this.props.button.icon ? this.props.button.icon : null) : /*#__PURE__*/_react["default"].createElement("span", {
        style: {
          display: "inline-block",
          color: this.props.button.activeColor
        }
      }, this.props.button.icon ? this.props.button.icon : null) : undefined, this.props.button.label), /*#__PURE__*/_react["default"].createElement(_MenuPopper["default"], {
        parentRef: anchorEl,
        parentHandler: this.handleClick,
        menuList: this.props.button.list !== undefined ? this.props.button.list : this.state.customList,
        menuHandler: this.props.menuHandler,
        menuHandlerDirect: this.props.menuHandlerDirect,
        awayClickHandler: this.handleAwayListener,
        position: this.props.button.position !== undefined ? this.props.button.position : 'right',
        drawersStyle: this.props.drawersStyle,
        labelsStyle: this.props.labelsStyle,
        iconStyle: this.props.iconStyle,
        itemOptions: this.props.itemOptions
      }));
    }
  }]);
}(_react["default"].Component);
var _default = exports["default"] = MenuSection;
//# sourceMappingURL=MenuSection.js.map