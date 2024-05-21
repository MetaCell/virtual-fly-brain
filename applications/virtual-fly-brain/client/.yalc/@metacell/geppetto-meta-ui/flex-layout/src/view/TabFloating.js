"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabFloating = void 0;
var React = _interopRequireWildcard(require("react"));
var _Actions = _interopRequireDefault(require("../model/Actions"));
var _TabSetNode = _interopRequireDefault(require("../model/TabSetNode"));
var _Types = require("../Types");
var _I18nLabel = require("../I18nLabel");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
/** @hidden @internal */

/** @hidden @internal */
var TabFloating = exports.TabFloating = function TabFloating(props) {
  var layout = props.layout,
    selected = props.selected,
    node = props.node;
  var onMouseDown = function onMouseDown() {
    var parent = node.getParent();
    if (parent.getType() === _TabSetNode["default"].TYPE) {
      if (!parent.isActive()) {
        layout.doAction(_Actions["default"].setActiveTabset(parent.getId()));
      }
    }
  };
  var onClickFocus = function onClickFocus(event) {
    event.preventDefault();
    if (node.getWindow()) {
      node.getWindow().focus();
    }
  };
  var onClickDock = function onClickDock(event) {
    event.preventDefault();
    layout.doAction(_Actions["default"].unFloatTab(node.getId()));
  };
  var cm = layout.getClassName;
  var style = node._styleWithPosition({
    display: selected ? "flex" : "none"
  });
  var message = layout.i18nName(_I18nLabel.I18nLabel.Floating_Window_Message);
  var showMessage = layout.i18nName(_I18nLabel.I18nLabel.Floating_Window_Show_Window);
  var dockMessage = layout.i18nName(_I18nLabel.I18nLabel.Floating_Window_Dock_Window);
  return /*#__PURE__*/React.createElement("div", {
    className: cm(_Types.CLASSES.FLEXLAYOUT__TAB_FLOATING),
    onMouseDown: onMouseDown,
    onTouchStart: onMouseDown,
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: cm(_Types.CLASSES.FLEXLAYOUT__TAB_FLOATING_INNER)
  }, /*#__PURE__*/React.createElement("div", null, message), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: onClickFocus
  }, showMessage)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: onClickDock
  }, dockMessage))));
};
//# sourceMappingURL=TabFloating.js.map