"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _MenuSection = _interopRequireDefault(require("./MenuSection"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
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
// TODO: these styles are not in line with the new styling principles, currently needed for vfb as 05/20/2020
var menuStyle = {
  buttonsStyle: {
    standard: {
      background: '#010101',
      borderRadius: 0,
      border: 0,
      boxShadow: '0px 0px',
      color: '#ffffff',
      fontSize: '16px',
      fontFamily: 'Khand, sans-serif',
      margin: '0px 0px 0px 0px',
      minWidth: '44px',
      height: '30px',
      textTransform: 'capitalize',
      textAlign: 'left',
      justifyContent: 'start',
      marginTop: '1px'
    },
    hover: {
      background: '#11bffe',
      backgroundColor: '#11bffe',
      borderRadius: 0,
      border: 0,
      boxShadow: '0px 0px',
      color: '#ffffff',
      fontSize: '16px',
      fontFamily: 'Khand, sans-serif',
      margin: '0px 0px 0px 0px',
      minWidth: '44px',
      height: '30px',
      textTransform: 'capitalize',
      textAlign: 'left',
      justifyContent: 'start',
      marginTop: '1px'
    }
  },
  drawersStyle: {
    standard: {
      top: '1px',
      backgroundColor: '#444141f2',
      borderRadius: 0,
      color: '#ffffff',
      fontSize: '12px',
      fontFamily: 'Khand, sans-serif',
      minWidth: '110px',
      borderLeft: '1px solid #585858',
      borderRight: '1px solid #585858',
      borderBottom: '1px solid #585858',
      borderBottomLeftRadius: '2px',
      borderBottomRightRadius: '2px'
    }
  },
  labelsStyle: {
    standard: {
      backgroundColor: '#44414112',
      '&:hover': {
        background: '#11bffe',
        backgroundColor: '#11bffe',
        color: '#ffffff'
      },
      borderRadius: 0,
      color: '#ffffff',
      fontSize: '14px',
      fontFamily: 'Khand, sans-serif',
      paddingTop: 0,
      paddingBottom: 0
    },
    hover: {
      background: '#11bffe',
      backgroundColor: '#11bffe',
      '&:hover': {
        background: '#11bffe',
        backgroundColor: '#11bffe',
        color: '#ffffff'
      },
      borderRadius: 0,
      color: '#ffffff',
      fontSize: '14px',
      fontFamily: 'Khand, sans-serif',
      paddingTop: 0,
      paddingBottom: 0
    }
  },
  iconStyle: {
    display: 'inline-block',
    color: '#ffffff',
    minWidth: '25px',
    width: '25px'
  }
};
var Menu = /*#__PURE__*/function (_React$Component) {
  function Menu(props) {
    var _this;
    _classCallCheck(this, Menu);
    _this = _callSuper(this, Menu, [props]);
    _this.state = {
      menuOpen: false,
      sectionOpened: undefined
    };
    _this.menuClick = _this.menuClick.bind(_this);
    _this.menuHandler = _this.menuHandler.bind(_this);
    return _this;
  }
  _inherits(Menu, _React$Component);
  return _createClass(Menu, [{
    key: "menuClick",
    value: function menuClick(clicked, index) {
      this.setState({
        menuOpen: clicked,
        sectionOpened: index
      });
    }
  }, {
    key: "menuHandler",
    value: function menuHandler(action) {
      var _this2 = this;
      this.setState({
        menuOpen: false,
        sectionOpened: undefined
      }, function () {
        if (action !== '') {
          _this2.props.menuHandler(action);
        }
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      // We need a way to close the menu on zoom, scroll, right click, etc events on other parts of the application
      if (this.props.open === false && prevProps.open === true) {
        this.menuHandler('');
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;
      var buttonsStyle = _objectSpread(_objectSpread({}, menuStyle.buttonsStyle), this.props.configuration.global.buttonsStyle);
      var drawersStyle = _objectSpread(_objectSpread({}, menuStyle.drawersStyle), this.props.configuration.global.drawersStyle);
      var labelsStyle = _objectSpread(_objectSpread({}, menuStyle.labelsStyle), this.props.configuration.global.labelsStyle);
      var iconStyle = _objectSpread(_objectSpread({}, menuStyle.iconStyle), this.props.configuration.global.iconStyle);
      var itemOptions = this.props.configuration.itemOptions;
      var buttonsToRender = this.props.configuration.buttons.map(function (button, index) {
        return /*#__PURE__*/_react["default"].createElement(_MenuSection["default"], {
          id: index,
          key: index,
          button: button,
          list: button.list,
          menuHandler: _this3.menuHandler,
          menuHandlerDirect: _this3.props.menuHandler,
          menuClickHandler: _this3.menuClick,
          menuOpen: _this3.state.menuOpen,
          sectionOpened: _this3.state.sectionOpened,
          buttonsStyle: buttonsStyle,
          drawersStyle: drawersStyle,
          labelsStyle: labelsStyle,
          iconStyle: iconStyle,
          itemOptions: itemOptions
        });
      });
      return /*#__PURE__*/_react["default"].createElement("span", null, buttonsToRender);
    }
  }]);
}(_react["default"].Component);
Menu.defaultProps = {
  configuration: {},
  menuHandler: function menuHandler() {}
};
Menu.propTypes = {
  /**
   * All the required and optional configurations for instantiating a new instance of a Menu
   *
   */
  configuration: _propTypes["default"].shape({
    /**
     * The property button defines the list of buttons the menu will have at the first level
     */
    buttons: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      /**
       * Defines the name displayed on the button itself.
       */
      label: _propTypes["default"].any.isRequired,
      /**
       * Defines where the window with the full menu expanded for that button has to appear. this might be one of the
       * following choices: 'bottom-end', 'bottom-start', 'bottom', 'left-end', 'left-start', 'left', 'right-end',
       * 'right-start', 'right', 'top-end', 'top-start', 'top'.
       */
      position: _propTypes["default"].oneOf(['bottom-end', 'bottom-start', 'bottom', 'left-end', 'left-start', 'left', 'right-end', 'right-start', 'right', 'top-end', 'top-start', 'top']),
      /**
       * Defines the list of objects that we need to use to populate the 1st level menu
       */
      list: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        /**
         * Defines the name displayed on the menu item.
         */
        label: _propTypes["default"].string.isRequired,
        /**
         * Another object that contains handlerAction property, the handlerAction property function triggers when the
         * Menu item associated with it is clicked.
         */
        action: _propTypes["default"].shape({
          /**
           * The name of the action to be triggered when the Menu item is clicked, will be used by the handler function to
           * decide which action has to be executed for this menu item.
           */
          handlerAction: _propTypes["default"].string.isRequired,
          /**
           * Parameters associated with the handlerAction when needed.
           */
          parameters: _propTypes["default"].arrayOf(_propTypes["default"].string.isRequired)
        }).isRequired
      })).isRequired,
      /**
       * If the property 'list' is not provided we can use the property dynamicListInjector and connect this to the
       * menuHandler to feed this button with a dynamic list created by the menu handler.
       */
      dynamicListInjector: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        /**
         * Defines the name displayed on the menu item.
         */
        label: _propTypes["default"].string.isRequired,
        /**
         * Another object that contains handlerAction property, the handlerAction property function triggers when the
         * Menu item associated with it is clicked.
         */
        action: _propTypes["default"].shape({
          /**
           * The name of the action to be triggered when the Menu item is clicked, will be used by the handler function to
           * decide which action has to be executed for this menu item.
           */
          handlerAction: _propTypes["default"].string.isRequired,
          /**
           * Parameters associated with the handlerAction when needed.
           */
          parameters: _propTypes["default"].arrayOf(_propTypes["default"].string.isRequired)
        })
      }))
    })).isRequired
  }),
  /**
   * Function to handle the menu
   */
  menuHandler: _propTypes["default"].func
};
var _default = exports["default"] = Menu;
//# sourceMappingURL=Menu.js.map