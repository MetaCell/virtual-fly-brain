"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tab = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _Actions = _interopRequireDefault(require("../model/Actions"));
var _TabSetNode = _interopRequireDefault(require("../model/TabSetNode"));
var _Types = require("../Types");
var _ = require("..");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/** @hidden @internal */

/** @hidden @internal */
var Tab = exports.Tab = function Tab(props) {
  var layout = props.layout,
    selected = props.selected,
    node = props.node,
    factory = props.factory;
  var _React$useState = React.useState(!props.node.isEnableRenderOnDemand() || props.selected),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    renderComponent = _React$useState2[0],
    setRenderComponent = _React$useState2[1];
  React.useLayoutEffect(function () {
    if (!renderComponent && selected) {
      // load on demand
      // console.log("load on demand: " + node.getName());
      setRenderComponent(true);
    }
  });
  var onMouseDown = function onMouseDown() {
    var parent = node.getParent();
    if (parent.getType() === _TabSetNode["default"].TYPE) {
      if (!parent.isActive()) {
        layout.doAction(_Actions["default"].setActiveTabset(parent.getId()));
      }
    }
  };
  var cm = layout.getClassName;
  var parentNode = node.getParent();
  var style = node._styleWithPosition({
    display: selected ? "block" : "none"
  });
  if (parentNode instanceof _TabSetNode["default"]) {
    if (node.getModel().getMaximizedTabset() !== undefined && !parentNode.isMaximized()) {
      style.display = "none";
    }
  }
  var child;
  if (renderComponent) {
    child = factory(node);
  }
  var className = cm(_Types.CLASSES.FLEXLAYOUT__TAB);
  if (parentNode instanceof _.BorderNode) {
    className += " " + cm(_Types.CLASSES.FLEXLAYOUT__TAB_BORDER);
    className += " " + cm(_Types.CLASSES.FLEXLAYOUT__TAB_BORDER_ + parentNode.getLocation().getName());
  }
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    onMouseDown: onMouseDown,
    onTouchStart: onMouseDown,
    style: style
  }, /*#__PURE__*/React.createElement(_react.Fragment, null, child));
};
//# sourceMappingURL=Tab.js.map