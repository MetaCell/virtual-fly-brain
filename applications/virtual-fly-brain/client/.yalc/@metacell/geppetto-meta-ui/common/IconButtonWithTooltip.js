"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));
var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));
var _styles = require("@material-ui/core/styles");
var _reactFontawesome = require("@fortawesome/react-fontawesome");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var styles = {
  lightTooltip: {
    fontSize: 12
  }
};
var _default = exports["default"] = (0, _styles.withStyles)(styles)(function (_ref) {
  var _onClick = _ref.onClick,
    tooltip = _ref.tooltip,
    disabled = _ref.disabled,
    className = _ref.className,
    classes = _ref.classes,
    icon = _ref.icon,
    style = _ref.style;
  var faicon = icon ? /*#__PURE__*/_react["default"].createElement(_reactFontawesome.FontAwesomeIcon, {
    icon: icon,
    className: " fa-xs "
  }) : /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null);
  return /*#__PURE__*/_react["default"].createElement(_Tooltip["default"], {
    title: tooltip,
    placement: "left",
    disableFocusListener: true,
    disableTouchListener: true,
    classes: {
      tooltip: classes.lightTooltip
    }
  }, /*#__PURE__*/_react["default"].createElement(_IconButton["default"], {
    disabled: disabled,
    onClick: function onClick(event) {
      return _onClick(event);
    },
    className: className,
    disableRipple: true,
    style: style
  }, faicon));
});
//# sourceMappingURL=IconButtonWithTooltip.js.map