"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FloatingWindowTab = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _Types = require("../Types");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
/** @hidden @internal */

/** @hidden @internal */
var FloatingWindowTab = exports.FloatingWindowTab = function FloatingWindowTab(props) {
  var layout = props.layout,
    node = props.node,
    factory = props.factory;
  var cm = layout.getClassName;
  var child = factory(node);
  return /*#__PURE__*/React.createElement("div", {
    className: cm(_Types.CLASSES.FLEXLAYOUT__FLOATING_WINDOW_TAB)
  }, /*#__PURE__*/React.createElement(_react.Fragment, null, child));
};
//# sourceMappingURL=FloatingWindowTab.js.map