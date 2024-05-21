"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _reactFontawesome = _interopRequireDefault(require("react-fontawesome"));
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var BaseIconComponent = function BaseIconComponent(_ref) {
  var icon = _ref.icon,
    action = _ref.action,
    color = _ref.color,
    tooltip = _ref.tooltip;
  return /*#__PURE__*/_react["default"].createElement("span", {
    style: {
      color: color
    },
    className: "list-icon",
    title: tooltip,
    onClick: action
  }, /*#__PURE__*/_react["default"].createElement(_reactFontawesome["default"], {
    name: icon
  }));
};
var _default = exports["default"] = BaseIconComponent;
//# sourceMappingURL=BaseIconComponent.js.map