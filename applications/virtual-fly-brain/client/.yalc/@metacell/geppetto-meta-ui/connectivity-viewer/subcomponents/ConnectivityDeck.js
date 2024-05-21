"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _Card = _interopRequireDefault(require("@material-ui/core/Card"));
var _Modal = _interopRequireDefault(require("@material-ui/core/Modal"));
var _core = require("@material-ui/core");
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _CardContent = _interopRequireDefault(require("@material-ui/core/CardContent"));
var _CardActionArea = _interopRequireDefault(require("@material-ui/core/CardActionArea"));
var _IconButtonWithTooltip = _interopRequireDefault(require("../../common/IconButtonWithTooltip"));
var _Matrix = require("../layouts/Matrix");
var _Force = require("../layouts/Force");
var _Hive = require("../layouts/Hive");
var _Chord = require("../layouts/Chord");
var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");
var _matrix = _interopRequireDefault(require("../images/matrix.svg"));
var _force = _interopRequireDefault(require("../images/force.svg"));
var _hive = _interopRequireDefault(require("../images/hive.svg"));
var _chord = _interopRequireDefault(require("../images/chord.svg"));
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
var defaultColor = '#fc6320';
var getColor = function getColor(props) {
  var _props$styles, _props$styles2;
  return props !== null && props !== void 0 && (_props$styles = props.styles) !== null && _props$styles !== void 0 && _props$styles.color ? props === null || props === void 0 || (_props$styles2 = props.styles) === null || _props$styles2 === void 0 ? void 0 : _props$styles2.color : defaultColor;
};
var styles = function styles(theme) {
  return {
    cardDeckWrapper: {
      border: 0,
      outline: 0,
      marginRight: theme.spacing(-2),
      marginLeft: theme.spacing(-2)
    },
    cardWrapperTitle: function cardWrapperTitle(props) {
      return {
        fontSize: "40px",
        fontWeight: "300",
        marginTop: theme.spacing(10),
        color: getColor(props),
        textAlign: "center"
      };
    },
    cardDeck: {
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(10),
      marginLeft: theme.spacing(10),
      display: "table",
      tableLayout: "fixed",
      borderSpacing: "15px 0"
    },
    card: function card(props) {
      return {
        borderRadius: 0,
        border: 0,
        cursor: "pointer",
        padding: theme.spacing(2),
        background: theme.palette.background["default"],
        display: "table-cell",
        width: "1%",
        verticalAlign: "top",
        "&:hover": {
          border: "1px solid",
          borderColor: getColor(props)
        }
      };
    },
    img: {
      display: 'block',
      margin: 'auto',
      width: '100px'
    },
    cardText: {
      textAlign: 'center',
      color: "white"
    },
    cardTitle: function cardTitle(props) {
      return {
        marginTop: theme.spacing(1),
        color: getColor(props),
        marginBottom: "0.5em"
      };
    },
    cardAction: {
      height: "100%"
    },
    cardImgTopCenterBlock: {
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
      borderRadius: "4px 4px 0 0"
    },
    cardActionDisabled: {
      height: "100%",
      opacity: "0.2"
    },
    button: function button(props) {
      return {
        padding: theme.spacing(1),
        top: theme.spacing(0),
        color: getColor(props)
      };
    }
  };
};
var ConnectivityDeck = /*#__PURE__*/function (_Component) {
  function ConnectivityDeck(props) {
    var _this;
    _classCallCheck(this, ConnectivityDeck);
    _this = _callSuper(this, ConnectivityDeck, [props]);
    _this.state = {
      open: false
    };
    _this.deck = [{
      title: "Adjacency matrix",
      subtitle: "A coloured square at row 𝒊, column 𝒋 represents a directed connection from node 𝒋 to node 𝒊.",
      handler: _this.props.handler.bind(_this, new _Matrix.Matrix()),
      disabled: false,
      img: _matrix["default"]
    }, {
      title: "Force-directed layout",
      subtitle: "Draw circles for nodes, lines for connections, disregarding spatial information. ",
      handler: _this.props.handler.bind(_this, new _Force.Force()),
      disabled: false,
      img: _force["default"]
    }, {
      title: "Hive plot",
      subtitle: "Axes correspond to node categories, arcs to connections." + "The position of each node along an axis is determined by " + "the total number of connections it makes.",
      handler: _this.props.handler.bind(_this, new _Hive.Hive(true)),
      disabled: false,
      img: _hive["default"]
    }, {
      title: "Chord diagram",
      subtitle: "Circular slices correspond to node categories, chords to " + "connections. A gap between slice and chord indicate an " + "incoming connection. Use ctrl(shift) + mouse hover to " + "hide incoming(outgoing) connections from a population.",
      handler: _this.props.handler.bind(_this, new _Chord.Chord(false)),
      disabled: false,
      img: _chord["default"]
    }];
    return _this;
  }
  _inherits(ConnectivityDeck, _Component);
  return _createClass(ConnectivityDeck, [{
    key: "render",
    value: function render() {
      var _this2 = this;
      var open = this.state.open;
      var classes = this.props.classes;
      return /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_IconButtonWithTooltip["default"], {
        disabled: false,
        onClick: function onClick() {
          return _this2.setState({
            open: true
          });
        },
        className: classes.button,
        icon: _freeSolidSvgIcons.faCog,
        tooltip: "Open layout selector"
      }), /*#__PURE__*/_react["default"].createElement(_Modal["default"], {
        open: open,
        disableAutoFocus: true,
        onClose: function onClose() {
          return _this2.setState({
            open: false
          });
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: classes.cardDeckWrapper
      }, /*#__PURE__*/_react["default"].createElement("p", {
        className: classes.cardWrapperTitle
      }, "How would you like to represent your network?"), /*#__PURE__*/_react["default"].createElement("div", {
        className: classes.cardDeck
      }, this.deck.map(function (_ref) {
        var title = _ref.title,
          subtitle = _ref.subtitle,
          handler = _ref.handler,
          disabled = _ref.disabled,
          img = _ref.img;
        return /*#__PURE__*/_react["default"].createElement(_Card["default"], {
          raised: true,
          className: classes.card,
          key: title
        }, /*#__PURE__*/_react["default"].createElement(_CardActionArea["default"], {
          className: disabled ? classes.cardActionDisabled : classes.cardAction,
          onClick: function onClick() {
            handler();
            _this2.setState({
              open: false
            });
          },
          disabled: disabled
        }, /*#__PURE__*/_react["default"].createElement(_CardContent["default"], {
          className: classes.cardText
        }, /*#__PURE__*/_react["default"].createElement("img", {
          className: classes.cardImgTopCenterBlock,
          src: img
        }), /*#__PURE__*/_react["default"].createElement(_Typography["default"], {
          className: classes.cardTitle,
          variant: "h5"
        }, title), /*#__PURE__*/_react["default"].createElement(_Typography["default"], {
          component: "p"
        }, subtitle))));
      })))));
    }
  }]);
}(_react.Component);
var _default = exports["default"] = (0, _core.withStyles)(styles)(ConnectivityDeck);
//# sourceMappingURL=ConnectivityDeck.js.map