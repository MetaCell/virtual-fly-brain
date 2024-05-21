"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _MenuPopper = _interopRequireDefault(require("./MenuPopper"));
var _MenuItem = _interopRequireDefault(require("@material-ui/core/MenuItem"));
var _ListItemIcon = _interopRequireDefault(require("@material-ui/core/ListItemIcon"));
var _excluded = ["action", "icon", "style"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
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
var MenuSingleItem = /*#__PURE__*/function (_React$Component) {
  function MenuSingleItem(props) {
    var _this;
    _classCallCheck(this, MenuSingleItem);
    _this = _callSuper(this, MenuSingleItem, [props]);
    _defineProperty(_this, "handleClick", function (event, action) {
      var currentTarget = event.currentTarget;
      _this.setState(function (state) {
        return {
          anchorEl: state.anchorEl ? null : currentTarget
        };
      });
      _this.props.menuHandler(action);
    });
    _defineProperty(_this, "handleMouseOver", function (event, index) {
      var currentTarget = event.currentTarget;
      if (_this.state.sectionOpened !== index) {
        _this.setState(function (state) {
          return {
            anchorEl: currentTarget,
            sectionOpened: index
          };
        });
      }
    });
    _this.state = {
      anchorEl: null,
      subMenuOpened: false,
      sectionOpened: undefined
    };
    _this.handleClick = _this.handleClick.bind(_this);
    _this.handleMouseOver = _this.handleMouseOver.bind(_this);
    return _this;
  }
  _inherits(MenuSingleItem, _React$Component);
  return _createClass(MenuSingleItem, [{
    key: "renderArrow",
    value: function renderArrow() {
      var customArrow = this.props.customArrow;
      return customArrow ? customArrow : /*#__PURE__*/_react["default"].createElement("i", {
        className: "fa fa-chevron-right",
        style: {
          marginLeft: '10px',
          position: 'absolute',
          marginRight: '0px',
          paddingRight: '0px',
          right: '5px'
        }
      });
    }
  }, {
    key: "renderMenuItem",
    value: function renderMenuItem(item, index) {
      var _this2 = this;
      if (!item.label) {
        return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, {
          key: index
        }, item); // Free markup, e.g. for dividers
      }
      var anchorEl = this.state.anchorEl;
      var labelsStyle = this.props.labelsStyle;
      var iconStyle = this.props.iconStyle;
      var menuToRender = undefined;
      var action = item.action,
        icon = item.icon,
        style = item.style,
        others = _objectWithoutProperties(item, _excluded);
      var mergedStyle = _objectSpread(_objectSpread(_objectSpread({}, labelsStyle), style), {}, {
        hover: _objectSpread(_objectSpread({}, labelsStyle === null || labelsStyle === void 0 ? void 0 : labelsStyle.hover), style === null || style === void 0 ? void 0 : style.hover),
        standard: _objectSpread(_objectSpread({}, labelsStyle === null || labelsStyle === void 0 ? void 0 : labelsStyle.standard), style === null || style === void 0 ? void 0 : style.standard)
      });
      var appliedStyle = anchorEl && index === Number(this.state.sectionOpened) ? mergedStyle.hover : mergedStyle.standard;
      if (anchorEl && index === Number(this.state.sectionOpened)) {
        var tempList = item.list ? item.list : item.dynamicListInjector ? this.props.menuHandlerDirect(item.dynamicListInjector) : null;
        if (tempList) {
          menuToRender = /*#__PURE__*/_react["default"].createElement(_MenuPopper["default"], {
            position: item.position,
            menuList: tempList,
            parentRef: anchorEl,
            menuHandler: this.props.menuHandler,
            menuHandlerDirect: this.props.menuHandlerDirect,
            awayClickHandler: this.props.awayClickHandler,
            drawersStyle: this.props.drawersStyle,
            labelsStyle: this.props.labelsStyle,
            iconStyle: this.props.iconStyle,
            itemOptions: {
              customArrow: this.props.customArrow
            }
          });
        }
      }
      return /*#__PURE__*/_react["default"].createElement(_MenuItem["default"], _extends({
        key: index,
        id: item.label,
        onClick: function onClick(e) {
          _this2.handleClick(e, item.action);
        },
        onMouseOver: function onMouseOver(e) {
          _this2.handleMouseOver(e, index);
        },
        ContainerProps: {
          menuHandlerDirect: this.props.menuHandlerDirect
        },
        menuaction: item.action,
        style: appliedStyle
      }, others), item.icon ? /*#__PURE__*/_react["default"].createElement(_ListItemIcon["default"], {
        style: iconStyle
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: item.icon
      })) : undefined, /*#__PURE__*/_react["default"].createElement("span", {
        className: "menu-item-label"
      }, item.label), item.list || item.dynamicListInjector ? /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, this.renderArrow(), menuToRender) : '');
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;
      var menuItems = this.props.menuList.map(function (item, index) {
        return _this3.renderMenuItem(item, index);
      });
      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, menuItems);
    }
  }]);
}(_react["default"].Component);
var _default = exports["default"] = MenuSingleItem;
//# sourceMappingURL=MenuSingleItem.js.map