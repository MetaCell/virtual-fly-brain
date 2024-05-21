"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _ConnectivityDeck = _interopRequireDefault(require("./ConnectivityDeck"));
var _MenuButton = _interopRequireDefault(require("./MenuButton"));
var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");
var _CustomToolbar = _interopRequireDefault(require("../../common/CustomToolbar"));
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
var LEGENDS_TOOLTIP = "Toggle legend";
var ConnectivityToolbar = exports["default"] = /*#__PURE__*/function (_Component) {
  function ConnectivityToolbar(props) {
    _classCallCheck(this, ConnectivityToolbar);
    return _callSuper(this, ConnectivityToolbar, [props]);
  }
  _inherits(ConnectivityToolbar, _Component);
  return _createClass(ConnectivityToolbar, [{
    key: "getCustomButtons",
    value: function getCustomButtons() {
      var _this = this;
      var customButtons = [];
      if (this.props.layout.hasToggle()) {
        customButtons.push({
          'icon': _freeSolidSvgIcons.faList,
          'id': 'legendButton',
          'tooltip': LEGENDS_TOOLTIP,
          'action': function action() {
            return _this.props.legendHandler();
          }
        });
        return customButtons;
      }
    }
  }, {
    key: "getCustomElements",
    value: function getCustomElements() {
      var _this2 = this;
      var _this$props = this.props,
        id = _this$props.id,
        deckHandler = _this$props.deckHandler,
        layout = _this$props.layout,
        sortOptionsHandler = _this$props.sortOptionsHandler,
        options = _this$props.options;
      var menuButtonStyles = options.menuButtonStyles,
        deckStyles = options.deckStyles;
      var sortOptions = {
        'id': 'By entity name',
        'pre_count': 'By # pre',
        'post_count': 'By # post'
      };
      var deck = /*#__PURE__*/_react["default"].createElement(_ConnectivityDeck["default"], {
        key: id + '_deck',
        id: id + '_deck',
        ref: function ref(deck) {
          _this2.deck = deck;
        },
        handler: deckHandler,
        styles: deckStyles
      });
      var customElements = [deck];
      if (layout.hasSelect()) {
        customElements.push( /*#__PURE__*/_react["default"].createElement(_MenuButton["default"], {
          key: id + '_select',
          id: id + '_select',
          options: sortOptions,
          handler: sortOptionsHandler,
          defaultOption: "id",
          tooltip: "Order by",
          icon: _freeSolidSvgIcons.faSort,
          buttonStyles: menuButtonStyles
        }));
      }
      return customElements;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
        toolbarVisibility = _this$props2.toolbarVisibility,
        options = _this$props2.options;
      var visibility = toolbarVisibility ? "visible" : "hidden";
      var customElements = this.getCustomElements();
      var customButtons = this.getCustomButtons();
      var toolbar = options && options.instance ? /*#__PURE__*/_react["default"].createElement(options.instance, _extends({
        buttons: customButtons
      }, options.props)) : /*#__PURE__*/_react["default"].createElement(_CustomToolbar["default"], {
        buttons: customButtons,
        elements: customElements,
        containerStyles: options === null || options === void 0 ? void 0 : options.containerStyles,
        toolBarClassName: options === null || options === void 0 ? void 0 : options.toolBarClassName,
        innerDivStyles: options === null || options === void 0 ? void 0 : options.innerDivStyles,
        buttonStyles: options === null || options === void 0 ? void 0 : options.buttonStyles
      });
      return /*#__PURE__*/_react["default"].createElement("span", {
        style: {
          visibility: visibility
        }
      }, toolbar);
    }
  }]);
}(_react.Component);
//# sourceMappingURL=ConnectivityToolbar.js.map